from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, SystemMessage
from . import tools

model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",  # or "gemini-1.5-flash" for faster responses
    google_api_key="AIzaSyD336MYSkpfIK0J6kAbgse9D32jblhtsdk",
    temperature=0.1,  # Lower for more factual responses
)


def rag(user_query: str) -> str:
    # 3. Create prompt with context + query
    prompt = f"""
      You are a Research Question Classification Agent.
      Your task is to analyze a user's question and classify it into one of three categories based on intent and context.

      Classification categories:

      - Specific-to-paper — The question references or implies a specific research paper, author, DOI, or title (e.g., “What does the 2021 paper by Smith et al. conclude about transformers?”).

      - Generic-research — The question is about a research topic or domain in general, not a single paper (e.g., “How do attention mechanisms work in NLP?”).

      - Non-research — The question is unrelated to academic or scientific research (e.g., “What's the weather today?” or “Write a poem.”).

      Instructions:

      Always output only one label: specific-to-paper, generic-research, or non-research.

      If uncertain, choose the closest category by analyzing research intent.

      Do not include explanations or reasoning in the final output.

      Question: {user_query}
	  """

    # 4. Send to Gemini
    response = model.invoke(prompt)
    query_type = (
        response.content
    )  # answer -> specific-to-paper / generic-research / non-research

    if query_type.lower() == "non-research":
        return "Irrelevant question."

    elif query_type.lower() == "generic-research":
        prompt = """
          You are a **Context Extractor Agent**. Your sole purpose is to gather and return **only the relevant context** needed to answer the user's query — not the final answer itself.

          You have access to two tools: `kb_retrieval` (internal knowledge base) and `web_search` (public search engine).

          **PROCEDURE:**

          1. **PRIMARY SOURCE:** First, attempt to retrieve information using the `kb_retrieval` tool.
          - **Action:** Call `kb_retrieval` with the user's exact query.
          - **Observation Analysis:** Evaluate the content returned by `kb_retrieval`.
          - **IF** the content is sufficient or partially relevant(you feel the content is enough to answer the user's query) → **return only the relevant context** (verbatim; no rewriting or summarizing).
          - **IF** the content is empty or clearly irrelevant(you feel the content is not enough to answer the user's query) → proceed to Step 2.

          2. **SECONDARY SOURCE (Fallback):** If content returned by `kb_retrieval` is empty or clearly irrelevant, call the `web_search` tool.
          - **Action:** Call `web_search`, following instructions mentioned in tool definition.
          - **Observation Analysis:** Evaluate the search results.
          - **IF** relevant → **return only the relevant parts** (original wording).
          - **IF** still unhelpful → return:
            ```
            No relevant context could be retrieved.
            ```
              and add reason as to why you felt the content is not enough to answer the user's query.

          **RULES:**
          - Do **not** generate or formulate an answer to the query.
          - Do **not** add explanations, reasoning, or commentary.
          - Return **only the extracted text** or the “no relevant context” message.
        """

        agent = create_agent(model, tools=[tools.kb_retrieval, tools.web_search])

        conversation = agent.invoke(
            {
                "messages": [
                    SystemMessage(content=prompt),
                    HumanMessage(content=f"User's Question: {user_query}"),
                ]
            }
        )

        messages = conversation["messages"]
        final_message = next(
            (
                m
                for m in reversed(messages)
                if getattr(m, "content", None)
                and str(m.content).strip() not in ["", None]
                and not isinstance(m, SystemMessage)
            ),
            None,
        )

        if final_message:
            return final_message.content
        else:
            return "No relevant context could be retrieved."

    elif query_type.lower() == "specific-to-paper":
        prompt = """
          You are a **Context Extractor Agent**. Your sole purpose is to gather and return **only the relevant context** needed to answer the user's query — not the final answer itself.

          You have access to two tools: `kb_retrieval` and `specific_web_search`.

          **PROCEDURE:**

          1. **PRIMARY SOURCE:** First, attempt to retrieve information using the `kb_retrieval` tool.  
          - **Action:** Call `kb_retrieval` with the user's exact query.  
          - **Observation Analysis:** Evaluate the content returned by `kb_retrieval`.
          - **IF** the content is sufficient or partially relevant → **return only the relevant context** (verbatim; no rewriting or summarizing).  
          - **IF** the content is empty or clearly irrelevant → proceed to Step 2.

          2. **SECONDARY SOURCE (Fallback):** If content returned by `kb_retrieval` is empty or clearly irrelevant, call the `specific_web_search` tool.  
          - **Action:** Call `specific_web_search`, following instructions mentioned in tool definition.
          - **Observation Analysis:** Evaluate the search results.  
          - **IF** relevant → **return only the relevant parts** (original wording).  
          - **IF** still unhelpful → return exactly:  
            ```
            No relevant context could be retrieved.
            ```

          **RULES:**
          - Do **not** generate or formulate an answer to the query.
          - Do **not** add explanations, reasoning, or commentary.
          - Return **only the extracted text** or the “no relevant context” message.
        """

        agent = create_agent(
            model, tools=[tools.kb_retrieval, tools.specific_web_search]
        )

        conversation = agent.invoke(
            {
                "messages": [
                    SystemMessage(content=prompt),
                    HumanMessage(content=f"User's Question: {user_query}"),
                ]
            }
        )

        messages = conversation["messages"]
        final_message = next(
            (
                m
                for m in reversed(messages)
                if getattr(m, "content", None)
                and str(m.content).strip() not in ["", None]
                and not isinstance(m, SystemMessage)
            ),
            None,
        )

        if final_message:
            return final_message.content
        else:
            return "No relevant context could be retrieved."
