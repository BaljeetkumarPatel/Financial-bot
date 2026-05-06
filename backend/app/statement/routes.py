from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from bson import ObjectId
from app.services.gemini_client import GeminiQuotaError
from app.services.statement_service import analyze_statement_with_gemini,fetch_statement_history
from app.db import statement_collection


router = APIRouter()

@router.post("/analyze-statement")
async def analyze_statement(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    user_id: Optional[str] = Form("guest"),
):
    """
    Analyze a bank statement.
    - Accepts either a PDF/text file upload, or plain text input.
    """
    if not file and not text:
        raise HTTPException(status_code=400, detail="Please upload a file or enter text for analysis.")

    try:
        result = await analyze_statement_with_gemini(file=file, text=text, user_id=user_id or "guest")
        return result
    except HTTPException:
        raise
    except GeminiQuotaError as e:
        raise HTTPException(
            status_code=503,
            detail="Statement analysis is temporarily unavailable due to Gemini quota limits. Please try again later."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_statement_history():
    """Fetch all previous statement analyses."""
    try:
        history = await fetch_statement_history()
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.delete("/history/{item_id}")
async def delete_history_item(item_id: str):
    """
    Delete a specific analysis record from MongoDB by ID.
    """
    try:
        result = await statement_collection.delete_one({"_id": ObjectId(item_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Item not found")
        return {"message": "Deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

