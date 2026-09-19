import json
import urllib.request
from typing import Optional, Dict, Any
from ..config import GEMINI_API_KEY

def generate_llm_reply(message: str, context: dict, api_key: str) -> Optional[str]:
    models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"]
    for model_name in models:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
            system_prompt = (
                "You are an expert AI Campus Placement Career Coach. Provide encouraging, concise, actionable advice tailored to the student's metrics.\n"
                + f"Student Context:\n{json.dumps(context, indent=2)}\n\n"
                + "User Message: " + message
            )
            payload = {"contents": [{"parts": [{"text": system_prompt}]}]}
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()
        except Exception as e:
            continue
    return None

def generate_contextual_assistant_reply(message: str, context: Optional[dict] = None) -> str:
    ctx = context or {}
    msg_lower = message.lower()
    prob = float(ctx.get("placement_probability", 65.0))
    status = str(ctx.get("placement_status", "Placed"))
    gaps = ctx.get("skill_gaps", ["Coding Skill", "Aptitude"])
    hours = float(ctx.get("study_hours", 3.5))
    pending = int(ctx.get("pending_goals", 2))
    roles = ctx.get("recommended_roles", ["Software Engineer", "Backend Developer", "Data Analyst"])

    gap_text = ", ".join(gaps) if gaps else "Coding and Aptitude"
    roles_text = ", ".join(roles[:3]) if roles else "Software Engineer, Full-Stack Developer"

    # 1. Study Plan / Schedule
    if any(k in msg_lower for k in ["study plan", "create my study plan", "study today", "what to study", "today schedule", "schedule", "routine", "plan"]):
        first_gap = gaps[0] if gaps else "Arrays & Algorithms"
        second_gap = gaps[1] if len(gaps) > 1 else "Quantitative Aptitude"
        return (
            f"📅 **Personalized Study Plan (Allocated: {hours} hrs/day)**\n\n"
            f"With your current placement forecast of **{prob:.1f}% ({status})**, here is your optimized daily study breakdown:\n\n"
            f"1. 💻 **Priority Skill Drill (45–60 mins)**:\n"
            f"   • Focus Area: **{first_gap}**\n"
            f"   • Action: Solve 2 pattern-based problems (e.g., Sliding Window, Dynamic Programming).\n\n"
            f"2. 📊 **Assessment Practice (30–45 mins)**:\n"
            f"   • Focus Area: **{second_gap}**\n"
            f"   • Action: Timed 15-question speed quiz with review.\n\n"
            f"3. 🎯 **Project & System Design (30 mins)**:\n"
            f"   • Review REST API design, database schemas, or Git commits on your main portfolio project.\n\n"
            f"4. ✅ **Daily Goals**: You have {pending} pending daily milestones. Completing them maintains your streak!"
        )

    # 2. Weakness / Gaps
    elif any(k in msg_lower for k in ["weakness", "weaknesses", "gap", "gaps", "bottleneck", "why low", "placement chance"]):
        return (
            f"💡 **Candidate Profile & Gap Diagnostics**\n\n"
            f"• **Placement Probability**: {prob:.1f}% ({status})\n"
            f"• **Identified Target Bottlenecks**: **{gap_text}**\n\n"
            f"**Actionable Improvements to Boost Readiness:**\n"
            f"1. **Target Benchmarks**: Raise all test scores in *{gap_text}* above 80/100 to maximize shortlisting chances.\n"
            f"2. **Portfolio Impact**: Add at least 1 deployed full-stack project with live URL and clean GitHub README.\n"
            f"3. **Academics**: Maintain zero active backlogs as top campus recruiters enforce strict backlog criteria."
        )

    # 3. Coding Improvement
    elif any(k in msg_lower for k in ["coding", "code", "dsa", "leetcode", "programming", "algorithms"]):
        return (
            "💻 **Roadmap to Elevate Your Coding Score**:\n\n"
            "1. **Core Problem Patterns**: Master Two Pointers, Sliding Window, Fast & Slow Pointers, BFS/DFS, and Top K Elements.\n"
            "2. **Structured Daily Cadence**: Solve 2 curated LeetCode/HackerRank questions daily in your primary language (Python/Java/C++).\n"
            "3. **Timed Mock Drills**: Practice 45-minute timed challenges to simulate actual online campus assessment platforms (AMCAT, HackerEarth, CoCubes).\n"
            "4. **Optimal Complexity**: Always analyze and explain the Time $O(N)$ and Space $O(1)$ complexity."
        )

    # 4. Resume Optimization
    elif any(k in msg_lower for k in ["resume", "cv", "improve my resume"]):
        return (
            "📄 **Campus Placement Resume Optimization Guide**:\n\n"
            "1. **Google XYZ Formula**: Write bullet points like: *'Engineered [X] feature, resulting in [Y]% performance boost, using [Z] technology.'*\n"
            "2. **Key Sections**: Ensure you have *Technical Skills (Languages, Frameworks, Databases, Tools)*, *Projects*, *Internships/Experience*, *Education*, and *Certifications*.\n"
            "3. **Proof of Work**: Place clickable links to your GitHub profile and live deployed web demos directly in the header.\n"
            "4. **ATS Friendly**: Use clean single-column formatting without heavy tables or unreadable graphic elements."
        )

    # 5. Interview Preparation
    elif any(k in msg_lower for k in ["interview", "interviews", "prepare me for interviews", "mock", "hr round", "behavioral"]):
        return (
            "🎯 **Campus Placement Interview Strategy**:\n\n"
            "1. **STAR Method for HR/Behavioral**: Structure situational answers with *Situation, Task, Action, and Result*.\n"
            "2. **Think Out Loud**: In technical rounds, walk the interviewer through your thought process before coding.\n"
            "3. **Core CS Fundamentals**: Revise DBMS (Indexing, Normalization, SQL Joins), OS (Paging, Deadlocks, Threads), and OOP principles.\n"
            "4. **Project Deep-Dive**: Be prepared to explain architecture choices, database queries, and debugging challenges from your projects."
        )

    # 6. Best Role Recommendation
    elif any(k in msg_lower for k in ["role", "career", "which role", "best role", "job role", "best for me"]):
        return (
            f"🌟 **Top Career Role Matches for Your Profile**:\n\n"
            f"Based on your current skill evaluations:\n\n"
            f"• **1. {roles_text.split(',')[0]}**: Strong alignment with problem-solving and algorithms.\n"
            f"• **2. Full-Stack / Backend Engineer**: High demand in campus drives for React, FastAPI, and SQL skills.\n"
            f"• **3. Data / ML Engineer**: Strong match if quantitative aptitude and Python libraries are preferred.\n\n"
            f"**Recommendation**: Tailor your resume project descriptions to highlight skills relevant to your target role."
        )

    # 7. Default Context-Aware Response
    else:
        return (
            f"Hello! I am your **AI Career Coach**.\n\n"
            f"**Your Profile Snapshot**:\n"
            f"• Placement Probability: **{prob:.1f}% ({status})**\n"
            f"• Key Target Areas: **{gap_text}**\n"
            f"• Daily Study Budget: **{hours} hrs/day**\n\n"
            f"How can I assist your placement preparation? Try asking:\n"
            f"• *\"Create my study plan\"*\n"
            f"• *\"Analyze my weaknesses\"*\n"
            f"• *\"How can I improve my coding?\"*\n"
            f"• *\"Improve my resume\"*\n"
            f"• *\"Prepare me for interviews\"*"
        )

def process_career_chat(message: str, student_context: Optional[dict] = None) -> dict:
    ctx = student_context or {}
    if GEMINI_API_KEY and GEMINI_API_KEY.strip():
        llm_reply = generate_llm_reply(message, ctx, GEMINI_API_KEY.strip())
        if llm_reply:
            return {"reply": llm_reply, "is_llm_generated": True}

    rule_reply = generate_contextual_assistant_reply(message, ctx)
    return {"reply": rule_reply, "is_llm_generated": False}
