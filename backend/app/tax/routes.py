from fastapi import APIRouter
from pydantic import BaseModel
from app.services.tax_advisor_service import generate_tax_insights

router = APIRouter(prefix="/tax", tags=["Tax Advisor"])

class TaxInput(BaseModel):
    income: float

@router.post("/estimate")
async def tax_estimator(data: TaxInput):
    result = await generate_tax_insights(data.income)
    return result
