import os
import json
import re
import urllib.request
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class CareerChatRequest(BaseModel):
    message: str = Field(..., description="User message or query")
    student_context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Student profile and prediction context")

class CareerChatResponse(BaseModel):
    reply: str
    is_llm_generated: bool = False
    disclaimer: str = "AI-generated career advice provided for guidance. Placement probability is computed separately by the trained machine learning model."

def generate_llm_reply(message: str, context: dict, api_key: str) -> Optional[str]:
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        system_prompt = (
            "You are an expert AI Campus Placement Career Coach. Provide encouraging, concise, actionable advice.\n"
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
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            candidates = data.get("candidates", [])
            if candidates and "content" in candidates[0]:
                parts = candidates[0]["content"].get("parts", [])
                if parts and "text" in parts[0]:
                    return parts[0]["text"].strip()
    except Exception as e:
        print("LLM API call failed, falling back to rule engine:", e)
    return None

def generate_contextual_assistant_reply(message: str, context: dict) -> str:
    msg_lower = message.lower()
    prob = float(context.get("placement_probability", 65.0))
    status = str(context.get("placement_status", "Placed"))
    gaps = context.get("skill_gaps", ["Coding Skill", "Aptitude"])
    hours = float(context.get("study_hours", 3.5))
    completed = int(context.get("completed_goals", 2))
    pending = int(context.get("pending_goals", 2))
    resume_score = int(context.get("resume_score", 75))
    roles = context.get("recommended_roles", ["Software Engineer", "Backend Developer", "Data Analyst"])

    gap_text = ", ".join(gaps) if gaps else "Coding and Aptitude"
    roles_text = ", ".join(roles[:3]) if roles else "Software Engineer, Full-Stack Developer"

    if any(k in msg_lower for k in ["study today", "what to study", "today schedule", "study plan today"]):
        first_gap = gaps[0] if gaps else "Arrays/Strings"
        return f"Based on your {hours} hrs/day study budget and current placement probability of {prob:.1f}%, here is your study plan for today:\n\n1. 💻 **Coding Focus (45 mins)**: Practice core problem-solving targeting {first_gap} (solve 2 LeetCode problems).\n2. 📊 **Aptitude Practice (30 mins)**: Solve 15 quantitative speed math questions with immediate review.\n3. 🎯 **Today's Goals**: You have {pending} pending goals. Completing them will maintain your daily habit streak!\n\n*Tip: Keep your daily study session within your {hours} hours budget to avoid fatigue.*"

    elif any(k in msg_lower for k in ["why low", "low probability", "probability low", "placement chance", "why is my"]):
        return f"Your current ML placement prediction stands at **{prob:.1f}% ({status})**. Key profile factors influencing this evaluation:\n\n1. **Identified Skill Bottlenecks**: Your {gap_text} scores are currently below target benchmarks.\n2. **Experience & Portfolio**: Elevating internship count and deployable capstone projects directly raises profile score.\n3. **Academic Standing**: Clearing any active backlogs is critical as tier-1 campus drives enforce zero backlogs.\n\nFocus on elevating your weakest skills past 80/100 to boost model forecast metrics!"

    elif any(k in msg_lower for k in ["coding", "code", "dsa", "leetcode", "programming"]):
        return "To systematically raise your coding assessment performance:\n\n1. **Daily Problem Routine**: Solve 2-3 structured LeetCode/HackerRank problems daily starting with Arrays, Strings, and HashMaps.\n2. **Core Patterns**: Master Sliding Window, Two Pointers, Fast/Slow Pointers, and BFS/DFS.\n3. **Timed Drills**: Take 45-minute timed coding drills to simulate campus placement technical rounds.\n4. **Complexity Optimization**: Ensure your code achieves optimal Time & Space Complexity."

    elif any(k in msg_lower for k in ["7-day", "7 day", "weekly plan", "schedule"]):
        return f"Here is your customized **7-Day Campus Placement Sprint** tailored for your {hours} hrs/day schedule:\n\n• **Mon - Tue (DSA Foundations)**: Arrays, Strings, HashMaps + 2 coding problems daily.\n• **Wed (Quantitative Aptitude)**: Speed math, percentages, time-and-work shortcuts + 15 practice questions.\n• **Thu (Projects & Architecture)**: Develop 1 project feature and update GitHub README documentation.\n• **Fri (Interview Communication)**: Rehearse 5 behavioral HR questions using the STAR technique.\n• **Sat (Advanced DSA & DP)**: Trees, Graphs, or Dynamic Programming problem sets.\n• **Sun (Mock Test & Review)**: Take 1 timed mock assessment and review weekly completion metrics."

    elif any(k in msg_lower for k in ["resume", "cv"]):
        return f"Your current Resume Placement Score is **{resume_score}/100**. Recommendations to elevate your resume:\n\n1. **Action Verbs**: Start bullet points with strong action verbs (*Engineered, Developed, Optimized, Architected*).\n2. **Quantifiable Metrics**: Follow the Google XYZ formula: *Accomplished [X] measured by [Y] by doing [Z]* (e.g. 'Reduced API latency by 35%').\n3. **Clickable Links**: Place clickable GitHub, LinkedIn, and live project demo links directly in your header.\n4. **Technical Skills Section**: Organize skills clearly under Languages, Frameworks, Cloud, and Developer Tools."

    elif any(k in msg_lower for k in ["role", "which role", "career path", "best role", "best for me"]):
        return f"Based on your current skill evaluations, top matched career paths for your profile:\n\n1. **Software Development Engineer (SDE / Backend)**: Matches strong Python/Java problem solving ({roles_text}).\n2. **Full-Stack Web Developer**: Capitalizes on React, REST API, and database capstone projects.\n3. **Data Analyst / ML Specialist**: Great fit if quantitative aptitude and Python data libraries (Pandas/Scikit-Learn) are strong.\n\nTailor your resume bullet points and project descriptions toward your primary target role."

    elif any(k in msg_lower for k in ["weakness", "weaknesses", "analyze my", "gap", "prepare me"]):
        return f"Here is an analysis of your current profile bottlenecks and interview readiness:\n\n• **Primary Skill Gaps**: {gap_text}.\n• **Daily Habit Pace**: {completed} completed, {pending} pending goals today.\n• **Placement Probability**: {prob:.1f}% ({status}).\n\nRecommended Next Step: Rehearse STAR behavioral prompts and complete today's daily goals!"

    else:
        return f"Hello! I am your **AI Career Assistant**.\n\nCurrent Profile Snapshot:\n• **Placement Forecast**: {prob:.1f}% ({status})\n• **Target Skill Gaps**: {gap_text}\n• **Daily Study Budget**: {hours} hrs/day\n\nHow can I help you today? You can ask me:\n- \"What should I study today?\"\n- \"Why is my placement probability low?\"\n- \"How can I improve my coding?\"\n- \"Give me a 7-day study plan\"\n- \"How can I improve my resume?\""

def process_career_chat(request: CareerChatRequest) -> CareerChatResponse:
    message = request.message
    context = request.student_context or {}
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("OPENAI_API_KEY")
    if api_key:
        llm_reply = generate_llm_reply(message, context, api_key)
        if llm_reply:
            return CareerChatResponse(reply=llm_reply, is_llm_generated=True)
    reply = generate_contextual_assistant_reply(message, context)
    return CareerChatResponse(reply=reply, is_llm_generated=False)