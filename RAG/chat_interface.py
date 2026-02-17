import streamlit as st
from src.search import RAGSearch

# -------------------------------
# Initialize RAG
# -------------------------------
st.set_page_config(page_title="📚 RAG Chat", layout="wide")
st.title("📚 RAG Chat Interface")

# Initialize RAG once
if "rag_search" not in st.session_state:
    st.session_state.rag_search = RAGSearch()

# Initialize chat history
if "history" not in st.session_state:
    st.session_state.history = []

# -------------------------------
# User input
# -------------------------------
query = st.text_input("Ask a question:")

if st.button("Send") and query.strip():
    with st.spinner("Searching and summarizing..."):
        summary = st.session_state.rag_search.search_and_summarize(query, top_k=3)
    
    # Append question and answer to history
    st.session_state.history.append({"question": query, "answer": summary})
    st.session_state.query = ""  # clear input

# -------------------------------
# Display chat history
# -------------------------------
for chat in reversed(st.session_state.history):
    st.markdown(f"**You:** {chat['question']}")
    st.markdown(f"**RAG:** {chat['answer']}")
    st.markdown("---")
