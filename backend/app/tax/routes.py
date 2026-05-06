from fastapi import APIRouter
from pydantic import BaseModel
from app.services.tax_advisor_service import generate_tax_insights

router = APIRouter(prefix="/tax", tags=["Tax Advisor"])


class TaxInput(BaseModel):
    income: float
    resident: bool = True
    is_salaried: bool = True
    language: str = "english"
    user_type: str = "salaried"
    is_director: bool = False
    has_unlisted_shares: bool = False
    has_foreign_assets_or_income: bool = False
    has_capital_gains: bool = False
    has_brought_forward_loss: bool = False
    has_business_income: bool = False
    is_presumptive_income: bool = False


@router.post("/estimate")
async def tax_estimator(data: TaxInput):
    result = await generate_tax_insights(
        income=data.income,
        resident=data.resident,
        is_salaried=data.is_salaried,
        language=data.language,
        user_type=data.user_type,
        is_director=data.is_director,
        has_unlisted_shares=data.has_unlisted_shares,
        has_foreign_assets_or_income=data.has_foreign_assets_or_income,
        has_capital_gains=data.has_capital_gains,
        has_brought_forward_loss=data.has_brought_forward_loss,
        has_business_income=data.has_business_income,
        is_presumptive_income=data.is_presumptive_income,
    )
    return result
