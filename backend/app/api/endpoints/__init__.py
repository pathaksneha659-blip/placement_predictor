from .health import router as health_router
from .predict import router as predict_router
from .resume import router as resume_router
from .job_matcher import router as job_matcher_router
from .career_assistant import router as career_assistant_router

__all__ = [
    "health_router",
    "predict_router",
    "resume_router",
    "job_matcher_router",
    "career_assistant_router",
]
