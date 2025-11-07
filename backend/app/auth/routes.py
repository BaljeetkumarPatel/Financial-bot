from fastapi import APIRouter, HTTPException, Response, Request, Depends
from pydantic import BaseModel, EmailStr
from datetime import timedelta
from .crud import get_user_by_email, create_user
from .security import verify_password, create_token, decode_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ---------- Request models ----------
class Register(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


class Login(BaseModel):
    email: EmailStr
    password: str


# ---------- Register endpoint ----------
@router.post("/register")
async def register(data: Register):
    """Registers a new user after checking for duplicates."""
    existing = await get_user_by_email(data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = await create_user(data.email, data.password, data.full_name)
    return {"ok": True, "user": user, "msg": "User registered successfully"}


# ---------- Login endpoint ----------
@router.post("/login")
async def login(data: Login, response: Response):
    """Logs in user, verifies credentials, sets secure cookie."""
    user = await get_user_by_email(data.email)
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"sub": data.email})

    # Set secure HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,  # set True when using HTTPS
        max_age=60 * 60,  # 1 hour
    )

    return {"ok": True, "msg": "Login successful"}


# ---------- Logout endpoint ----------
@router.post("/logout")
async def logout(response: Response):
    """Clears the auth cookie."""
    response.delete_cookie("access_token")
    return {"ok": True, "msg": "Logged out successfully"}


# ---------- Token validation dependency ----------
def get_current_user(request: Request):
    """Validates the JWT token from cookies."""
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload


# ---------- Protected dashboard endpoint ----------
@router.get("/dashboard")
async def dashboard(user=Depends(get_current_user)):
    """Protected route — only accessible when logged in."""
    return {
        "ok": True,
        "user": user["sub"],
        "msg": f"Welcome to your dashboard, {user['sub']}!"
    }
