import os
from dotenv import load_dotenv
from google import generativeai as genai
import json
# from app.usage.usage_tracker import log_api_usage 


# Load API key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API_KEY not found in .env file!")

genai.configure(api_key=GEMINI_API_KEY)


def calculate_tax_slab(income: float):
    """Simple Indian tax slab logic (new regime FY 2024-25)"""
    if income <= 300000:
        return 0, 0
    elif income <= 600000:
        return 5, 0.05 * income
    elif income <= 900000:
        return 10, 0.10 * income
    elif income <= 1200000:
        return 15, 0.15 * income
    elif income <= 1500000:
        return 20, 0.20 * income
    else:
        return 30, 0.30 * income


async def generate_tax_insights(income: float): #user_id: str = "guest"
    slab, tax = calculate_tax_slab(income)

    prompt = f"""
        You are a certified Indian financial advisor AI.  
        Given the user's annual income of ₹{income:,.0f}, estimate their tax liability 
        under the **new Indian tax regime (FY 2024-25)**, then provide professional yet friendly suggestions 
        on **how they can optimize or save taxes legally**.

        ### Output Format (strict JSON only, no markdown):
        {{
        "income": {income},
        "tax_slab": "{slab}%",
        "estimated_tax": "{tax:,.0f}",
        "suggestions": [
            {{
            "title": "ELSS Mutual Funds",
            "section": "80C",
            "description": "Equity-linked savings schemes are diversified equity mutual funds with a 3-year lock-in; ideal for tax savings and long-term growth."
            }},
            {{
            "title": "Public Provident Fund (PPF)",
            "section": "80C",
            "description": "A long-term, government-backed savings scheme offering tax-free returns and safety."
            }}
        ]
        }}

        Now analyze this specific income and recommend **3-6 personalized investment or saving options** that could help reduce tax or improve financial planning, such as NPS, Sukanya Samriddhi, HRA, Health Insurance, etc.
        """

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        cleaned = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned)

        # # 🧮 Estimate tokens (roughly)
        # tokens_used = len(prompt.split()) + len(response.text.split())

        # # ✅ Log successful API usage
        # await log_api_usage(
        #     user_id=user_id,
        #     feature="tax_advisor",
        #     model=model,
        #     tokens_used=tokens_used,
        #     success=True,
        #     extra_info={
        #         "tax_slab": f"{slab}%",
        #         "estimated_tax": tax,
        #         "timestamp": datetime.utcnow().isoformat(),
        #     },
        # )
    except Exception as e:
        print("⚠️ Gemini Parsing Error:", e)
        data = {
            "income": income,
            "tax_slab": f"{slab}%",
            "estimated_tax": f"{tax:,.0f}",
            "suggestions": [
                {"title": "ELSS Mutual Funds", "section": "80C", "description": "Diversified equity mutual funds with 3-year lock-in; eligible for deductions."},
                {"title": "Public Provident Fund (PPF)", "section": "80C", "description": "Long-term, government-backed savings with tax-free returns."},
            ],
        }

    return data
