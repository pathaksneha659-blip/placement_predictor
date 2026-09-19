from fastapi import APIRouter
from app.api.endpoints import (
    health_router,
    predict_router,
    resume_router,
    job_matcher_router,
    career_assistant_router,
)

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(predict_router)
api_router.include_router(resume_router)
api_router.include_router(job_matcher_router)
api_router.include_router(career_assistant_router)
