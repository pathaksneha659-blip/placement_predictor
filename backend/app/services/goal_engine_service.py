import uuid
from typing import List, Tuple
from ..models.schemas import DailyGoalItem

def generate_daily_goals_backend(
    data: dict, 
    top_priorities: List[str], 
    recent_completion_rate: float = None,
    improved_skill: str = None,
    improved_pct: float = None
) -> Tuple[List[DailyGoalItem], int, int, str, str]:
    """Generates personalized, budget-constrained daily tasks with adaptive difficulty scaling."""
    study_hours = float(data.get("study_hours_per_day", 3.5))
    total_budget_minutes = max(int(study_hours * 60), 60)

    # 1. Determine Adaptive Mode
    adaptive_mode = "Balanced Pace"
    adaptive_message = "Consistent habit pace. Maintaining steady daily preparation workload."

    if recent_completion_rate is not None:
        if recent_completion_rate >= 85.0:
            adaptive_mode = "Increased Difficulty"
            adaptive_message = f"High completion rate ({recent_completion_rate:.0f}%). Elevating challenge with advanced problem sets."
        elif recent_completion_rate < 50.0:
            adaptive_mode = "Reduced Workload"
            adaptive_message = f"Recent completion rate at {recent_completion_rate:.0f}%. Adjusting daily tasks to prevent burnout."
    elif improved_skill and improved_pct and improved_pct >= 5.0:
        adaptive_mode = "Skill Milestone"
        adaptive_message = f"Noticeable growth in {improved_skill} (+{improved_pct:.1f}%). Shifting focus to next bottleneck competency."

    # 2. Candidate Goal Pools
    goals_pool = []

    # Coding Goals
    coding_score = float(data.get("coding_skill_score", 70.0))
    if coding_score < 60.0:
        goals_pool.append({
            "title": "Master Core DSA: Arrays & HashMaps",
            "desc": "Solve 2 LeetCode Easy/Medium problems focused on Two Pointers and Frequency Maps.",
            "category": "Coding",
            "est": 45 if adaptive_mode != "Reduced Workload" else 30,
            "priority": "High" if "Coding Skill" in top_priorities else "Medium",
            "adaptive_note": "Core Foundation"
        })
    elif coding_score < 80.0:
        goals_pool.append({
            "title": "Medium DSA Sprint: Trees & Graphs",
            "desc": "Implement Tree Traversals (BFS/DFS) and solve 2 medium problems on LeetCode.",
            "category": "Coding",
            "est": 50 if adaptive_mode != "Increased Difficulty" else 65,
            "priority": "High" if "Coding Skill" in top_priorities else "Medium",
            "adaptive_note": "Advanced Practice" if adaptive_mode == "Increased Difficulty" else None
        })
    else:
        goals_pool.append({
            "title": "System Design & Hard DSA Drill",
            "desc": "Review 1 System Design architectural pattern and solve 1 LeetCode Hard DP problem.",
            "category": "Coding",
            "est": 60,
            "priority": "Medium",
            "adaptive_note": "Expert Drill"
        })

    # Aptitude Goals
    apt_score = float(data.get("aptitude_score", 65.0))
    if apt_score < 70.0:
        goals_pool.append({
            "title": "Quantitative Speed Math Sprint",
            "desc": "Solve 15 timed questions on Time & Work, Percentages, and Probability.",
            "category": "Aptitude",
            "est": 30 if adaptive_mode != "Reduced Workload" else 20,
            "priority": "High" if "Aptitude" in top_priorities else "Medium",
            "adaptive_note": "Speed Focus"
        })
    else:
        goals_pool.append({
            "title": "Timed Mock Aptitude Sectional",
            "desc": "Complete 1 full 25-question timed aptitude assessment and analyze incorrect answers.",
            "category": "Aptitude",
            "est": 35,
            "priority": "Low",
            "adaptive_note": None
        })

    # Communication & Interview Goals
    mock_score = float(data.get("mock_interview_score", 70.0))
    comm_score = float(data.get("communication_skill_score", 68.0))
    if mock_score < 65.0 or comm_score < 65.0:
        goals_pool.append({
            "title": "Behavioral STAR-Method Rehearsal",
            "desc": "Draft and rehearse 3 behavioral interview answers (Conflict, Leadership, Challenge).",
            "category": "Interview Prep",
            "est": 25,
            "priority": "High" if ("Mock Interview" in top_priorities or "Communication" in top_priorities) else "Medium",
            "adaptive_note": "Articulation Boost"
        })
    else:
        goals_pool.append({
            "title": "Peer Technical Mock Interview",
            "desc": "Conduct a 30-minute peer coding mock interview with live verbal articulation.",
            "category": "Interview Prep",
            "est": 35,
            "priority": "Medium",
            "adaptive_note": None
        })

    # Project / Practical Goals
    proj_count = int(data.get("projects_count", 3))
    if proj_count < 3:
        goals_pool.append({
            "title": "Capstone Project Implementation",
            "desc": "Build and commit 1 core backend API endpoint or UI feature with comprehensive docs.",
            "category": "Projects",
            "est": 45,
            "priority": "High" if "Projects" in top_priorities else "Medium",
            "adaptive_note": "Portfolio Growth"
        })

    # Logical Reasoning Goals
    logic_score = float(data.get("logical_reasoning_score", 66.0))
    if logic_score < 70.0 and "Logical Reasoning" in top_priorities:
        goals_pool.append({
            "title": "Logical Deductions & Puzzle Drill",
            "desc": "Solve 10 analytical puzzle sets including Seating Arrangements and Syllogisms.",
            "category": "Aptitude",
            "est": 25,
            "priority": "High",
            "adaptive_note": "Logic Focus"
        })

    # 3. Budget Fitting
    selected_goals = []
    used_minutes = 0

    priority_map = {"High": 0, "Medium": 1, "Low": 2}
    sorted_pool = sorted(goals_pool, key=lambda g: priority_map.get(g["priority"], 3))

    for g in sorted_pool:
        if used_minutes + g["est"] <= total_budget_minutes:
            selected_goals.append(DailyGoalItem(
                id=f"goal-{str(uuid.uuid4())[:8]}",
                title=g["title"],
                description=g["desc"],
                category=g["category"],
                estimated_minutes=g["est"],
                priority=g["priority"],
                completed=False,
                adaptive_note=g["adaptive_note"]
            ))
            used_minutes += g["est"]

    # Ensure at least 2 goals
    if len(selected_goals) < 2 and sorted_pool:
        for g in sorted_pool:
            if not any(sg.title == g["title"] for sg in selected_goals):
                selected_goals.append(DailyGoalItem(
                    id=f"goal-{str(uuid.uuid4())[:8]}",
                    title=g["title"],
                    description=g["desc"],
                    category=g["category"],
                    estimated_minutes=g["est"],
                    priority=g["priority"],
                    completed=False,
                    adaptive_note=g["adaptive_note"]
                ))
                used_minutes += g["est"]
                break

    return selected_goals, used_minutes, total_budget_minutes, adaptive_mode, adaptive_message
