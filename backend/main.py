import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Ensure backend directory is on sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.config import ALLOWED_ORIGINS, PROJECT_ROOT
from app.api.router import api_router

app = FastAPI(
    title="Placement Predictor API",
    description="Intelligent AI Placement Predictor, Skill Gap Analyzer, and Career Assistant API",
    version="2.0.0"
)

# Enable CORS for frontend clients with standard compliance
is_wildcard = "*" in ALLOWED_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=not is_wildcard,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)

# Optional SPA static file serving if frontend is built
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"
if FRONTEND_DIST.exists():
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse

    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    async def serve_frontend_root():
        return FileResponse(FRONTEND_DIST / "index.html")

    @app.get("/{spa_path:path}")
    async def serve_frontend_spa(spa_path: str):
        if spa_path in {"health", "docs", "openapi.json", "redoc", "predict", "defaults", "analyze-resume", "match-job", "career-chat"}:
            raise HTTPException(status_code=404)
        file_path = FRONTEND_DIST / spa_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/")
    def root():
        return {
            "message": "Placement Predictor API is running",
            "docs": "/docs",
            "status": "active"
        }
