import os
import json
from google import genai
from google.genai.types import Content, Part
from dotenv import load_dotenv
from app.usage.usage_tracker import log_api_usage 

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


async def generate_ai_analysis(profile: dict,user_id: str = "guest") -> dict:
    """
    Gemini 2.5 Flash — Smart Financial Advisor
    Allocates user's savings across debts and goals based on priority, urgency, and balance.
    Suggests repayment strategy and timeline.
    """

    savings = profile.get("estimated_monthly_savings", 0)
    debts = profile.get("debts", [])
    goals = profile.get("goals", [])

    if not debts and not goals:
        return {
            "summary": "No debts or goals found. Please add them to get a financial plan.",
            "allocation": [],
        }

    prompt = f"""
You are an expert financial planner AI.
Analyze the user's financial details and create a clear monthly allocation plan.

User's Monthly Savings: ₹{savings}

Debts:
{chr(10).join([
    f"- {d['title']} | Balance ₹{d['balance']} | Minimum Payment ₹{d['min_payment']} | Priority {d['priority']}"
    for d in debts
]) or 'None'}

Goals:
{chr(10).join([
    f"- {g['title']} | Target ₹{g['target_amount']} | Saved ₹{g['saved_amount']} | Priority {g['priority']}"
    for g in goals
]) or 'None'}

### TASK
1. Divide the ₹{savings} savings between debts and goals, giving more weight to higher-priority items.
2. Each item gets:
   - `suggested_allocation` (₹ per month)
   - `estimated_months` (how long to finish)
3. Give a short, friendly summary about user's balance between debt clearing & goal progress.
4. If leftover savings remain after allocations, suggest where to invest (e.g., SIP, ELSS, PPF).
5. Return ONLY JSON (no markdown).

### Strict JSON Output:
{{
  "summary": "3–4 sentence summary about user's plan, tone: friendly, professional.",
  "allocation": [
    {{
      "title": "string",
      "type": "debt" or "goal",
      "suggested_allocation": number,
      "estimated_months": number,
      "strategy": "short advice like 'Snowball Method' or 'Increase SIP by 10%'"
    }}
  ],
  "investment_suggestion": {{
    "type": "string (like SIP/ELSS/PPF/FD)",
    "amount": number,
    "reason": "why it's beneficial"
  }}
}}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[Content(role="user", parts=[Part.from_text(prompt)])],
        )

        text = response.output_text.strip()
        cleaned = text.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned)
        

        # Estimate tokens used
        tokens_used = len(prompt.split()) + len(text.split())

        # ✅ Log successful usage
        await log_api_usage(
            user_id=user_id,
            feature="ai_financial_analysis",
            model="gemini-2.5-flash",
            tokens_used=tokens_used,
            success=True,
            extra_info={
                "debts": len(debts),
                "goals": len(goals),
                "timestamp": datetime.utcnow().isoformat(),
            },
        )

        return result

    except Exception as e:
        print("⚠️ Gemini AI error, using fallback:", e)
        return _fallback_ai_allocation(savings, debts, goals)


def _fallback_ai_allocation(savings: float, debts: list, goals: list) -> dict:
    total_priority = sum(d["priority"] for d in debts + goals) or 1
    allocations = []

    for item in debts + goals:
        alloc = (item["priority"] / total_priority) * savings*0.9
        balance = item.get("balance", item.get("target_amount", 0))
        months = round(balance / alloc, 1) if alloc > 0 else 0

        allocations.append({
            "title": item["title"],
            "type": "debt" if "balance" in item else "goal",
            "suggested_allocation": round(alloc, 2),
            "estimated_months": months,
            "strategy": "Pay high-priority items first to reduce stress faster"
        })

    return {
        "summary": f"Fallback: Distributed ₹{savings} based on priority. Focus on clearing debts first.",
        "allocation": allocations,
        "investment_suggestion": {
            "type": "SIP",
            "amount": round(savings * 0.1, 2),
            "reason": "Investing 10% in SIP builds long-term wealth even while paying debts."
        }
    }
