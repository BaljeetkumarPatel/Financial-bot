import hashlib
import time
from threading import Lock
from google import genai
from app.config import settings

MODEL_NAME = "gemini-3.1-pro-preview"  # Primary: highest accuracy

# Ordered fallback chain: best → fastest → cheapest → older
GEMINI_MODELS = [
    "gemini-3.1-pro-preview",        # Top accuracy
    "gemini-3-flash-preview",         # Fast & cheap
    "gemini-3.1-flash-lite-preview",  # Ultra cheap
    "gemini-2.5-flash",               # Older but reliable
    "gemini-2.0-flash",               # Last Gemini resort
]

RETRY_WAIT_SECONDS = 10  # Wait between model attempts on quota error

# ─── In-memory prompt cache ───────────────────────────────────────────────────
# Key: SHA-256 of prompt  →  Value: {"text": str, "hits": int, "ts": float}
_cache: dict = {}
_cache_lock = Lock()
CACHE_TTL_SECONDS = 3600  # 1 hour — stale entries are ignored


class GeminiQuotaError(RuntimeError):
    """Raised when ALL providers (Gemini + fallback) have exhausted quota."""


# ─── Cache helpers ────────────────────────────────────────────────────────────

def _cache_key(prompt: str) -> str:
    return hashlib.sha256(prompt.encode("utf-8")).hexdigest()


def _cache_get(key: str) -> str | None:
    with _cache_lock:
        entry = _cache.get(key)
        if not entry:
            return None
        if time.time() - entry["ts"] > CACHE_TTL_SECONDS:
            del _cache[key]
            return None
        entry["hits"] += 1
        return entry["text"]


def _cache_set(key: str, text: str) -> None:
    with _cache_lock:
        _cache[key] = {"text": text, "hits": 0, "ts": time.time()}


def cache_stats() -> dict:
    """Return current cache size and total hits (useful for debugging)."""
    with _cache_lock:
        return {
            "entries": len(_cache),
            "total_hits": sum(e["hits"] for e in _cache.values()),
        }


# ─── Provider helpers ─────────────────────────────────────────────────────────

def _is_quota_error(message: str) -> bool:
    return (
        "RESOURCE_EXHAUSTED" in message
        or "429" in message
        or "quota" in message.lower()
        or "rate_limit" in message.lower()
        or "RateLimitError" in message
    )


def _try_gemini(prompt: str) -> str | None:
    """Try each Gemini model in order with a wait between quota failures."""
    api_key = getattr(settings, "GEMINI_API_KEY", None)
    if not api_key:
        return None

    client = genai.Client(api_key=api_key)
    for i, model_name in enumerate(GEMINI_MODELS):
        try:
            response = client.models.generate_content(model=model_name, contents=prompt)
            text = getattr(response, "text", None)
            if text and text.strip():
                print(f"[AI] Gemini model used: {model_name}")
                return text.strip()
        except Exception as e:
            msg = str(e)
            if _is_quota_error(msg):
                if i < len(GEMINI_MODELS) - 1:
                    print(f"[AI] Quota exhausted for {model_name}, waiting {RETRY_WAIT_SECONDS}s...")
                    time.sleep(RETRY_WAIT_SECONDS)
                else:
                    print(f"[AI] Quota exhausted for {model_name}, no more Gemini models.")
                continue
            print(f"[AI] Gemini error on {model_name}: {msg}")
            continue

    return None


def _try_openai(prompt: str) -> str | None:
    """Fallback to OpenAI gpt-4o-mini when all Gemini models are exhausted."""
    api_key = getattr(settings, "OPENAI_API_KEY", None)
    if not api_key:
        return None

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1500,
            temperature=0.7,
        )
        text = response.choices[0].message.content
        if text and text.strip():
            print("[AI] OpenAI fallback used: gpt-4o-mini")
            return text.strip()
    except Exception as e:
        print(f"[AI] OpenAI fallback error: {e}")

    return None


# ─── Public API ───────────────────────────────────────────────────────────────

def generate_text(prompt: str, model: str = MODEL_NAME) -> str:
    """
    1. Check in-memory cache → return immediately on hit (no AI call).
    2. Try Gemini models in order, waiting 10s between quota failures.
    3. Fall back to OpenAI gpt-4o-mini if all Gemini models fail.
    4. Store result in cache before returning.
    Raises GeminiQuotaError only if every provider is unavailable.
    """
    key = _cache_key(prompt)

    # 1. Cache hit
    cached = _cache_get(key)
    if cached:
        print("[AI] Cache hit — skipping AI call.")
        return cached

    # 2. Try Gemini
    result = _try_gemini(prompt)

    # 3. OpenAI fallback
    if not result:
        print("[AI] All Gemini models exhausted, trying OpenAI fallback...")
        result = _try_openai(prompt)

    if not result:
        raise GeminiQuotaError(
            "All AI providers are currently unavailable (quota exhausted or misconfigured). "
            "Please try again later."
        )

    # 4. Store in cache
    _cache_set(key, result)
    return result
