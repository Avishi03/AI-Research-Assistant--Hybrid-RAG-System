import requests
import requests

from pydantic import BaseModel, Field
import chromadb
import chromadb.utils.embedding_functions as embedding_functions
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import tool

from . import helpers

google_ef = embedding_functions.GoogleGenerativeAiEmbeddingFunction(
    api_key="AIzaSyD336MYSkpfIK0J6kAbgse9D32jblhtsdk",
    model_name="gemini-embedding-001",  # Set the model explicitly
)

chroma_client = chromadb.HttpClient(host="localhost", port=8000)
chroma_client.heartbeat()

model = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",  # or "gemini-1.5-flash" for faster responses
    google_api_key="AIzaSyD336MYSkpfIK0J6kAbgse9D32jblhtsdk",
    temperature=0.1,  # Lower for more factual responses
)


@tool
def kb_retrieval(query: str) -> str:
    """
      **PRIMARY SOURCE**: Retrieve stored full-text, abstract, or summary of research papers from the internal knowledge base.

      **Use this FIRST** for any question related to research.
      - Returns exact stored document chunks (up to 5 most relevant).
      - Each chunk is separated by "---".
      - If no match: returns empty or error.
      - **Never skip this step** when answering research related questions.
    """
    try:
        # embed query and get k nearest neighbours -> use retrieval techniques to improve context retrieval
        collection = chroma_client.get_or_create_collection(
            name="research_papers", embedding_function=google_ef
        )
        result = collection.query(
            query_texts=[query], n_results=5, include=["documents"]
        )

        retrieved_documents = result["documents"][0]

        # Merge the list of documents into a single string, typically separated by newlines or a delimiter.
        # The delimiter "---" helps the subsequent LLM distinguish between individual documents.
        merged_docs_string = "\n---\n".join(retrieved_documents)

        # 5. Return the Merged String
        return merged_docs_string
    except Exception as e:
        return f"Error retrieving documents from the knowledge base: {str(e)}"


class SearchInput(BaseModel):
    """Input for academic paper search queries."""

    query: str = Field(
        description="The research topic or question to search for (e.g., 'Multi-user MIMO', 'transformer architecture')"
    )


@tool("web_search", args_schema=SearchInput, return_direct=False)
def web_search(query: str) -> str:
    """
      **FALLBACK SEARCH**: Search Semantic Scholar for academic papers.

      **ONLY CALL THIS** if:
      - `kb_retrieval` did not return enough context to answer the user's query.

      **NEVER call this first** — always try `kb_retrieval` before using this.

      Args:
          query: Central topic behind the user's query(for eg. if question is 'What is attention in NLP?', the query should be 'attention in NLP')

      Returns:
          Formatted context with paper information
    """
    try:
        # Build the API URL
        base_url = "https://api.semanticscholar.org/graph/v1/paper/search"
        fields = "title,abstract,authors,year,venue,url,tldr"
        params = {"query": query, "fields": fields, "limit": 3}

        # Make the API request
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()

        # Check if we got results
        if not data.get("data") or len(data["data"]) == 0:
            return f"No papers found for query: {query}"

        # Format the context
        context = f"Found {data.get('total', 0)} papers on '{query}'. Top {len(data['data'])} results:\n\n"

        for i, paper in enumerate(data["data"], 1):
            authors = paper.get("authors", [])
            author_names = ", ".join([a.get("name", "Unknown") for a in authors[:3]])
            if len(authors) > 3:
                author_names += " et al."

            context += f"--- Paper {i} ---\n"
            context += f"Title: {paper.get('title', 'N/A')}\n"
            context += f"Authors: {author_names}\n"
            context += f"Year: {paper.get('year', 'N/A')}\n"
            context += f"Venue: {paper.get('venue', 'N/A')}\n"
            context += f"URL: {paper.get('url', 'N/A')}\n"
            context += f"\nAbstract:\n{paper.get('abstract', 'Not available')}\n"

            tldr = paper.get("tldr")
            if tldr and tldr.get("text"):
                context += f"\nKey Summary:\n{tldr['text']}\n"

            context += "\n"

        return context

    except requests.exceptions.Timeout:
        return "Error: Request timed out. Please try again."
    except requests.exceptions.RequestException as e:
        return f"Error fetching papers: {str(e)}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"


class SpecificSearchInput(BaseModel):
    """Input for academic paper search queries."""

    query: str = (
        Field(
            description="Based on the users query, use either complete or incomplete name of the paper or the central topic the user is referring to in their question. Higher priority to the paper's name(incomplete names are acceptable as well)."
        ),
    )
    user_query: str = (Field(description="The user's original query"),)


@tool("specific_web_search", args_schema=SpecificSearchInput, return_direct=False)
def specific_web_search(query: str, user_query: str) -> str:
    """
      **FALLBACK SEARCH**: Search Semantic Scholar for a specific paper.

      **ONLY CALL THIS** if:
      - `kb_retrieval` did not return enough context to answer the user's query.

      **NEVER call this first** — always try `kb_retrieval` before using this.

      Args:
          query: complete or incomplete name of the paper or the central topic the user is referring to in their question. Higher priority to the paper's name(incomplete names are acceptable as well)
          user_query: The user's original query

      Returns:
          Formatted context with paper information
    """
    try:
        context = ""

        base_url = "https://api.semanticscholar.org/graph/v1/paper/autocomplete"
        params = {
            "query": query,
        }

        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()

        matches = response.json()

        if not matches.get("matches") or len(matches["matches"]) == 0:
            return f"Could not find paper"

        closest_matching_paper = matches["matches"][0]
        search_id = closest_matching_paper["id"]

        # Build the API URL
        base_url = f"https://api.semanticscholar.org/graph/v1/paper/{search_id}"
        fields = "title,abstract,authors,year,venue,openAccessPdf,tldr"
        params = {
            "fields": fields,
        }

        # Make the API request
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()

        paper = response.json()

        # Check if we got results
        if paper.get("error") and len(paper["error"]) > 0:
            return f"No papers found for id: {search_id}"

        if paper.get("openAccessPdf") and len(paper.get("openAccessPdf")["url"]) > 0:
            vector_store = helpers.extract_pdf(paper.get("openAccessPdf")["url"])
            if vector_store:
                # retrieve using user query and send context
                # else format paper details and return as context
                results = vector_store.similarity_search(user_query, k=5)

                context = "\n\n".join([doc.page_content for doc in results])

                return context

        authors = paper.get("authors", [])
        author_names = ", ".join([a.get("name", "Unknown") for a in authors[:3]])
        if len(authors) > 3:
            author_names += " et al."

        context += f"--- Paper ---\n"
        context += f"Title: {paper.get('title', 'N/A')}\n"
        context += f"Authors: {author_names}\n"
        context += f"Year: {paper.get('year', 'N/A')}\n"
        context += f"Venue: {paper.get('venue', 'N/A')}\n"
        context += f"URL: {paper.get('openAccessPdf', 'N/A')['url']}\n"
        context += f"\nAbstract:\n{paper.get('abstract', 'Not available')}\n"

        tldr = paper.get("tldr")
        if tldr and tldr.get("text"):
            context += f"\nKey Summary:\n{tldr['text']}\n"

        context += "\n"

        return context

    except requests.exceptions.Timeout:
        return "Error: Request timed out. Please try again."
    except requests.exceptions.RequestException as e:
        return f"Error fetching papers: {str(e)}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"
