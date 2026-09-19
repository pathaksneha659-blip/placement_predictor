from fastapi import APIRouter
from ...config import MODEL_PATH, DEFAULTS_PATH

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": MODEL_PATH.exists(),
        "defaults_loaded": DEFAULTS_PATH.exists(),
        "version": "1.0.0"
    }
