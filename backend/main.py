import io
import sys
from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import pypdf
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

try:
    from backend.resume_analyzer import analyze_resume_text, ResumeAnalysisResponse
    from backend.job_matcher import analyze_job_match, JobMatchRequest, JobMatchResponse
    from backend.career_assistant import process_career_chat, CareerChatRequest, CareerChatResponse
except (ImportError, ModuleNotFoundError):
    from resume_analyzer import analyze_resume_text, ResumeAnalysisResponse
    from job_matcher import analyze_job_match, JobMatchRequest, JobMatchResponse
    from career_assistant import process_career_chat, CareerChatRequest, CareerChatResponse

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "placement_model.pkl"
DEFAULTS_PATH = BASE_DIR / "default_values.pkl"

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
if not DEFAULTS_PATH.exists():
    raise FileNotFoundError(f"Default values file not found at: {DEFAULTS_PATH}")

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load placement model from {MODEL_PATH}: {e}") from e

try:
    default_values = joblib.load(DEFAULTS_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load default values from {DEFAULTS_PATH}: {e}") from e

app = FastAPI(title="Placement Predictor API")

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    recent_completion_rate: Optional[float] = Field(None, ge=0.0, le=100.0, description="Recent 7-day or yesterday completion rate percentage")
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


def run_skill_gap_analysis(data: dict) -> tuple[List[SkillGapItem], List[str]]:
    items = []

    # 1. CGPA
    cgpa = float(data.get("cgpa", 0.0))
    if cgpa >= 8.0:
        c_status, c_priority, c_rec = "Strong", "Low", "Excellent academic standing; maintain current performance."
    elif cgpa >= 7.0:
        c_status, c_priority, c_rec = "Moderate", "Medium", "Target elevating CGPA above 8.0 to pass competitive shortlists."
    else:
        c_status, c_priority, c_rec = "Needs Improvement", "High", "Critical: Focus on upcoming semester exams to raise CGPA above 7.0 cutoff."
    items.append(SkillGapItem(
        skill="CGPA",
        score_display=f"{cgpa:.1f}/10.0",
        raw_score=cgpa,
        status=c_status,
        priority=c_priority,
        recommendation=c_rec,
        benchmark=">= 8.0 (Strong), 7.0-7.99 (Moderate)"
    ))

    # 2. Coding Skill Score
    coding = float(data.get("coding_skill_score", 0.0))
    if coding >= 80.0:
        cod_status, cod_priority, cod_rec = "Strong", "Low", "Advanced problem-solving skill; practice system design and complex algorithmic problems."
    elif coding >= 60.0:
        cod_status, cod_priority, cod_rec = "Moderate", "Medium", "Solve 2-3 medium LeetCode/HackerRank DSA problems daily to reach the 80+ benchmark."
    else:
        cod_status, cod_priority, cod_rec = "Needs Improvement", "High", "Urgent: Strengthen core data structures (Arrays, Trees, Graphs, DP) and daily coding drills."
    items.append(SkillGapItem(
        skill="Coding Skill",
        score_display=f"{coding:.0f}/100",
        raw_score=coding,
        status=cod_status,
        priority=cod_priority,
        recommendation=cod_rec,
        benchmark=">= 80 (Strong), 60-79 (Moderate)"
    ))

    # 3. Aptitude Score
    apt = float(data.get("aptitude_score", 0.0))
    if apt >= 80.0:
        apt_status, apt_priority, apt_rec = "Strong", "Low", "High quantitative mastery; maintain speed through timed weekly sectionals."
    elif apt >= 60.0:
        apt_status, apt_priority, apt_rec = "Moderate", "Medium", "Improve quantitative speed and shortcut techniques in time-and-work, probability, and percentages."
    else:
        apt_status, apt_priority, apt_rec = "Needs Improvement", "High", "High Priority: Practice standard quantitative aptitude tests to clear preliminary company filters."
    items.append(SkillGapItem(
        skill="Aptitude",
        score_display=f"{apt:.0f}/100",
        raw_score=apt,
        status=apt_status,
        priority=apt_priority,
        recommendation=apt_rec,
        benchmark=">= 80 (Strong), 60-79 (Moderate)"
    ))

    # 4. Communication Skill Score
    comm = float(data.get("communication_skill_score", 0.0))
    if comm >= 80.0:
        comm_status, comm_priority, comm_rec = "Strong", "Low", "Articulate and confident; ready for leadership and managerial rounds."
    elif comm >= 60.0:
        comm_status, comm_priority, comm_rec = "Moderate", "Medium", "Participate in group discussions and structured STAR-method storytelling sessions."
    else:
        comm_status, comm_priority, comm_rec = "Needs Improvement", "High", "Essential: Practice spoken English, technical articulation, and concise conversational pacing."
    items.append(SkillGapItem(
        skill="Communication",
        score_display=f"{comm:.0f}/100",
        raw_score=comm,
        status=comm_status,
        priority=comm_priority,
        recommendation=comm_rec,
        benchmark=">= 80 (Strong), 60-79 (Moderate)"
    ))

    # 5. Logical Reasoning Score
    logic = float(data.get("logical_reasoning_score", 0.0))
    if logic >= 80.0:
        log_status, log_priority, log_rec = "Strong", "Low", "Sharp critical thinking; consistent performance across puzzle tests."
    elif logic >= 60.0:
        log_status, log_priority, log_rec = "Moderate", "Medium", "Sharpen analytical puzzles, seating arrangements, syllogisms, and pattern series."
    else:
        log_status, log_priority, log_rec = "Needs Improvement", "High", "Needs Focus: Dedicate focused time to logical deductions, data sufficiency, and analytical reasoning."
    items.append(SkillGapItem(
        skill="Logical Reasoning",
        score_display=f"{logic:.0f}/100",
        raw_score=logic,
        status=log_status,
        priority=log_priority,
        recommendation=log_rec,
        benchmark=">= 80 (Strong), 60-79 (Moderate)"
    ))

    # 6. Mock Interview Score
    mock = float(data.get("mock_interview_score", 0.0))
    if mock >= 80.0:
        mock_status, mock_priority, mock_rec = "Strong", "Low", "Excellent interview presence, technical depth, and professional composure."
    elif mock >= 60.0:
        mock_status, mock_priority, mock_rec = "Moderate", "Medium", "Conduct 2-3 peer mock interviews focusing on handling unexpected questions under pressure."
    else:
        mock_status, mock_priority, mock_rec = "Needs Improvement", "High", "Crucial: Schedule realistic technical and HR mock sessions with mentors to build confidence."
    items.append(SkillGapItem(
        skill="Mock Interview",
        score_display=f"{mock:.0f}/100",
        raw_score=mock,
        status=mock_status,
        priority=mock_priority,
        recommendation=mock_rec,
        benchmark=">= 80 (Strong), 60-79 (Moderate)"
    ))

    # 7. Internships
    intern = int(data.get("internships_count", 0))
    if intern >= 2:
        int_status, int_priority, int_rec = "Strong", "Low", "Robust industry exposure; highlight measurable project achievements on resume."
    elif intern == 1:
        int_status, int_priority, int_rec = "Moderate", "Medium", "Consider a second internship, freelance contract, or active open-source contribution."
    else:
        int_status, int_priority, int_rec = "Needs Improvement", "High", "High Impact: Prioritize securing at least 1 verified internship or production contribution."
    items.append(SkillGapItem(
        skill="Internships",
        score_display=f"{intern}",
        raw_score=float(intern),
        status=int_status,
        priority=int_priority,
        recommendation=int_rec,
        benchmark=">= 2 (Strong), 1 (Moderate), 0 (Needs Improvement)"
    ))

    # 8. Projects
    proj = int(data.get("projects_count", 0))
    if proj >= 4:
        proj_status, proj_priority, proj_rec = "Strong", "Low", "Broad project portfolio; ensure live deployments and clean GitHub documentation."
    elif proj >= 2:
        proj_status, proj_priority, proj_rec = "Moderate", "Medium", "Build and deploy 1-2 end-to-end full-stack or ML systems with production architecture."
    else:
        proj_status, proj_priority, proj_rec = "Needs Improvement", "High", "Critical: Build at least 2 deployable capstone projects showcasing real-world problem solving."
    items.append(SkillGapItem(
        skill="Projects",
        score_display=f"{proj}",
        raw_score=float(proj),
        status=proj_status,
        priority=proj_priority,
        recommendation=proj_rec,
        benchmark=">= 4 (Strong), 2-3 (Moderate), 0-1 (Needs Improvement)"
    ))

    # 9. Backlogs
    backlogs = int(data.get("backlogs", 0))
    if backlogs == 0:
        back_status, back_priority, back_rec = "Strong", "Low", "Clean academic record with zero backlogs clears all tier-1 company eligibility rules."
    elif backlogs == 1:
        back_status, back_priority, back_rec = "Moderate", "Medium", "Ensure your single pending subject is cleared in the immediate remedial attempt."
    else:
        back_status, back_priority, back_rec = "Needs Improvement", "High", "Critical Red Flag: Clear multiple backlogs immediately as most campus drives enforce zero backlogs."
    items.append(SkillGapItem(
        skill="Backlogs",
        score_display=f"{backlogs}",
        raw_score=float(backlogs),
        status=back_status,
        priority=back_priority,
        recommendation=back_rec,
        benchmark="0 (Strong), 1 (Moderate), >1 (Needs Improvement)"
    ))

    # 10. Study Hours Per Day
    study = float(data.get("study_hours_per_day", 0.0))
    if study >= 4.0:
        std_status, std_priority, std_rec = "Strong", "Low", "Diligent study discipline; keep a balanced schedule to prevent fatigue."
    elif study >= 2.0:
        std_status, std_priority, std_rec = "Moderate", "Medium", "Increase daily focused preparation to 4+ hours, prioritizing high-yield topics."
    else:
        std_status, std_priority, std_rec = "Needs Improvement", "High", "High Priority: Allocate at least 3-4 structured study hours daily leading into placement season."
    items.append(SkillGapItem(
        skill="Study Hours",
        score_display=f"{study:.1f} hrs/day",
        raw_score=study,
        status=std_status,
        priority=std_priority,
        recommendation=std_rec,
        benchmark=">= 4.0 (Strong), 2.0-3.99 (Moderate), < 2.0 (Needs Improvement)"
    ))

    priority_order = {"Needs Improvement": 0, "Moderate": 1, "Strong": 2}
    sorted_items = sorted(items, key=lambda x: priority_order.get(x.status, 3))

    top_priorities = [
        item.skill for item in sorted_items if item.status in ["Needs Improvement", "Moderate"]
    ]
    if not top_priorities:
        top_priorities = [sorted_items[0].skill]

    return sorted_items, top_priorities[:3]


def generate_daily_goals(user_data: dict) -> tuple[List[DailyGoalItem], int, int, str, str]:
    """
    Adaptive Rule-Based Recommendation Engine for Daily Goals.
    Adjusts goal difficulty, quantity, and priority based on:
      1. Completion rate (>= 80% increases difficulty, < 50% reduces workload, 50-79% balanced).
      2. Weakest competencies (prioritizing stubborn bottlenecks).
      3. Improved competencies (de-prioritizing skills that advanced, shifting focus to next gaps).
      4. Hard constraint: total minutes <= study_hours_per_day * 60.
    """
    study_hours = float(user_data.get("study_hours_per_day", 3.5))
    available_minutes = max(int(study_hours * 60), 30)

    completion_rate = user_data.get("recent_completion_rate")
    improved_skill = user_data.get("improved_skill")
    improved_pct = user_data.get("improved_pct")

    # Determine Adaptive Mode and Message
    if completion_rate is not None and completion_rate >= 80.0:
        adaptive_mode = "Increased Difficulty"
        workload_mult = 1.10
        if improved_skill and improved_pct and improved_pct >= 10:
            adaptive_msg = f"Your {improved_skill.lower()} progress improved by {improved_pct:.0f}%. Today's workload has been slightly increased, and focus shifted to your next weakest competency."
        else:
            adaptive_msg = f"High achievement ({completion_rate:.0f}% completion). Today's goal depth and challenge have been slightly increased."
    elif completion_rate is not None and completion_rate < 50.0:
        adaptive_mode = "Reduced Workload"
        workload_mult = 0.80
        adaptive_msg = f"You completed only {completion_rate:.0f}% of recent goals. Today's workload has been reduced to make goals more achievable and rebuild momentum."
    else:
        adaptive_mode = "Balanced Pace"
        workload_mult = 1.0
        if improved_skill and improved_pct and improved_pct >= 10:
            adaptive_msg = f"Your {improved_skill.lower()} progress improved by {improved_pct:.0f}%. Today's {improved_skill.lower()} workload has been adjusted."
        else:
            adaptive_msg = "Consistent habit pace. Maintaining steady daily preparation workload."

    coding = float(user_data.get("coding_skill_score", 0.0))
    apt = float(user_data.get("aptitude_score", 0.0))
    comm = float(user_data.get("communication_skill_score", 0.0))
    mock = float(user_data.get("mock_interview_score", 0.0))
    logic = float(user_data.get("logical_reasoning_score", 0.0))
    proj = int(user_data.get("projects_count", 0))
    intern = int(user_data.get("internships_count", 0))
    backlogs = int(user_data.get("backlogs", 0))
    cgpa = float(user_data.get("cgpa", 0.0))

    # Weighting gaps
    weaknesses = []
    if backlogs > 0:
        weaknesses.append(("backlogs", 120 + backlogs * 10))
    if coding < 80:
        # If coding recently improved, decrease weight so other gaps take precedence
        w = (85 - coding) * (0.6 if (improved_skill and "coding" in improved_skill.lower()) else 1.0)
        weaknesses.append(("coding", w))
    if apt < 80:
        w = (85 - apt) * (0.6 if (improved_skill and "aptitude" in improved_skill.lower()) else 1.0)
        weaknesses.append(("aptitude", w))
    if mock < 80:
        weaknesses.append(("mock", 85 - mock))
    if proj < 4:
        weaknesses.append(("projects", (4 - proj) * 20))
    if comm < 80:
        weaknesses.append(("communication", 85 - comm))
    if logic < 80:
        weaknesses.append(("logic", 85 - logic))
    if intern < 2:
        weaknesses.append(("internships", (2 - intern) * 25))
    if cgpa < 8.0:
        weaknesses.append(("cgpa", (8.0 - cgpa) * 12))

    weaknesses.sort(key=lambda x: x[1], reverse=True)

    # Goal Template Definitions tailored to adaptive mode
    if adaptive_mode == "Reduced Workload":
        GOAL_TEMPLATES = {
            "backlogs": {"title": "Review 1 Backlog Syllabus Topic", "description": "Quick focused 25-minute review of fundamental formulas and definitions.", "category": "Academics", "base_min": 25, "priority": "High", "adaptive_note": "Lightened workload"},
            "coding": {"title": "Solve 2 Core Easy/Medium Problems", "description": "Solve 2 accessible problems on Arrays/Strings to build confidence.", "category": "Coding", "base_min": 30, "priority": "High", "adaptive_note": "Achievable goal"},
            "aptitude": {"title": "Solve 10 Aptitude Questions", "description": "Practice 10 high-frequency quantitative questions with immediate solution review.", "category": "Aptitude", "base_min": 20, "priority": "High", "adaptive_note": "Achievable goal"},
            "projects": {"title": "Document 1 Project Feature", "description": "Spend 25 minutes writing clean README docs or small UI tweak.", "category": "Projects", "base_min": 25, "priority": "Medium", "adaptive_note": "Lightened workload"},
            "mock": {"title": "Practice 3 Common HR Questions", "description": "Rehearse answers out loud to 3 standard placement interview questions.", "category": "Interview Prep", "base_min": 20, "priority": "High", "adaptive_note": "Achievable goal"},
            "communication": {"title": "Practice 1-Minute Self-Introduction", "description": "Brief spoken practice focusing on clear articulation.", "category": "Communication", "base_min": 15, "priority": "Medium", "adaptive_note": "Achievable goal"},
            "logic": {"title": "Solve 5 Logical Puzzles", "description": "Quick logical deduction and pattern recognition questions.", "category": "Aptitude", "base_min": 15, "priority": "Medium", "adaptive_note": "Achievable goal"},
            "internships": {"title": "Review Resume & 1 Application", "description": "Check resume formatting and apply to 1 relevant posting.", "category": "Career", "base_min": 20, "priority": "Medium", "adaptive_note": "Lightened workload"},
            "cgpa": {"title": "Quick Academic Chapter Summary", "description": "Review summary notes from current semester coursework.", "category": "Academics", "base_min": 20, "priority": "Medium", "adaptive_note": "Achievable goal"},
            "maintenance_coding": {"title": "Solve 1 Easy/Medium Coding Problem", "description": "Maintain problem-solving rhythm.", "category": "Coding", "base_min": 25, "priority": "Low", "adaptive_note": "Achievable goal"},
            "maintenance_system": {"title": "Read Short Tech Concept Article", "description": "15-minute read on basic caching or database indexes.", "category": "Projects", "base_min": 20, "priority": "Low", "adaptive_note": "Achievable goal"},
        }
        target_count = 3  # Keep count to 3 for achievable momentum
    elif adaptive_mode == "Increased Difficulty":
        GOAL_TEMPLATES = {
            "backlogs": {"title": "Intensive Backlog Problem Solving", "description": "Solve previous 3 years examination papers under timed conditions.", "category": "Academics", "base_min": 45, "priority": "High", "adaptive_note": "Increased depth"},
            "coding": {"title": "Solve 4 Algorithmic Problems (Medium/Hard)", "description": "Deep-dive into dynamic programming, graphs, and two-pointer challenges.", "category": "Coding", "base_min": 50, "priority": "High", "adaptive_note": "Increased depth"},
            "aptitude": {"title": "Solve 25 Advanced Aptitude Questions", "description": "Timed sectional practice with rapid shortcut deduction techniques.", "category": "Aptitude", "base_min": 35, "priority": "High", "adaptive_note": "Increased depth"},
            "projects": {"title": "Architect Core Feature & Write Unit Tests", "description": "Develop full-stack feature, write tests, and create PR on GitHub.", "category": "Projects", "base_min": 50, "priority": "Medium", "adaptive_note": "Increased depth"},
            "mock": {"title": "Full Technical & HR Simulation", "description": "Simulate 45-minute end-to-end placement technical and behavioral round.", "category": "Interview Prep", "base_min": 40, "priority": "High", "adaptive_note": "Increased depth"},
            "communication": {"title": "Leadership Pitch & STAR Story Recording", "description": "Record and critically analyze 2 leadership behavioral situational prompts.", "category": "Communication", "base_min": 25, "priority": "Medium", "adaptive_note": "Increased depth"},
            "logic": {"title": "Solve 15 Complex Analytical Puzzles", "description": "Complex seating arrangement, circular tables, and syllogism drills.", "category": "Aptitude", "base_min": 30, "priority": "Medium", "adaptive_note": "Increased depth"},
            "internships": {"title": "Targeted Outreach to 3 Recruiters/Alumni", "description": "Draft tailored cold emails and portfolio links to alumni at target firms.", "category": "Career", "base_min": 30, "priority": "Medium", "adaptive_note": "Increased depth"},
            "cgpa": {"title": "In-Depth Coursework Problem Sets", "description": "Complete challenging numericals and theory proofs from syllabus.", "category": "Academics", "base_min": 35, "priority": "Medium", "adaptive_note": "Increased depth"},
            "maintenance_coding": {"title": "Solve 1 Hard LeetCode Challenge", "description": "Advance competitive algorithmic limits with advanced graph/DP topics.", "category": "Coding", "base_min": 45, "priority": "Low", "adaptive_note": "Increased depth"},
            "maintenance_system": {"title": "System Design Architecture Drill", "description": "Design a scalable URL shortener or rate limiter with architecture diagrams.", "category": "Projects", "base_min": 35, "priority": "Low", "adaptive_note": "Increased depth"},
        }
        target_count = 4 if available_minutes <= 150 else 5
    else:  # Balanced Pace
        GOAL_TEMPLATES = {
            "backlogs": {"title": "Clear Backlog Syllabus Unit", "description": "Revise core high-weightage topics and past exam papers for pending subject.", "category": "Academics", "base_min": 40, "priority": "High", "adaptive_note": "Balanced pace"},
            "coding": {"title": "Solve 3 Coding Problems", "description": "Practice Arrays, Strings, and HashMaps on LeetCode/HackerRank.", "category": "Coding", "base_min": 45, "priority": "High", "adaptive_note": "Balanced pace"},
            "aptitude": {"title": "Solve 20 Aptitude Questions", "description": "Practice quantitative speed math, percentages, and time-and-work shortcuts.", "category": "Aptitude", "base_min": 30, "priority": "High", "adaptive_note": "Balanced pace"},
            "projects": {"title": "Work on Project Feature", "description": "Implement and test a core feature in your capstone/portfolio project.", "category": "Projects", "base_min": 45, "priority": "Medium", "adaptive_note": "Balanced pace"},
            "mock": {"title": "Practice 5 Interview Questions", "description": "Rehearse technical and situational HR responses out loud.", "category": "Interview Prep", "base_min": 30, "priority": "High", "adaptive_note": "Balanced pace"},
            "communication": {"title": "Record 2-Minute Self-Introduction", "description": "Practice spoken articulation, pacing, and professional body language.", "category": "Communication", "base_min": 20, "priority": "Medium", "adaptive_note": "Balanced pace"},
            "logic": {"title": "Solve 10 Logical Puzzles", "description": "Practice seating arrangements, syllogisms, and series patterns.", "category": "Aptitude", "base_min": 25, "priority": "Medium", "adaptive_note": "Balanced pace"},
            "internships": {"title": "Internship Outreach & Applications", "description": "Review resume and submit 2 tailored applications for student roles.", "category": "Career", "base_min": 25, "priority": "Medium", "adaptive_note": "Balanced pace"},
            "cgpa": {"title": "Academic Coursework Review", "description": "Revise semester subject lecture notes and practice assignment questions.", "category": "Academics", "base_min": 30, "priority": "Medium", "adaptive_note": "Balanced pace"},
            "maintenance_coding": {"title": "Solve 1 Hard/Medium LeetCode Problem", "description": "Maintain competitive algorithmic problem solving edge.", "category": "Coding", "base_min": 35, "priority": "Low", "adaptive_note": "Balanced pace"},
            "maintenance_system": {"title": "Read System Design Case Study", "description": "Study modern scalable architectures (microservices, caching, indexing).", "category": "Projects", "base_min": 30, "priority": "Low", "adaptive_note": "Balanced pace"},
        }
        target_count = 3 if available_minutes <= 90 else (4 if available_minutes <= 180 else 5)

    selected_keys = [w[0] for w in weaknesses[:target_count]]
    for fallback in ["maintenance_coding", "projects", "communication", "maintenance_system", "aptitude"]:
        if len(selected_keys) >= target_count:
            break
        if fallback not in selected_keys:
            selected_keys.append(fallback)

    selected_goals = [
        dict(GOAL_TEMPLATES[k], id=f"goal-{i+1}", completed=False)
        for i, k in enumerate(selected_keys)
    ]

    # Proportional scaling to guarantee sum(estimated_minutes) <= available_minutes
    total_base = sum(g["base_min"] for g in selected_goals)
    scale_factor = min(available_minutes / total_base, 1.0)

    for g in selected_goals:
        scaled = max(round((g["base_min"] * scale_factor) / 5) * 5, 10)
        g["estimated_minutes"] = scaled
        del g["base_min"]

    while sum(g["estimated_minutes"] for g in selected_goals) > available_minutes:
        max_goal = max(selected_goals, key=lambda x: x["estimated_minutes"])
        if max_goal["estimated_minutes"] > 10:
            max_goal["estimated_minutes"] -= 5
        else:
            break

    total_allocated = sum(g["estimated_minutes"] for g in selected_goals)
    goal_items = [DailyGoalItem(**g) for g in selected_goals]
    return goal_items, total_allocated, available_minutes, adaptive_mode, adaptive_msg


@app.get("/")
def root():
    return {"message": "Placement Predictor API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        # 1. Take 10 validated user inputs
        user_data = request.model_dump()

        # 2 & 3. Start from a COPY of default values and overwrite with user inputs
        input_data = default_values.copy()
        for k in model.feature_names_in_:
            if k in user_data:
                input_data[k] = user_data[k]

        # 4. Build single-row DataFrame matching model.feature_names_in_ exactly
        df = pd.DataFrame([input_data])[model.feature_names_in_]

        # 5. Predict class and probabilities
        pred = model.predict(df)[0]
        proba = model.predict_proba(df)[0]

        # 6. Map probabilities according to model.classes_
        classes = list(model.classes_)
        placed_idx = classes.index("Placed") if "Placed" in classes else 1
        not_placed_idx = classes.index("Not Placed") if "Not Placed" in classes else 0

        # 7. Round to 2 decimals as percentages
        placement_prob = round(float(proba[placed_idx]) * 100, 2)
        not_placed_prob = round(float(proba[not_placed_idx]) * 100, 2)

        # 8. Run rule-based Skill Gap Analysis
        skill_analysis, top_priorities = run_skill_gap_analysis(user_data)

        # 9. Generate adaptive rule-based daily goals
        goals, total_min, avail_min, adapt_mode, adapt_msg = generate_daily_goals(user_data)

        return {
            "placement_status": str(pred),
            "placement_probability": placement_prob,
            "not_placed_probability": not_placed_prob,
            "skill_gap_analysis": skill_analysis,
            "top_priorities": top_priorities,
            "daily_goals": goals,
            "total_goal_minutes": total_min,
            "available_study_minutes": avail_min,
            "adaptive_mode": adapt_mode,
            "adaptive_recommendation_message": adapt_msg,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resume files (.pdf) are supported.")

    try:
        content_bytes = await file.read()
        if len(content_bytes) == 0:
            raise HTTPException(status_code=400, detail="The uploaded PDF file is empty.")

        pdf_reader = pypdf.PdfReader(io.BytesIO(content_bytes))
        extracted_text = ""
        for page in pdf_reader.pages:
            t = page.extract_text()
            if t:
                extracted_text += t + "\n"

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="Unable to extract text from PDF. Ensure the file contains selectable text rather than scanned images."
            )

        analysis = analyze_resume_text(extracted_text)
        return analysis

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume analysis failed: {str(e)}")

@app.post("/match-job", response_model=JobMatchResponse)
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
@app.post("/career-chat", response_model=CareerChatResponse)
def career_chat(request: CareerChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")
    try:
        return process_career_chat(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Career chat processing failed: {str(e)}")
