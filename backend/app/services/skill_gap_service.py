from typing import List, Tuple
from ..models.schemas import SkillGapItem

def run_skill_gap_analysis(data: dict) -> Tuple[List[SkillGapItem], List[str]]:
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
        b_status, b_priority, b_rec = "Strong", "Low", "Clean academic record; zero eligibility roadblocks for all campus drives."
    elif backlogs == 1:
        b_status, b_priority, b_rec = "Moderate", "Medium", "Clear remaining backlog before placement drives begin to avoid company filtering."
    else:
        b_status, b_priority, b_rec = "Needs Improvement", "High", f"Urgent: {backlogs} active backlogs pose high risk of immediate placement disqualification."
    items.append(SkillGapItem(
        skill="Backlogs",
        score_display=f"{backlogs}",
        raw_score=float(backlogs),
        status=b_status,
        priority=b_priority,
        recommendation=b_rec,
        benchmark="0 (Strong), 1 (Moderate), >= 2 (Needs Improvement)"
    ))

    # 10. Study Hours Per Day
    study_hrs = float(data.get("study_hours_per_day", 0.0))
    if study_hrs >= 4.0:
        s_status, s_priority, s_rec = "Strong", "Low", "Dedicated preparation habit; maintain focus without burnout."
    elif study_hrs >= 2.5:
        s_status, s_priority, s_rec = "Moderate", "Medium", "Increase daily study commitment by 1 hour focusing on high-priority weak areas."
    else:
        s_status, s_priority, s_rec = "Needs Improvement", "High", "Increase daily study schedule to at least 3-4 focused hours during placement sprint."
    items.append(SkillGapItem(
        skill="Study Hours",
        score_display=f"{study_hrs:.1f}h/day",
        raw_score=study_hrs,
        status=s_status,
        priority=s_priority,
        recommendation=s_rec,
        benchmark=">= 4.0h (Strong), 2.5-3.9h (Moderate)"
    ))

    # Priority sorting
    priority_order = {"High": 0, "Medium": 1, "Low": 2}
    sorted_items = sorted(items, key=lambda x: priority_order.get(x.priority, 3))
    
    top_priorities = [
        item.skill for item in sorted_items
        if item.status == "Needs Improvement" or item.priority == "High"
    ][:3]

    if not top_priorities:
        top_priorities = [item.skill for item in sorted_items if item.status == "Moderate"][:3]
    if not top_priorities:
        top_priorities = ["Advanced Problem Solving", "Mock Interviews", "System Design"]

    return items, top_priorities
