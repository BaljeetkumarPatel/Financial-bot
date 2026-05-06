import io
import json
import re
from datetime import datetime

import pdfplumber
from fastapi import UploadFile

from app.db import statement_collection
from app.services.gemini_client import MODEL_NAME, GeminiQuotaError, generate_text
from app.usage.usage_tracker import log_api_usage


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""

    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print("pdfplumber error:", e)

    if not text.strip():
        print("Running OCR fallback...")
        try:
            import fitz
            import pytesseract
            from PIL import Image

            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                pix = page.get_pixmap(dpi=200)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                text += pytesseract.image_to_string(img) + "\n"
            print("OCR extraction complete.")
        except Exception as e:
            print("OCR fallback unavailable/failed:", e)

    return text


def _parse_model_json(response_text: str) -> dict:
    cleaned = response_text.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise
        return json.loads(cleaned[start : end + 1])


def _fallback_month_summary(text_content: str):
    # Tries to parse month + INR amount patterns from raw text.
    pattern = re.compile(
        r"(January|February|March|April|May|June|July|August|September|October|November|December|"
        r"Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
        r"[^\n\r]{0,80}?(?:INR|Rs\.?|₹)\s*([0-9][0-9,]*)",
        flags=re.IGNORECASE,
    )
    buckets = {}
    for m in pattern.finditer(text_content or ""):
        month_raw = m.group(1).strip()
        amount_raw = m.group(2).replace(",", "")
        try:
            amount = int(amount_raw)
        except ValueError:
            continue
        month_name = month_raw[:3].title()
        buckets[month_name] = buckets.get(month_name, 0) + amount

    months = [{"month": k, "spending": v} for k, v in list(buckets.items())[:3]]
    return months


def _fallback_statement_report(text_content: str):
    months = _fallback_month_summary(text_content)
    if months:
        avg = sum(x["spending"] for x in months) / len(months)
        month_lines = "\n".join([f"- {m['month']}: INR {m['spending']:,}" for m in months])
    else:
        avg = 0
        month_lines = "- Could not reliably parse month-wise spending from the uploaded statement."

    insight = (
        "## Statement Summary\n"
        "A basic summary is shown below.\n\n"
        "### Month-wise Spending Snapshot\n"
        f"{month_lines}\n\n"
        "### Observations\n"
        f"- Approx monthly average (parsed entries): INR {avg:,.0f}\n"
        "- Track recurring debits (EMI/subscriptions) and reduce avoidable spends.\n"
        "- Keep emergency fund and savings transfer automated each month.\n"
    )
    categories = [
        {"category": "Needs", "amount": round(avg * 0.55)},
        {"category": "Wants", "amount": round(avg * 0.30)},
        {"category": "Savings", "amount": round(avg * 0.15)},
    ] if avg > 0 else []
    tips = [
        "Set a fixed monthly cap for discretionary spending and track it weekly.",
        "Review recurring subscriptions and cancel low-value services.",
        "Automate savings transfer immediately after salary credit.",
    ]
    transactions = []
    tx_pattern = re.compile(
        r"(?P<date>\d{1,2}[-/]\d{1,2}[-/]\d{2,4})?[^\n\r]{0,40}?(?P<desc>[A-Za-z][A-Za-z0-9 .,&/_-]{3,80})[^\n\r]{0,30}?(?:INR|Rs\.?|₹)\s*(?P<amt>[0-9][0-9,]*)",
        flags=re.IGNORECASE,
    )
    for m in tx_pattern.finditer(text_content or ""):
        amt = int(m.group("amt").replace(",", ""))
        transactions.append(
            {
                "date": (m.group("date") or "").strip(),
                "description": (m.group("desc") or "Transaction").strip()[:80],
                "amount": amt,
                "risk_level": "high" if amt >= 20000 else "medium" if amt >= 10000 else "low",
                "reason": "High value debit identified from statement text." if amt >= 10000 else "Notable debit entry.",
            }
        )
    transactions = sorted(transactions, key=lambda x: x["amount"], reverse=True)[:5]
    spend_by_channel = _fallback_spend_by_channel(text_content)
    return {
        "insight": insight,
        "months": months,
        "categories": categories,
        "spend_reduction_tips": tips,
        "top_transactions": transactions,
        "spend_by_channel": spend_by_channel,
    }


def _fallback_spend_by_channel(text_content: str):
    lines = (text_content or "").splitlines()
    buckets = {"Shopping": 0, "Online": 0, "ATM/Cash": 0, "Bills": 0, "Other": 0}
    amount_rx = re.compile(r"(?:INR|Rs\.?|₹)\s*([0-9][0-9,]*)", flags=re.IGNORECASE)

    for line in lines:
        m = amount_rx.search(line)
        if not m:
            continue
        try:
            amt = int(m.group(1).replace(",", ""))
        except ValueError:
            continue

        ll = line.lower()
        if any(k in ll for k in ["amazon", "flipkart", "myntra", "online", "ecom", "netbanking", "card not present"]):
            buckets["Online"] += amt
        elif any(k in ll for k in ["mall", "store", "mart", "shop", "supermarket", "grocery"]):
            buckets["Shopping"] += amt
        elif any(k in ll for k in ["atm", "cash withdrawal", "cash wd", "cash wdl"]):
            buckets["ATM/Cash"] += amt
        elif any(k in ll for k in ["electricity", "water", "gas", "recharge", "broadband", "postpaid", "bill"]):
            buckets["Bills"] += amt
        else:
            buckets["Other"] += amt

    return [{"channel": k, "amount": v} for k, v in buckets.items() if v > 0]


async def analyze_statement_with_gemini(file: UploadFile = None, text: str = None, user_id: str = "guest"):
    text_content = ""

    if text and text.strip():
        text_content = text.strip()
    elif file:
        file_bytes = await file.read()
        filename = (file.filename or "").lower()
        if filename.endswith(".pdf"):
            text_content = extract_text_from_pdf(file_bytes)
        else:
            text_content = file_bytes.decode("utf-8", errors="ignore")

    if not text_content.strip():
        return {
            "insight": "No readable data found in the uploaded file or input text.",
            "months": [],
            "categories": [],
            "spend_reduction_tips": [],
            "top_transactions": [],
            "spend_by_channel": [],
        }

    prompt = f"""
You are a financial advisor AI.
Analyze the bank statement and return strict JSON only:
{{
  "insight": "Detailed markdown financial analysis",
  "months": [
    {{"month": "August", "spending": 48861}},
    {{"month": "September", "spending": 47000}},
    {{"month": "October", "spending": 51000}}
  ],
  "categories": [
    {{"category": "Rent", "amount": 25000}},
    {{"category": "Groceries", "amount": 12000}},
    {{"category": "Food & Dining", "amount": 8000}}
  ],
  "spend_reduction_tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ],
  "top_transactions": [
    {{
      "date": "12/08/2026",
      "description": "UPI PAYMENT ABC STORE",
      "amount": 15200,
      "risk_level": "medium",
      "reason": "Large discretionary payment"
    }}
  ],
  "spend_by_channel": [
    {{"channel": "Shopping", "amount": 12000}},
    {{"channel": "Online", "amount": 18000}},
    {{"channel": "ATM/Cash", "amount": 5000}}
  ]
}}
If month-wise values are unavailable, return months as an empty array.
If category values are unavailable, return categories as an empty array.
Keep spend_reduction_tips concise and actionable.

BANK STATEMENT:
{text_content}
"""

    try:
        response_text = generate_text(prompt)
        data = _parse_model_json(response_text)

        if "insight" not in data or not isinstance(data.get("insight"), str):
            data["insight"] = "No insight generated from model response."
        if "months" not in data or not isinstance(data.get("months"), list):
            data["months"] = []
        if "categories" not in data or not isinstance(data.get("categories"), list):
            data["categories"] = []
        if "spend_reduction_tips" not in data or not isinstance(data.get("spend_reduction_tips"), list):
            data["spend_reduction_tips"] = []
        if "top_transactions" not in data or not isinstance(data.get("top_transactions"), list):
            data["top_transactions"] = []
        if "spend_by_channel" not in data or not isinstance(data.get("spend_by_channel"), list):
            data["spend_by_channel"] = []

        await save_statement_to_db(data)

        tokens_used = len(prompt.split()) + len(response_text.split())
        await log_api_usage(
            user_id=user_id,
            feature="statement_analysis",
            model=MODEL_NAME,
            tokens_used=tokens_used,
            success=True,
            extra_info={
                "months_analyzed": len(data.get("months", [])),
                "timestamp": datetime.utcnow().isoformat(),
            },
        )

        return data
    except GeminiQuotaError as e:
        print("Gemini quota exhausted for statement analysis:", e)
        return {
            "insight": "## Gemini Quota Exhausted\n\nThe AI model quota is currently over. Please try again later or upgrade your Gemini API plan.",
            "months": [],
            "categories": [],
            "spend_reduction_tips": [],
            "top_transactions": [],
            "spend_by_channel": [],
        }
    except Exception as e:
        print("Gemini statement analysis error:", e)
        return {
            "insight": "We are unable to process your statement right now. Please try again shortly.",
            "months": [],
            "categories": [],
            "spend_reduction_tips": [],
            "top_transactions": [],
            "spend_by_channel": [],
        }


async def save_statement_to_db(data: dict):
    try:
        record = {
            "insight": data.get("insight", ""),
            "months": data.get("months", []),
            "categories": data.get("categories", []),
            "spend_reduction_tips": data.get("spend_reduction_tips", []),
            "top_transactions": data.get("top_transactions", []),
            "spend_by_channel": data.get("spend_by_channel", []),
            "created_at": datetime.utcnow(),
        }
        await statement_collection.insert_one(record)
    except Exception as e:
        print("MongoDB save failed:", e)


async def fetch_statement_history():
    try:
        cursor = statement_collection.find().sort("created_at", -1)
        results = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            results.append(doc)
        return results
    except Exception as e:
        print("MongoDB fetch failed:", e)
        return []

