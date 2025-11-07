# import pdfplumber
# import io
# import json
# import os
# from fastapi import UploadFile
# from dotenv import load_dotenv
# from google import generativeai as genai

# # 🔹 Load environment
# load_dotenv()
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# if not GEMINI_API_KEY:
#     raise ValueError("GEMINI_API_KEY not found in .env file!")

# genai.configure(api_key=GEMINI_API_KEY)

# # ✅ Test Gemini connection at startup
# try:
#     model = genai.GenerativeModel("gemini-2.5-flash")  #gemini-2.0-flash
#     test_response = model.generate_content("Hello Gemini! Just a quick test.")
#     print("✅ Gemini model test successful! Response:", test_response.text[:100], "...")
# except Exception as e:
#     print("Gemini model test failed:", e)


# # 🔹 Main analyzer
# async def analyze_statement_with_gemini(file: UploadFile = None, text: str = None):
#     text_content = ""

#     # Handle text input
#     if text and text.strip():
#         text_content = text.strip()

#     # Handle file upload
#     elif file:
#         file_bytes = await file.read()

#         if file.filename.endswith(".pdf"):
#             with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
#                 for page in pdf.pages:
#                     page_text = page.extract_text()
#                     if page_text:
#                         text_content += page_text + "\n"
#         else:
#             text_content = file_bytes.decode("utf-8", errors="ignore")

#     if not text_content.strip():
#         return {"summary": "No readable data found in input.", "totals": {}, "categories": []}

#     # 🔹 Gemini prompt
#     prompt = f"""
# You are a financial analysis AI.
# Analyze the provided bank statement text and return only JSON (no markdown, no commentary).

# Format strictly as:
# {{
#   "summary": "Short 4-6 line financial insight summary.",
#   "totals": {{
#     "income": number,
#     "expenses": number,
#     "savings": number
#   }},
#   "categories": [
#     {{"name": "Rent", "value": number}},
#     {{"name": "Groceries", "value": number}},
#     {{"name": "Transport", "value": number}},
#     {{"name": "Education", "value": number}},
#     {{"name": "Entertainment", "value": number}},
#     {{"name": "Utilities", "value": number}},
#     {{"name": "Miscellaneous", "value": number}}
#   ]
# }}

# Bank Statement:
# {text_content}
# """

#     try:
#         model = genai.GenerativeModel("gemini-2.5-flash")
#         response = model.generate_content(prompt)

#         cleaned = response.text.replace("```json", "").replace("```", "").strip()
#         data = json.loads(cleaned)
#     except Exception as e:
#         print("⚠️ Gemini Parsing Error:", e)
#         data = {
#             "summary": "Error processing the statement. Check backend logs.",
#             "totals": {},
#             "categories": [],
#         }

#     return data


# import pdfplumber
# import io
# import os
# import fitz  # PyMuPDF
# import pytesseract
# from PIL import Image
# from fastapi import UploadFile
# from dotenv import load_dotenv
# from google import generativeai as genai

# # 🔹 Load environment
# load_dotenv()
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# if not GEMINI_API_KEY:
#     raise ValueError("❌ GEMINI_API_KEY not found in .env file!")

# # 🔹 Configure Gemini
# genai.configure(api_key=GEMINI_API_KEY)

# # ✅ Test Gemini connection
# try:
#     model = genai.GenerativeModel("gemini-2.5-flash")
#     test_response = model.generate_content("Hello Gemini! Test successful.")
#     print("✅ Gemini connected:", test_response.text[:80], "...")
# except Exception as e:
#     print("❌ Gemini connection failed:", e)


# # 🔹 Extract text from PDF (pdfplumber + Tesseract fallback)
# def extract_text_from_pdf(file_bytes: bytes) -> str:
#     text = ""

#     # Try normal text extraction
#     try:
#         with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
#             for page in pdf.pages:
#                 page_text = page.extract_text()
#                 if page_text:
#                     text += page_text + "\n"
#     except Exception as e:
#         print("⚠️ pdfplumber error:", e)

#     # Fallback to OCR if empty
#     if not text.strip():
#         print("🔍 Running OCR fallback (using Tesseract only)...")
#         try:
#             doc = fitz.open(stream=file_bytes, filetype="pdf")
#             for page_num, page in enumerate(doc, start=1):
#                 pix = page.get_pixmap(dpi=200)
#                 img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
#                 ocr_text = pytesseract.image_to_string(img)
#                 text += ocr_text + "\n"
#             print("✅ OCR extraction complete.")
#         except Exception as e:
#             print("⚠️ OCR failed:", e)

#     return text


# # 🔹 Main analyzer
# async def analyze_statement_with_gemini(file: UploadFile = None, text: str = None):
#     text_content = ""

#     # Handle text input or PDF
#     if text and text.strip():
#         text_content = text.strip()
#     elif file:
#         file_bytes = await file.read()
#         if file.filename.lower().endswith(".pdf"):
#             text_content = extract_text_from_pdf(file_bytes)
#         else:
#             text_content = file_bytes.decode("utf-8", errors="ignore")

#     # Validate extracted text
#     if not text_content.strip():
#         return {"insight": "⚠️ No readable data found in the uploaded file or text input."}

#     # 🔹 Prompt for conversational financial insight
#     prompt = f"""
# You are a friendly, highly skilled financial advisor AI.  
# Your job is to analyze a user's **bank statement** and write a clear, conversational financial report.

# ### ✨ INSTRUCTIONS:
# - Analyze the user's income, expenses, savings, and cash flow trends.
# - Identify patterns across multiple months (if applicable).
# - Highlight any recurring transactions like rent, groceries, EMI, or savings transfers.
# - Recognize strong habits (e.g., saving regularly) and areas for improvement (e.g., untracked withdrawals).
# - Include average spending, saving, and notable expense categories with approximate ₹ amounts.
# - Conclude with **personalized, actionable recommendations** that improve financial health.
# - Address the user by **name** if it's mentioned in the data.
# - Tone should be: professional, friendly, confident, and encouraging (like a real advisor).
# - Output in **markdown format** suitable for ReactMarkdown — use:
#   - Headings (`##`, `###`)
#   - Bullet points (`-`, `•`)
#   - **Bold/italic text** for emphasis
#   - Clear sections (Summary, Spending Breakdown, Observations & Recommendations)
# - DO NOT output JSON or code blocks — only narrative markdown text.

# ---

# ### 🧾 Bank Statement:
# {text_content}
# """

#     try:
#         model = genai.GenerativeModel("gemini-2.5-flash")
#         response = model.generate_content(prompt)

#         # Directly return markdown text
#         insight_text = response.text.strip()
#         print("✅ Gemini generated financial insight successfully.")
#         return {"insight": insight_text}

#     except Exception as e:
#         print("⚠️ Gemini Processing Error:", e)
#         return {
#             "insight": "⚠️ Error analyzing the statement. Please check backend logs for details."
#         }


import pdfplumber
import io
import os
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from fastapi import UploadFile
from dotenv import load_dotenv
from google import generativeai as genai
import json
from app.db import statement_collection
from datetime import datetime
from app.usage.usage_tracker import log_api_usage 
# 🔹 Load environment
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API_KEY not found in .env file!")

genai.configure(api_key=GEMINI_API_KEY)

# ✅ Test Gemini connection
try:
    model = genai.GenerativeModel("gemini-2.5-flash")
    test_response = model.generate_content("Hello Gemini! Test successful.")
    print("✅ Gemini connected:", test_response.text[:80], "...")
except Exception as e:
    print("❌ Gemini connection failed:", e)


# 🔹 PDF text extraction with Tesseract fallback
def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""

    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print("⚠️ pdfplumber error:", e)

    # Fallback to OCR if no text
    if not text.strip():
        print("🔍 Running OCR fallback (Tesseract only)...")
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page_num, page in enumerate(doc, start=1):
                pix = page.get_pixmap(dpi=200)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                ocr_text = pytesseract.image_to_string(img)
                text += ocr_text + "\n"
            print("✅ OCR extraction complete.")
        except Exception as e:
            print("⚠️ OCR failed:", e)

    return text


# 🔹 Main analyzer with Gemini
async def analyze_statement_with_gemini(file: UploadFile = None, text: str = None,user_id: str = "guest"):
    text_content = ""

    if text and text.strip():
        text_content = text.strip()
    elif file:
        file_bytes = await file.read()
        if file.filename.lower().endswith(".pdf"):
            text_content = extract_text_from_pdf(file_bytes)
        else:
            text_content = file_bytes.decode("utf-8", errors="ignore")

    if not text_content.strip():
        return {
            "insight": "⚠️ No readable data found in the uploaded file or text input.",
            "months": [],
        }

    # 🔹 Gemini Prompt
    prompt = f"""
You are a friendly, highly skilled financial advisor AI.
Analyze the following **bank statement** and produce TWO outputs:
1️⃣ A **detailed markdown report** for the user (insight)
2️⃣ A **structured 3-month spending summary** for visualization

### OUTPUT FORMAT (strict JSON, no extra text or markdown):
{{
  "insight": "Professional markdown-formatted financial summary and recommendations.",
  "months": [
    {{"month": "August", "spending": 48861}},
    {{"month": "September", "spending": 47000}},
    {{"month": "October", "spending": 51000}}
  ]
}}

### INSTRUCTIONS:
- From the statement, extract month names and approximate total spending for each month (based on debits or expenses).
- Use full month names (January, February, etc.).
- If fewer than 3 months are present, include only those available.
- The "insight" should be a detailed, friendly markdown report containing:
  - A personalized opening line (use user's name if detected)
  - Financial summary (income, expenses, savings)
  - 3-month spending overview
  - Key spending categories
  - Personalized recommendations
- Maintain an encouraging, advisor-style tone (like talking to a client).
- Markdown should use:
  - Headings (##, ###)
  - Bullets
  - Bold/italic emphasis
  - Emojis for section headers (💰, 📊, 🧩, 🔍, etc.)
- The JSON must not contain markdown symbols outside the "insight" string.

---
BANK STATEMENT:
{text_content}
"""

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)

        cleaned = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned)

        # Safety fallback
        if "insight" not in data:
            data["insight"] = "⚠️ No insight generated. Check Gemini response."
        if "months" not in data:
            data["months"] = []
        
        await save_statement_to_db(data)

        # 🧮 Estimate token usage (simple approximation)
        tokens_used = len(prompt.split()) + len(response.text.split())

        # ✅ Log successful usage
        await log_api_usage(
            user_id=user_id,
            feature="statement_analysis",
            model=model,
            tokens_used=tokens_used,
            success=True,
            extra_info={
                "months_analyzed": len(data.get("months", [])),
                "timestamp": datetime.utcnow().isoformat(),},
        )

        print("✅ Gemini analysis completed successfully.")

        return data

    except Exception as e:
        print("⚠️ Gemini Processing Error:", e)
        return {
            "insight": "⚠️ Error analyzing the statement. Please check backend logs for details.",
            "months": [],
        }


async def save_statement_to_db(data: dict):
    """Save analyzed statement to MongoDB."""
    try:
        record = {
            "insight": data.get("insight", ""),
            "months": data.get("months", []),
            "created_at": datetime.utcnow()
        }
        await statement_collection.insert_one(record)
        print("✅ Analysis saved in MongoDB.")
    except Exception as e:
        print("⚠️ MongoDB save failed:", e)


async def fetch_statement_history():
    """Retrieve all statement history sorted by date (newest first)."""
    try:
        cursor = statement_collection.find().sort("created_at", -1)
        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results
    except Exception as e:
        print("⚠️ MongoDB fetch failed:", e)
        return []