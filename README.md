# 📚 AI Research Assistant — Hybrid RAG System

> A full-stack AI-powered Research Paper Q&A system built on a **Hybrid Retrieval-Augmented Generation (RAG)** architecture. Retrieves grounded evidence from research papers and generates reliable, citation-backed answers with real-time streaming.

---

## 📌 Table of Contents
- [What This Project Does](#-what-this-project-does)
- [System Architecture](#-system-architecture)
- [RAG Pipeline](#-rag-pipeline)
- [Hybrid Retrieval](#-hybrid-retrieval--how-it-works)
- [Memory Cache Flow](#-memory-cache-flow)
- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Setup](#-setup)
- [Environment Variables](#-environment-variables)
- [Future Improvements](#-future-improvements)

---

## 🚀 What This Project Does

Users can:
- Ask research-related questions (text or speech)
- Retrieve relevant research paper sections via hybrid search
- Receive grounded, citation-backed AI-generated answers
- View highlighted source excerpts from papers
- Revisit stored conversation history
- Experience real-time streamed responses via SSE

**Core Goal:** Reduce hallucination by retrieving verified context *before* generating any answer.

---

## 🏗 System Architecture
```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │              React Native App (Expo)                         │  │
│   │   ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │  │
│   │   │  Voice Input │  │  Chat History │  │  Source Viewer  │  │  │
│   │   │  (RN Voice)  │  │  (AsyncStore) │  │ (Highlighting)  │  │  │
│   │   └──────────────┘  └───────────────┘  └─────────────────┘  │  │
│   └──────────────────────────┬───────────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────────────┘
                               │  HTTPS + SSE
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                                │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │         Express API Server (Node.js + TypeScript)            │  │
│   │   ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │  │
│   │   │  Auth Routes │  │ JWT Middleware │  │   SSE Proxy     │  │  │
│   │   └──────────────┘  └───────────────┘  └────────┬────────┘  │  │
│   └──────────────────────────────────────────────────┼───────────┘  │
│   ┌────────────────────────────────────┐              │              │
│   │  MongoDB Atlas (Chat + Sessions)   │              │              │
│   └────────────────────────────────────┘              │              │
└──────────────────────────────────────────────────────┼──────────────┘
                                                        │  HTTP
                                                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     AI MICROSERVICE LAYER                           │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │                FastAPI RAG Microservice                      │  │
│   │   ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │  │
│   │   │    Query     │  │    Hybrid     │  │  Gemini 2.0     │  │  │
│   │   │  Classifier  │  │   Retriever   │  │  Flash (LLM)    │  │  │
│   │   └──────────────┘  └───────────────┘  └─────────────────┘  │  │
│   │   ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │  │
│   │   │ Memory Cache │  │   ChromaDB    │  │Semantic Scholar │  │  │
│   │   │  (TTL-based) │  │  HTTP Client  │  │ API (Fallback)  │  │  │
│   │   └──────────────┘  └───────────────┘  └─────────────────┘  │  │
│   └──────────────────────────────────────────────────────────────┘  │
│   ┌────────────────────────────────────┐                            │
│   │  ChromaDB Vector Store (Port 8000) │                            │
│   └────────────────────────────────────┘                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 RAG Pipeline
```
USER QUERY
    │
    ▼
┌─────────────────────────┐
│    Query Classifier      │──── Not research? ──→ Direct LLM Reply
└──────────┬──────────────┘
           │ Is research
           ▼
┌─────────────────────────┐
│   Memory Cache Check    │──── Cache HIT + TTL valid? ──→ Return Cached
└──────────┬──────────────┘
           │ Cache MISS
           ▼
┌─────────────────────────┐
│    Hybrid Retrieval     │
│  ┌─────────────────┐    │
│  │  Dense Search   │    │   ← ChromaDB embedding similarity
│  └────────┬────────┘    │
│  ┌────────▼────────┐    │
│  │ Keyword Scoring │    │   ← BM25-style term overlap
│  └────────┬────────┘    │
│  ┌────────▼────────┐    │
│  │ Result Fusion   │    │   ← Re-rank + deduplicate
│  └────────┬────────┘    │
└───────────┼─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Sufficient Context?   │──── No ──→ Semantic Scholar API Fallback
└──────────┬──────────────┘            (Fetch + Chunk + Embed)
           │ Yes (or after fallback)
           ▼
┌─────────────────────────┐
│   Context Assembly      │   Top-K chunks + source metadata + excerpts
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   Grounded Generation   │   Gemini 2.0 Flash — answer from context only
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   SSE Streaming         │   Chunks → client → final payload with sources
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   MongoDB + Cache Save  │   Persist history, update cache
└─────────────────────────┘
```

---

## 🔹 Hybrid Retrieval — How It Works
```
QUERY: "How do transformers handle long-range dependencies?"
                          │
          ┌───────────────┴────────────────┐
          │                                │
          ▼                                ▼
┌──────────────────────┐       ┌────────────────────────┐
│   Dense Retrieval    │       │   Keyword Retrieval    │
│                      │       │                        │
│  Embed query with    │       │  Tokenize query        │
│  gemini-embedding    │       │  Score chunks by       │
│  Cosine similarity   │       │  term overlap (BM25)   │
│  vs ChromaDB vectors │       │                        │
│                      │       │  "transformers"  ✓     │
│  → top-K semantic    │       │  "long-range"    ✓     │
│    nearest chunks    │       │  "dependencies"  ✓     │
└──────────┬───────────┘       └──────────┬─────────────┘
           │                              │
           └──────────────┬───────────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │    Result Fusion     │
               │                      │
               │  score = α(dense)    │
               │        + β(keyword)  │
               │                      │
               │  Re-rank combined    │
               │  Deduplicate         │
               └──────────┬───────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │  Final Context       │
               │  Higher recall than  │
               │  either method alone │
               └──────────────────────┘
```

---

## ⚡ Memory Cache Flow
```
Incoming Query
      │
      ▼
┌──────────────────────────────┐
│   Hash + Normalize Query     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│    Check In-Memory Cache     │
│    (Python dict, TTL-based)  │
└──────┬───────────────┬───────┘
       │ HIT           │ MISS
       ▼               ▼
┌─────────────┐  ┌──────────────────────────┐
│  TTL valid? │  │  Run Full RAG Pipeline   │
└──┬──────────┘  └────────────┬─────────────┘
   │ Yes  │ No                │
   ▼      ▼                   ▼
┌───────┐ ┌──────┐  ┌──────────────────────────┐
│Return │ │Expire│  │  Store in cache (+ TTL)  │
│Cached │ │& Re- │  │  Return fresh response   │
│Result │ │run   │  └──────────────────────────┘
└───────┘ └──────┘
```

---

## 🧩 Core Features

**Hybrid Retrieval** — Combines dense vector search (ChromaDB embeddings) with keyword-based relevance scoring. Improves context recall and reduces missed relevant sections compared to vector-only retrieval.

**Memory Cache** — TTL-based in-memory caching stores recent query → response mappings. Reduces repeated generation latency and avoids redundant embedding and retrieval calls for frequent queries.

**Source Highlighting** — Every response includes exact excerpts used from research papers, paper title metadata, and context chunk previews — improving answer trustworthiness and interpretability.

**Real-Time Streaming (SSE)** — Responses stream in ordered chunks via Server-Sent Events. Users receive partial responses immediately with metadata and source highlights included in the final chunk.

**Authentication & Persistence** — Firebase Authentication (OTP + Google), JWT-secured backend routes, and MongoDB Atlas for durable chat history storage.

---

## 🗃 Tech Stack

### Frontend (React Native)
| Tool | Purpose |
|---|---|
| React Native (Expo) | Cross-platform mobile UI |
| Zustand | State management |
| Firebase Auth | OTP + Google sign-in |
| React Native Voice | Speech-to-text input |
| React Native TTS | Text-to-speech output |
| Axios | HTTP client |
| AsyncStorage | Local persistence |

### Backend (Express)
| Tool | Purpose |
|---|---|
| Node.js + TypeScript | Runtime + type safety |
| JWT | Route authentication |
| Mongoose | MongoDB ORM |
| SSE Proxy | Stream relay to client |

### AI Microservice (FastAPI)
| Tool | Purpose |
|---|---|
| FastAPI | Async Python API server |
| LangChain | RAG orchestration |
| Google Gemini 2.0 Flash | LLM generation |
| gemini-embedding-001 | Query + chunk embeddings |
| ChromaDB HTTP | Vector store |
| FAISS | Dynamic vector hydration |
| Semantic Scholar API | External fallback retrieval |
| asyncio | Async streaming |

### Databases
| Store | Purpose |
|---|---|
| MongoDB Atlas | Chat history + user sessions |
| ChromaDB | Vector embeddings store |
| In-memory cache | TTL-based query cache |

---

## 📊 Example Response Structure
```json
{
  "chunk": "...streamed text token...",
  "finished": true,
  "highlighted_sources": [
    {
      "title": "Attention Is All You Need",
      "excerpt": "The transformer architecture eliminates recurrence and relies entirely on an attention mechanism..."
    }
  ]
}
```

---

## ⚙️ Setup

**1. ChromaDB** *(start this first)*
```bash
pip install chromadb
chroma run --host localhost --port 8000
```

**2. Backend**
```bash
cd backend
npm install
npm run dev
```

**3. FastAPI**
```bash
cd FastAPI
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
uvicorn app:app --reload --port 5432
```

**4. Frontend**
```bash
cd frontend
npm install
npx expo start
```

---

## 🔐 Environment Variables

**Backend** (`backend/.env`)
```env
MONGODB_CONNECTION_STRING=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FASTAPI_BASE_URL=http://localhost:5432
```

**FastAPI** (`FastAPI/.env`)
```env
GOOGLE_GENAI_API_KEY=your_gemini_key
CHROMA_HTTP_URL=http://localhost:8000
SEMANTIC_SCHOLAR_API_KEY=optional
```

**Frontend** (`frontend/.env`)
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

---

## 🔧 Improvements Over Basic RAG

| Feature | Basic RAG | This System |
|---|---|---|
| Retrieval Method | Vector only | Hybrid (dense + keyword) |
| Repeated Query Cost | Full pipeline every time | Memory cached |
| Source Transparency | None | Highlighted excerpts |
| Hallucination Control | Prompt only | Strict grounding + prompt |
| Response Delivery | Batch | Real-time SSE streaming |
| Architecture | Monolithic | Modular microservices |

---

## 📈 Future Improvements

- **Redis-based distributed caching** — replace in-memory cache for horizontal scaling
- **Evaluation metrics dashboard** — track retrieval precision, answer faithfulness
- **Retrieval diagnostics logging** — visibility into what chunks were selected and why
- **Multi-document comparison mode** — compare findings across multiple papers
- **Automated ingestion pipeline** — batch upload and index new papers
- **Rate limiting & abuse detection** — protect the API from overuse

---

*Refrenece taken from github
