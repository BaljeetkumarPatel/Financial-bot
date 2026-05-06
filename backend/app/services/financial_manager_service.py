import json
from datetime import datetime

from app.services.gemini_client import MODEL_NAME, GeminiQuotaError, generate_text
from app.usage.usage_tracker import log_api_usage


async def analyze_finances(profile, user_id: str = "guest"):
    try:
        debts = profile.get("debts", [])
        goals = profile.get("goals", [])
        savings = profile.get("estimated_monthly_savings", 0)

        prompt = f'''
You are a financial advisor AI.
Analyze this user's financial data and suggest an optimal monthly allocation of Rs {savings} across debts and goals.

Data:
Debts: {debts}
Goals: {goals}

Return only JSON in this format:
{{
  "allocation": [
    {{"title": "study loan", "suggested_allocation": 12000, "estimated_months": 12}},
    {{"title": "car", "suggested_allocation": 8000, "estimated_months": 6}}
  ],
  "summary": "Short human-friendly summary of your reasoning."
}}
'''

        response_text = generate_text(prompt)
        cleaned = response_text.strip().replace("```json", "").replace("```", "")
        data = json.loads(cleaned)

        tokens_used = len(prompt.split()) + len(response_text.split())
        await log_api_usage(
            user_id=user_id,
            feature="financial_planner",
            model=MODEL_NAME,
            tokens_used=tokens_used,
            success=True,
            extra_info={
                "debts_count": len(debts),
                "goals_count": len(goals),
                "timestamp": datetime.utcnow().isoformat(),
            },
        )
        return data
    except GeminiQuotaError as e:
        print(f"Gemini quota exhausted for financial analysis: {e}")
        return {"allocation": [], "summary": "AI quota is currently exhausted. Please try again later."}
    except Exception as e:
        print(f"AI analysis error: {e}")
        return {"allocation": [], "summary": "Error generating AI analysis."}

