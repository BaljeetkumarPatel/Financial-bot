import json
from datetime import datetime

from app.services.gemini_client import MODEL_NAME, GeminiQuotaError, generate_text
from app.usage.usage_tracker import log_api_usage


async def generate_ai_analysis(profile: dict, user_id: str = "guest") -> dict:
    """Generate savings allocation analysis for debts and goals."""
    savings = profile.get("estimated_monthly_savings", 0)
    debts = profile.get("debts", [])
    goals = profile.get("goals", [])

    if not debts and not goals:
        return {
            "summary": "No debts or goals found. Please add them to get a financial plan.",
            "allocation": [],
        }

    prompt = f'''
You are an expert financial planner AI.
Analyze the user's financial details and create a clear monthly allocation plan.

User's Monthly Savings: Rs {savings}

Debts:
{chr(10).join([f"- {d['title']} | Balance Rs {d['balance']} | Minimum Payment Rs {d['min_payment']} | Priority {d['priority']}" for d in debts]) or 'None'}

Goals:
{chr(10).join([f"- {g['title']} | Target Rs {g['target_amount']} | Saved Rs {g['saved_amount']} | Priority {g['priority']}" for g in goals]) or 'None'}

Return ONLY JSON:
{{
  "summary": "3-4 sentence professional summary",
  "allocation": [
    {{"title": "string", "type": "debt|goal", "suggested_allocation": 0, "estimated_months": 0, "strategy": "string"}}
  ],
  "investment_suggestion": {{"type": "SIP|ELSS|PPF|FD", "amount": 0, "reason": "string"}}
}}
'''

    try:
        text = generate_text(prompt)
        cleaned = text.replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned)

        tokens_used = len(prompt.split()) + len(text.split())
        await log_api_usage(
            user_id=user_id,
            feature="ai_financial_analysis",
            model=MODEL_NAME,
            tokens_used=tokens_used,
            success=True,
            extra_info={
                "debts": len(debts),
                "goals": len(goals),
                "timestamp": datetime.utcnow().isoformat(),
            },
        )
        return result
    except GeminiQuotaError as e:
        print(f"Gemini quota exhausted for AI analysis: {e}")
        return {
            "summary": "AI quota is currently exhausted. Please try again later or upgrade your Gemini API plan.",
            "allocation": [],
        }
    except Exception as e:
        print(f"Gemini AI error, using fallback: {e}")
        return _fallback_ai_allocation(savings, debts, goals)


def _fallback_ai_allocation(savings: float, debts: list, goals: list) -> dict:
    total_priority = sum(d["priority"] for d in debts + goals) or 1
    allocations = []

    for item in debts + goals:
        alloc = (item["priority"] / total_priority) * savings * 0.9
        balance = item.get("balance", item.get("target_amount", 0))
        months = round(balance / alloc, 1) if alloc > 0 else 0

        allocations.append(
            {
                "title": item["title"],
                "type": "debt" if "balance" in item else "goal",
                "suggested_allocation": round(alloc, 2),
                "estimated_months": months,
                "strategy": "Pay high-priority items first to reduce stress faster",
            }
        )

    return {
        "summary": f"Fallback: Distributed Rs {savings} based on priority. Focus on clearing debts first.",
        "allocation": allocations,
        "investment_suggestion": {
            "type": "SIP",
            "amount": round(savings * 0.1, 2),
            "reason": "Investing 10% in SIP builds long-term wealth even while paying debts.",
        },
    }

