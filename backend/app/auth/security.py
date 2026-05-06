from datetime import datetime, timedelta
import hashlib
import jwt
from passlib.context import CryptContext
from ..config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def _normalized_jwt_secret() -> str:
    secret = settings.JWT_SECRET or ""
    if len(secret.encode("utf-8")) >= 32:
        return secret
    # Avoid weak HMAC key warnings by deriving a stable 32-byte secret from short values.
    return hashlib.sha256(secret.encode("utf-8")).hexdigest()

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(data: dict, minutes: int = 60):
    expire = datetime.utcnow() + timedelta(minutes=minutes)
    data.update({"exp": expire})
    return jwt.encode(data, _normalized_jwt_secret(), algorithm=settings.JWT_ALGO)

def decode_token(token: str):
    try:
        return jwt.decode(token, _normalized_jwt_secret(), algorithms=[settings.JWT_ALGO])
    except jwt.PyJWTError:
        return None
