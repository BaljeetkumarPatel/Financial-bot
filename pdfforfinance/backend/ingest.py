"""
ingest.py — reads all PDFs from PDF_DIR, chunks text, embeds with
sentence-transformers, and stores in ChromaDB.

Run once (or re-run to refresh):
    python ingest.py
"""

import os
import re
import pdfplumber
import chromadb
from sentence_transformers import SentenceTransformer
from config import PDF_DIR, CHROMA_DIR, EMBED_MODEL, COLLECTION_NAME

CHUNK_SIZE = 500      # characters per chunk
CHUNK_OVERLAP = 100   # overlap between chunks


def extract_text(pdf_path: str) -> str:
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n"
    except Exception as e:
        print(f"  [WARN] Could not read {pdf_path}: {e}")
    return text


def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    text = re.sub(r"\s+", " ", text).strip()
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunks.append(text[start:end])
        start += size - overlap
    return [c for c in chunks if len(c.strip()) > 50]


def ingest():
    print(f"PDF directory : {PDF_DIR}")
    print(f"ChromaDB path : {CHROMA_DIR}")

    pdfs = [f for f in os.listdir(PDF_DIR) if f.lower().endswith(".pdf")]
    if not pdfs:
        print("No PDFs found. Place PDFs in:", PDF_DIR)
        return

    print(f"Found {len(pdfs)} PDF(s): {pdfs}\n")

    # Load embedding model
    print(f"Loading embedding model: {EMBED_MODEL} ...")
    model = SentenceTransformer(EMBED_MODEL)

    # Init ChromaDB
    client = chromadb.PersistentClient(path=CHROMA_DIR)
    # Delete existing collection to allow re-ingestion
    try:
        client.delete_collection(COLLECTION_NAME)
        print("Cleared existing collection.")
    except Exception:
        pass
    collection = client.create_collection(COLLECTION_NAME)

    total_chunks = 0
    for pdf_file in pdfs:
        path = os.path.join(PDF_DIR, pdf_file)
        print(f"Processing: {pdf_file}")
        text = extract_text(path)
        if not text.strip():
            print(f"  [SKIP] No text extracted from {pdf_file}")
            continue

        chunks = chunk_text(text)
        print(f"  → {len(chunks)} chunks")

        embeddings = model.encode(chunks, show_progress_bar=False).tolist()

        ids = [f"{pdf_file}__chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"source": pdf_file, "chunk": i} for i in range(len(chunks))]

        collection.add(documents=chunks, embeddings=embeddings, ids=ids, metadatas=metadatas)
        total_chunks += len(chunks)

    print(f"\nDone. {total_chunks} total chunks stored in ChromaDB.")


if __name__ == "__main__":
    ingest()
