from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.auth.security import create_token, decode_token, hash_password
from app.auth.crud import get_user_by_email
from app.db import users
from app.config import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/auth", tags=["Password Reset"])

class ForgotRequest(BaseModel):
    email: EmailStr

@router.post("/forgot-password")
async def forgot_password(data: ForgotRequest):
    user = await get_user_by_email(data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate 15 min valid JWT reset token
    token = create_token({"sub": data.email}, expires_delta=60 * 15)
    reset_link = f"http://localhost:5173/reset-password/{token}"

    # Build email
    subject = "PF Bank - Password Reset Link"
    body = f"""
    <h2>🔐 PF Bank Password Reset</h2>
    <p>Hello,</p>
    <p>You requested to reset your password. Click the button below to reset it:</p>
    <a href="{reset_link}" 
       style="background-color:#1FA2B6;color:white;padding:10px 20px;
       text-decoration:none;border-radius:6px;display:inline-block;margin:10px 0;">
       Reset Password
    </a>
    <p>This link will expire in 15 minutes.</p>
    <br/>
    <p>— PF Bank Security Team</p>
    """

    # Send Email via Gmail SMTP
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = data.email
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
            smtp.starttls()
            smtp.login(settings.EMAIL_FROM, settings.EMAIL_PASSWORD)
            smtp.send_message(msg)

    except Exception as e:
        print(f"❌ Email send failed: {e}")
        raise HTTPException(status_code=500, detail="Error sending email")

    return {"ok": True, "msg": "Password reset link sent successfully to your email."}


# Reset password endpoint
class ResetData(BaseModel):
    token: str
    new_password: str

@router.post("/reset-password")
async def reset_password(data: ResetData):
    payload = decode_token(data.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    email = payload.get("sub")
    hashed = hash_password(data.new_password)
    await users.update_one({"email": email}, {"$set": {"password": hashed}})

    return {"ok": True, "msg": "Password updated successfully!"}
