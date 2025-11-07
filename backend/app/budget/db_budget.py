# backend/app/budget/models_budget.py

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Dict, Optional, List, Union
from bson import ObjectId


class ExpenseItem(BaseModel):
    """Single expense item (optional typed structure)"""
    category: str
    amount: float


class BudgetPlan(BaseModel):
    """
    MongoDB model for storing AI-generated budget plans.
    Supports dynamic expenses via list of ExpenseItems or dictionary.
    """

    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: Optional[str] = Field(default=None, description="Linked user's ID or email")
    income: float = Field(..., description="Total monthly income")
    expenses: Union[Dict[str, float], List[ExpenseItem]] = Field(
        ..., description="Flexible expense data — dictionary or list of category/amount pairs"
    )
    goal: Optional[str] = Field(default="Save more effectively", description="User's financial goal")
    plan: Optional[str] = Field(default=None, description="AI-generated personalized budget report")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Plan creation timestamp")

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True
        orm_mode = True
        schema_extra = {
            "example": {
                "user_id": "user123@example.com",
                "income": 60000,
                "expenses": [
                    {"category": "Rent", "amount": 15000},
                    {"category": "Food", "amount": 8000},
                    {"category": "Transport", "amount": 2000},
                    {"category": "Entertainment", "amount": 3000}
                ],
                "goal": "Save for new laptop",
                "plan": "💰 **Summary:** You can save ₹20,000 this month...",
                "timestamp": "2025-11-06T09:00:00Z"
            }
        }
