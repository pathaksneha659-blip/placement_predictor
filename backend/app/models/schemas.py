from typing import List, Optional
from pydantic import BaseModel, Field

class PredictRequest(BaseModel):
    cgpa: float = Field(..., ge=0.0, le=10.0, description="Cumulative Grade Point Average (0-10)")
    internships_count: int = Field(..., ge=0, description="Number of internships completed")
    projects_count: int = Field(..., ge=0, description="Number of projects completed")
    coding_skill_score: float = Field(..., ge=0.0, le=100.0, description="Coding skill score (0-100)")
    aptitude_score: float = Field(..., ge=0.0, le=100.0, description="Aptitude test score (0-100)")
    communication_skill_score: float = Field(..., ge=0.0, le=100.0, description="Communication skill score (0-100)")
    logical_reasoning_score: float = Field(..., ge=0.0, le=100.0, description="Logical reasoning score (0-100)")
    mock_interview_score: float = Field(..., ge=0.0, le=100.0, description="Mock interview score (0-100)")
    backlogs: int = Field(..., ge=0, description="Number of active/historical backlogs")
    study_hours_per_day: float = Field(..., ge=0.0, le=24.0, description="Daily study hours (0-24)")
    
    # Adaptive Recommendation Engine parameters (optional from progress history)
    recent_completion_rate: Optional[float] = Field(None, ge=0.0, le=100.0, description="Recent 7-day completion rate percentage")
    improved_skill: Optional[str] = Field(None, description="Skill that recently improved")
    improved_pct: Optional[float] = Field(None, description="Percentage points improvement in skill")

class SkillGapItem(BaseModel):
    skill: str
    score_display: str
    raw_score: float
    status: str  # "Strong" | "Moderate" | "Needs Improvement"
    priority: str  # "High" | "Medium" | "Low"
    recommendation: str
    benchmark: str

class DailyGoalItem(BaseModel):
    id: str
    title: str
    description: str
    category: str  # "Coding", "Aptitude", "Communication", "Projects", "Interview Prep", "Academics"
    estimated_minutes: int
    priority: str  # "High", "Medium", "Low"
    completed: bool = False
    adaptive_note: Optional[str] = None

class PredictResponse(BaseModel):
    placement_status: str
    placement_probability: float
    not_placed_probability: float
    skill_gap_analysis: Optional[List[SkillGapItem]] = None
    top_priorities: Optional[List[str]] = None
    daily_goals: Optional[List[DailyGoalItem]] = None
    total_goal_minutes: Optional[int] = None
    available_study_minutes: Optional[int] = None
    adaptive_mode: Optional[str] = None
    adaptive_recommendation_message: Optional[str] = None
