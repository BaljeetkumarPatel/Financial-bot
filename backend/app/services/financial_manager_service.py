from google import generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime
from app.usage.usage_tracker import log_api_usage 


load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def analyze_finances(profile):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        debts = profile.get("debts", [])
        goals = profile.get("goals", [])
        savings = profile.get("estimated_monthly_savings", 0)

        prompt = f"""
            You are a financial advisor AI.
            Analyze this user's financial data and suggest an optimal monthly allocation of ₹{savings} across debts and goals.

            Data:
            Debts: {debts}
            Goals: {goals}

            Return only JSON in the format:
            {{
              "allocation": [
                {{"title": "study loan", "suggested_allocation": 12000, "estimated_months": 12}},
                {{"title": "car", "suggested_allocation": 8000, "estimated_months": 6}}
              ],
              "summary": "Short human-friendly summary of your reasoning."
            }}
            """
        response = model.generate_content(prompt)
        import json
        cleaned = response.text.strip().replace("```json", "").replace("```", "")
        data = json.loads(cleaned)


        tokens_used = len(prompt.split()) + len(response.text.split())
        # ✅ Log this API usage
        await log_api_usage(
            user_id=user_id,
            feature="financial_planner",
            model=model,
            tokens_used=tokens_used,
            success=True,
            extra_info={
                "debts_count": len(debts),
                "goals_count": len(goals),
                "timestamp": datetime.utcnow().isoformat()
            }
        )
        return data
    except Exception as e:
        print("AI analysis error:", e)
        return {"allocation": [], "summary": "Error generating AI analysis."}
