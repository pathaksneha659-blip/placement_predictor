from fastapi import APIRouter, HTTPException
from app.models.job_schemas import JobMatchRequest, JobMatchResponse
from app.services.job_service import analyze_job_match

router = APIRouter(tags=["Job Matcher"])

@router.post("/match-job", response_model=JobMatchResponse)
def match_job(request: JobMatchRequest):
    if not request.job_description or len(request.job_description.strip()) < 10:
        raise HTTPException(status_code=400, detail="Please provide a valid Job Description text (at least 10 characters).")
    try:
        result = analyze_job_match(
            job_desc=request.job_description,
            profile_text=request.profile_text,
            user_skills=request.user_skills
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job matching failed: {str(e)}")
