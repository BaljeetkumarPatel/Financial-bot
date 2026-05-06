from pathlib import Path
from threading import Lock
from typing import Optional

from dotenv import load_dotenv

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings  # fallback for older versions

class Settings(BaseSettings):
    MONGO_URI: str
    DB_NAME: str = "finance_bot_db"
    JWT_SECRET: str = "super_secret_key"
    JWT_ALGO: str = "HS256"
    EMAIL_FROM: Optional[str] = None
    EMAIL_PASSWORD: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: Optional[str] = None
    GEMINI_FALLBACK_MODELS: Optional[str] = None

    class Config:
        env_file = ".env"

_BASE_DIR = Path(__file__).resolve().parent.parent
_ENV_FILE = _BASE_DIR / ".env"
_SETTINGS_LOCK = Lock()
_cached_settings: Optional[Settings] = None
_cached_env_mtime: Optional[float] = None


def _env_mtime() -> Optional[float]:
    try:
        return _ENV_FILE.stat().st_mtime
    except FileNotFoundError:
        return None


def _build_settings() -> Settings:
    # Ensure process env mirrors .env updates before constructing settings.
    load_dotenv(dotenv_path=_ENV_FILE, override=True)
    return Settings()


def get_settings(force_reload: bool = False) -> Settings:
    global _cached_settings, _cached_env_mtime
    current_mtime = _env_mtime()
    needs_reload = (
        force_reload
        or _cached_settings is None
        or _cached_env_mtime != current_mtime
    )
    if not needs_reload:
        return _cached_settings

    with _SETTINGS_LOCK:
        current_mtime = _env_mtime()
        needs_reload = (
            force_reload
            or _cached_settings is None
            or _cached_env_mtime != current_mtime
        )
        if needs_reload:
            _cached_settings = _build_settings()
            _cached_env_mtime = current_mtime
    return _cached_settings


class SettingsProxy:
    def __getattr__(self, item):
        return getattr(get_settings(), item)


settings = SettingsProxy()

