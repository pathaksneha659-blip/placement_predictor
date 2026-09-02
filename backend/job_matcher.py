import re
from typing import List, Optional
from pydantic import BaseModel, Field
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

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

COMMON_SKILLS_DICTIONARY = [
    # Languages
    "Python", "Java", "C++", "C#", "C", "JavaScript", "TypeScript", "Go", "Golang", "Rust", 
    "SQL", "HTML", "CSS", "Kotlin", "Swift", "R", "PHP", "Scala", "Dart",
    # Frameworks & Web
    "React", "React.js", "Node.js", "Express", "Next.js", "Vue", "Angular", "Django", "Flask", 
    "FastAPI", "Spring Boot", "Spring", "Tailwind CSS", "Bootstrap", "Redux", "GraphQL",
    # Data & AI/ML
    "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Scikit-Learn", "Pandas", 
    "NumPy", "OpenCV", "NLP", "Computer Vision", "Matplotlib", "Seaborn",
    # Cloud & DevOps
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Git", "GitHub", "Linux", "Terraform", "Nginx",
    # Databases
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase", "Oracle", "Cassandra",
    # Engineering Fundamentals
    "Data Structures", "Algorithms", "DSA", "OOP", "System Design", "REST API", "Microservices", "Unit Testing"
]

def analyze_job_match(job_desc: str, profile_text: Optional[str] = None, user_skills: Optional[List[str]] = None) -> dict:
    jd_clean = job_desc.strip()
    jd_lower = jd_clean.lower()

    if not profile_text or len(profile_text.strip()) < 10:
        profile_text = """
        Skills: Python, Java, JavaScript, React, Node.js, SQL, Data Structures, Algorithms, Git, Linux, REST API.
        Academic: Computer Science Engineering (CGPA 7.5).
        Experience: Projects and Web Application Development.
        """
        if user_skills:
            profile_text += " Additional Skills: " + ", ".join(user_skills)

    prof_lower = profile_text.lower()

    # 1. Extract Required Skills from Job Description
    jd_skills = []
    for skill in COMMON_SKILLS_DICTIONARY:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, jd_lower):
            if skill not in jd_skills and not any(skill.lower() == s.lower() for s in jd_skills):
                jd_skills.append(skill)

    # 2. Extract Candidate Skills
    cand_skills = list(user_skills) if user_skills else []
    for skill in COMMON_SKILLS_DICTIONARY:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, prof_lower):
            if skill not in cand_skills and not any(skill.lower() == s.lower() for s in cand_skills):
                cand_skills.append(skill)

    # 3. Categorize Matched & Missing Skills
    matched_skills = [s for s in jd_skills if any(s.lower() == cs.lower() for cs in cand_skills)]
    missing_skills = [s for s in jd_skills if not any(s.lower() == cs.lower() for cs in cand_skills)]

    # 4. TF-IDF + Cosine Similarity
    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform([jd_clean, profile_text])
        cos_sim = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
    except Exception:
        cos_sim = 0.50

    # Skill coverage ratio
    skill_coverage = (len(matched_skills) / len(jd_skills)) if jd_skills else cos_sim

    # Weighted match percentage
    raw_score = (skill_coverage * 0.70 + cos_sim * 0.30) * 100
    match_score = min(max(round(raw_score), 15), 98)

    # 5. Generate Recommended Actions
    actions = []
    for skill in missing_skills:
        if skill.lower() in ["docker", "kubernetes"]:
            actions.append(f"Learn {skill} containerization fundamentals")
        elif skill.lower() in ["aws", "azure", "gcp"]:
            actions.append(f"Practice {skill} cloud deployment fundamentals")
        elif skill.lower() in ["fastapi", "django", "flask", "react", "node.js", "next.js"]:
            actions.append(f"Build one {skill} capstone project")
        else:
            actions.append(f"Learn {skill}")
        
        if len(actions) >= 3:
            break

    if not actions:
        actions = [
            "Review role-specific system design architecture",
            "Prepare structured STAR-method interview responses",
            "Tailor resume bullet points to emphasize matching keywords"
        ]

    return {
        "job_match_score": match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommended_actions": actions[:4],
        "disclaimer": "This match score is computed using TF-IDF text vectorization and cosine similarity heuristics. It does not guarantee interview selection or job placement."
    }
