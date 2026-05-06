import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
PDF_DIR = os.path.abspath(os.getenv("PDF_DIR", "../"))
CHROMA_DIR = os.path.abspath(os.getenv("CHROMA_DIR", "./chroma_db"))
EMBED_MODEL = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "finance_docs")

# Groq model fallback chain (all free)
GROQ_MODELS = [
    "llama-3.3-70b-versatile",   # best quality
    "llama-3.1-8b-instant",      # fast & lightweight
    "gemma2-9b-it",              # Google Gemma, free on Groq
    "mixtral-8x7b-32768",        # Mixtral fallback
]
