# from pydantic_settings import BaseSettings

from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    MONGO_URI: str
    DB_NAME: str = "finance_bot_db"
    JWT_SECRET: str = "super_secret_key"
    JWT_ALGO: str = "HS256"
    EMAIL_FROM: Optional[str] = None
    EMAIL_PASSWORD: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()

