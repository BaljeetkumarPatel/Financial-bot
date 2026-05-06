"""
rag.py — retrieval + generation using Groq (free LLM API).
"""

import time
import chromadb
from sentence_transformers import SentenceTransformer
from config import CHROMA_DIR, EMBED_MODEL, COLLECTION_NAME, GROQ_API_KEY, GROQ_MODELS

TOP_K = 5
RETRY_WAIT = 5  # seconds between model attempts on rate limit

# Singletons
_embedder: SentenceTransformer | None = None
_collection = None


def _get_embedder() -> SentenceTransformer:
    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer(EMBED_MODEL)
    return _embedder


def _get_collection():
    global _collection
    if _collection is None:
        client = chromadb.PersistentClient(path=CHROMA_DIR)
        _collection = client.get_collection(COLLECTION_NAME)
    return _collection


def retrieve(query: str, top_k: int = TOP_K) -> list[dict]:
    """Embed query and return top_k relevant chunks from ChromaDB."""
    embedder = _get_embedder()
    collection = _get_collection()

    query_vec = embedder.encode([query]).tolist()
    results = collection.query(query_embeddings=query_vec, n_results=top_k)

    return [
        {"text": doc, "source": meta.get("source", "unknown")}
        for doc, meta in zip(results["documents"][0], results["metadatas"][0])
    ]


def _build_prompt(query: str, chunks: list[dict]) -> str:
    context = "\n\n---\n\n".join([c["text"] for c in chunks])
    return f"""You are a friendly and knowledgeable financial advisor.
Answer the question directly and naturally, as if you already know this information.
Do NOT say "according to the documents", "based on the context", or any similar phrase.
Do NOT mention that you are referencing any documents or sources.
Just answer clearly, confidently, and helpfully.
If you don't know the answer, say "I don't have information on that topic."

Background knowledge:
{context}

Question: {query}

Answer:"""


def _is_rate_limit(msg: str) -> bool:
    return (
        "rate_limit" in msg.lower()
        or "429" in msg
        or "quota" in msg.lower()
        or "too many" in msg.lower()
    )


def _generate_with_groq(prompt: str) -> str | None:
    if not GROQ_API_KEY:
        print("[RAG] GROQ_API_KEY not set.")
        return None

    from groq import Groq
    client = Groq(api_key=GROQ_API_KEY)

    for i, model in enumerate(GROQ_MODELS):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1024,
                temperature=0.3,
            )
            text = response.choices[0].message.content
            if text and text.strip():
                print(f"[RAG] Groq model used: {model}")
                return text.strip()
        except Exception as e:
            msg = str(e)
            if _is_rate_limit(msg):
                if i < len(GROQ_MODELS) - 1:
                    print(f"[RAG] Rate limit on {model}, waiting {RETRY_WAIT}s...")
                    time.sleep(RETRY_WAIT)
                continue
            print(f"[RAG] Groq error on {model}: {msg}")
            continue

    return None


def answer(query: str) -> dict:
    """Full RAG pipeline: retrieve → prompt → generate with Groq."""
    chunks = retrieve(query)
    if not chunks:
        return {
            "answer": "No relevant content found in the financial documents.",
            "sources": [],
            "chunks_used": 0,
        }

    prompt = _build_prompt(query, chunks)
    reply = _generate_with_groq(prompt)

    if not reply:
        reply = "All AI models are currently unavailable. Please try again in a moment."

    sources = list({c["source"] for c in chunks})
    return {
        "answer": reply,
        "sources": sources,
        "chunks_used": len(chunks),
    }
