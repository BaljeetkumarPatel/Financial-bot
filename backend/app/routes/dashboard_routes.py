from fastapi import APIRouter, HTTPException
from app.db import financial_profiles, chat_history, budget_collection

router = APIRouter()

@router.get("/overview")
async def get_dashboard_overview(user_id: str = None):
    """
    Dashboard summary combining data from:
    - financial_profiles
    - chat_history
    - budget_plans
    """
    try:
        # 🧠 1️⃣ Financial Profile
        profile = await financial_profiles.find_one({"user_id": user_id}) if user_id else await financial_profiles.find_one({})
        if not profile:
            profile = {"debts": [], "goals": [], "estimated_monthly_savings": 0}

        total_debt = sum(d.get("balance", 0) for d in profile.get("debts", []))
        total_min_payment = sum(d.get("min_payment", 0) for d in profile.get("debts", []))

        goals = profile.get("goals", [])
        total_goals = len(goals)
        goal_progress = 0
        if total_goals > 0:
            total_saved = sum(g.get("saved_amount", 0) for g in goals)
            total_target = sum(g.get("target_amount", 0) for g in goals)
            goal_progress = round((total_saved / total_target) * 100, 2) if total_target > 0 else 0

        # 💬 2️⃣ Last AI Insight
        last_chat = await chat_history.find_one(sort=[("_id", -1)])
        ai_insight = last_chat["response"] if last_chat and "response" in last_chat else "No recent AI insights available."

        # 💸 3️⃣ Budget Overview
        budgets = await budget_collection.find().to_list(None)
        expenses = [b for b in budgets if b.get("type") == "expense"]
        total_expenses = sum(b.get("amount", 0) for b in expenses)

        category_spending = {}
        for b in expenses:
            cat = b.get("category", "Misc")
            category_spending[cat] = category_spending.get(cat, 0) + b.get("amount", 0)

        chart_data = [{"category": k, "amount": v} for k, v in category_spending.items()]

        # 💰 4️⃣ Financial Insights Summary
        estimated_savings = profile.get("estimated_monthly_savings", 0)
        financial_health = "✅ Excellent!" if estimated_savings > total_min_payment else "⚠️ Savings less than debt payments."

        # 📦 5️⃣ Response
        return {
            "total_goals": total_goals,
            "goal_progress": goal_progress,
            "total_debt": round(total_debt, 2),
            "min_payment_due": round(total_min_payment, 2),
            "estimated_savings": round(estimated_savings, 2),
            "ai_insight": ai_insight,
            "financial_health": financial_health,
            "chart_data": chart_data,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error building dashboard overview: {e}")
