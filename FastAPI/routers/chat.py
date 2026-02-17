import json
from asyncio import sleep

from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from google import genai
from google.genai import types

from RAG.main import rag


class Prompt(BaseModel):
    user_query: str


router = APIRouter(prefix="/chat", tags=["chat"])

client = genai.Client(api_key="AIzaSyD336MYSkpfIK0J6kAbgse9D32jblhtsdk")


async def generate(user_query: str):
    try:
        rag_context = rag(user_query)
        for chunk in client.models.generate_content_stream(
            model="gemini-2.0-flash",
            contents=f"""
            Context: {rag_context}\n\n
            Question: {user_query}\n\n
            
            ---

            **Strict Rules (MUST follow exactly):**

            1. **Source-of-Truth Rule**:  
            - **ONLY** use information explicitly present in the **Provided Context** above.  
            - **DO NOT** invent, infer, recall from training data, or hallucinate any facts, numbers, names, or details not directly stated in the context.

            2. **Insufficient Context Rule**:  
            - If the context does **not** contain enough information to answer the question **accurately and completely**, respond **only** with:  
                > **"Sorry but cannot answer your question at the moment"**
                and add a reason as to why you felt the context is insufficient to answer the user's query.
            - Do **not** guess, partially answer, or suggest external sources.

            3. **Answer Formatting Rules**:
            - Use **clear, concise, and structured** Markdown formatting:
                - **Bold** for key terms or emphasis
                - *Italics* for definitions or subtle points
                - `Code blocks` for technical terms, file paths, or snippets
                - Bullet points or numbered lists for multiple items
                - Tables when comparing data
                - LaTeX equations via `$$...$$` if needed (e.g., $$  E = mc^2  $$)
            - Quote direct excerpts from context using `> blockquotes` when referencing evidence.
            - Keep answers **under 300 words** unless the question demands detail.

            **Now, answer the question using only the context and rules above.**
            """,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0)
            ),
        ):
            yield f"data: {json.dumps({'chunk': chunk.text, 'finished': False})}\n\n"
            await sleep(0)

        yield f"data: {json.dumps({'chunk': '', 'finished': True})}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'error': str(e), 'finished': True})}\n\n"


@router.post("/response", status_code=200)
async def generate_response(prompt: Prompt):
    return StreamingResponse(
        generate(prompt.user_query),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "Transfer-Encoding": "chunked",
        },
    )
