# backend/app/financial_manager/models_financial.py

from datetime import datetime

def create_financial_profile(user_id: str, estimated_savings: float = 0.0):
    """
    Create a new financial profile for a user.
    """
    return {
        "user_id": user_id,
        "estimated_monthly_savings": estimated_savings,
        "debts": [],
        "goals": [],
        "created_at": datetime.utcnow(),
    }


def create_debt(title: str, balance: float, min_payment: float, priority: int):
    """
    Create a debt document.
    priority: 1 (High) → 5 (Low)
    """
    return {
        "title": title,
        "balance": balance,
        "min_payment": min_payment,
        "priority": priority,
        "created_at": datetime.utcnow(),
    }


def create_goal(title: str, target_amount: float, saved_amount: float, priority: int):
    """
    Create a goal document.
    """
    return {
        "title": title,
        "target_amount": target_amount,
        "saved_amount": saved_amount,
        "priority": priority,
        "created_at": datetime.utcnow(),
    }
