# Finance RAG System

Ask questions about your financial PDF documents. Answers are grounded only in the indexed documents.

## Structure
```
pdfforfinance/
├── *.pdf              ← your financial PDFs live here
├── backend/
│   ├── main.py        ← FastAPI server (port 8001)
│   ├── ingest.py      ← PDF → ChromaDB indexer (run once)
│   ├── rag.py         ← retrieval + generation logic
│   ├── config.py      ← settings from .env
│   └── chroma_db/     ← auto-created vector store
└── frontend/          ← React chat UI (port 5174)
```

## Setup & Run

### 1. Ingest PDFs (run once, or when PDFs change)
```bash
cd backend
python ingest.py
```

### 2. Start backend
```bash
cd backend
uvicorn main:app --reload --port 8001
```

### 3. Start frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5174
