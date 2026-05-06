from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

from rag import answer, retrieve
from config import CHROMA_DIR, COLLECTION_NAME

app = FastAPI(title="Finance RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


@app.get("/health")
def health():
    """Check if ChromaDB collection is ready."""
    import chromadb
    try:
        client = chromadb.PersistentClient(path=CHROMA_DIR)
        col = client.get_collection(COLLECTION_NAME)
        count = col.count()
        return {"status": "ok", "chunks_indexed": count}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Index not ready: {e}. Run ingest.py first.")


@app.post("/ask")
def ask(req: QueryRequest):
    """Ask a question — RAG retrieves context from PDFs and generates an answer."""
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    result = answer(req.question.strip())
    return result


@app.get("/sources")
def list_sources():
    """List all indexed PDF source files."""
    import chromadb
    try:
        client = chromadb.PersistentClient(path=CHROMA_DIR)
        col = client.get_collection(COLLECTION_NAME)
        results = col.get(include=["metadatas"])
        sources = list({m["source"] for m in results["metadatas"]})
        return {"sources": sorted(sources)}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))
