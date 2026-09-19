from typing import List, Optional
from pydantic import BaseModel, Field

class JobMatchRequest(BaseModel):
    job_description: str = Field(..., description="Target Job Description text pasted by candidate")
    profile_text: Optional[str] = Field(None, description="Optional candidate profile text or resume extract")
    user_skills: Optional[List[str]] = Field(None, description="Optional list of candidate skills")

class JobMatchResponse(BaseModel):
    job_match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    recommended_actions: List[str]
    disclaimer: Optional[str] = None
