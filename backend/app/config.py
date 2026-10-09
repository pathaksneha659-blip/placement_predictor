import os
from pathlib import Path

# Paths
APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent

# Load .env if python-dotenv is available
try:
    from dotenv import load_dotenv
    # Priority: Backend .env > Root .env > system env
    if (BACKEND_DIR / ".env").exists():
        load_dotenv(BACKEND_DIR / ".env")
    elif (PROJECT_ROOT / ".env").exists():
        load_dotenv(PROJECT_ROOT / ".env")
    else:
        load_dotenv()
except ImportError:
    pass

MODEL_PATH = BACKEND_DIR / "placement_model.pkl"
DEFAULTS_PATH = BACKEND_DIR / "default_values.pkl"

# Server Host and Port
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")

# CORS and Environment
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://placement-predictor-1-ku2k.onrender.com")
ALLOWED_ORIGINS_RAW = os.getenv("ALLOWED_ORIGINS", "")

_parsed_origins = [
    "https://placement-predictor-1-ku2k.onrender.com",
    "http://placement-predictor-1-ku2k.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if FRONTEND_URL and FRONTEND_URL != "*":
    _cleaned = FRONTEND_URL.strip().rstrip("/")
    if _cleaned and _cleaned not in _parsed_origins:
        _parsed_origins.append(_cleaned)

if ALLOWED_ORIGINS_RAW:
    for _orig in ALLOWED_ORIGINS_RAW.split(","):
        _cleaned = _orig.strip().rstrip("/")
        if _cleaned and _cleaned not in _parsed_origins:
            _parsed_origins.append(_cleaned)

ALLOWED_ORIGINS = _parsed_origins

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

DEFAULT_FALLBACK_VALUES = {
    "cgpa": 7.5,
    "internships_count": 1,
    "projects_count": 3,
    "coding_skill_score": 70.0,
    "aptitude_score": 65.0,
    "communication_skill_score": 68.0,
    "logical_reasoning_score": 66.0,
    "mock_interview_score": 70.0,
    "backlogs": 0,
    "study_hours_per_day": 3.5
}
