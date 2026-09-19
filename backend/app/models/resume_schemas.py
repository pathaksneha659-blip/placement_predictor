from typing import List, Optional
from pydantic import BaseModel

class ResumeAnalysisResponse(BaseModel):
    resume_score: int
    skills_found: List[str]
    projects_found: List[str]
    missing_sections: List[str]
    suggestions: List[str]
    score_breakdown: Optional[dict] = None
    disclaimer: Optional[str] = None
