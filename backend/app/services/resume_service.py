import re
import io
import pypdf
from typing import List, Optional
from ..models.resume_schemas import ResumeAnalysisResponse

COMMON_SKILLS_DICTIONARY = [
    # Languages
    'Python', 'Java', 'C++', 'C#', 'C', 'JavaScript', 'TypeScript', 'Go', 'Golang', 'Rust', 
    'SQL', 'HTML', 'CSS', 'Kotlin', 'Swift', 'R', 'PHP', 'Scala', 'Dart',
    # Frameworks & Libraries
    'React', 'React.js', 'Node.js', 'Express', 'Next.js', 'Vue', 'Angular', 'Django', 'Flask', 
    'FastAPI', 'Spring Boot', 'Spring', 'Tailwind CSS', 'Bootstrap', 'Redux', 'GraphQL',
    # Data & AI/ML
    'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 
    'NumPy', 'OpenCV', 'NLP', 'Computer Vision', 'Matplotlib', 'Seaborn',
    # Cloud & DevOps
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'GitHub', 'Linux', 'Terraform', 'Nginx',
    # Databases
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Firebase', 'Oracle', 'Cassandra',
    # Core Engineering
    'Data Structures', 'Algorithms', 'DSA', 'OOP', 'System Design', 'REST API', 'Microservices'
]


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts clean text content from PDF binary bytes using pypdf"""
    pdf_reader = pypdf.PdfReader(io.BytesIO(file_bytes))
    extracted_text = ""
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            extracted_text += page_text + "\n"
    return extracted_text.strip()


def analyze_resume_text(text: str) -> dict:
    text_clean = text.strip()
    text_lower = text_clean.lower()

    # 1. Detect Skills
    skills_found = []
    for skill in COMMON_SKILLS_DICTIONARY:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            if skill not in skills_found and not any(skill.lower() == s.lower() for s in skills_found):
                skills_found.append(skill)

    # 2. Detect Sections
    sections_checked = {
        'Education': bool(re.search(r'\b(education|academic|b\.?tech|b\.?e|bachelor|degree|cgpa|university|college)\b', text_lower)),
        'Projects': bool(re.search(r'\b(projects?|capstone|portfolio projects?)\b', text_lower)),
        'Internships': bool(re.search(r'\b(internships?|intern|work experience|employment|experience)\b', text_lower)),
        'Certifications': bool(re.search(r'\b(certifications?|certificates?|certified|licenses?)\b', text_lower)),
        'GitHub': bool(re.search(r'\b(github\.com|github|gitlab|bitbucket|portfolio)\b', text_lower)),
        'Achievements': bool(re.search(r'\b(achievements?|awards?|honors?|hackathons?|accomplishments?|extracurricular)\b', text_lower)),
    }

    missing_sections = [sec for sec, found in sections_checked.items() if not found]

    # 3. Detect Project Titles
    projects_found = []
    proj_match = re.search(
        r'(?:PROJECTS?|ACADEMIC PROJECTS?|KEY PROJECTS?)([\s\S]*?)(?:EXPERIENCE|WORK EXPERIENCE|EDUCATION|SKILLS|TECHNICAL SKILLS|ACHIEVEMENTS|CERTIFICATIONS|PUBLICATIONS|EXTRACURRICULAR|$)', 
        text_clean, 
        re.IGNORECASE
    )
    if proj_match:
        lines = proj_match.group(1).split('\n')
        for line in lines:
            line_str = line.strip()
            if not line_str or line_str.startswith(('-', '•', '*', '–', '—')):
                continue
            cleaned = re.sub(r'^(?:\d+[\.\)]|\#)\s*', '', line_str).strip()
            if 3 <= len(cleaned) <= 60 and not cleaned.lower().startswith(('tools', 'tech', 'technologies', 'developed', 'built', 'created', 'worked', 'implemented', 'utilizing')):
                if cleaned and not any(cleaned.lower() in p.lower() for p in projects_found):
                    projects_found.append(cleaned)

    # 4. Transparent Rule-Based Scoring (Out of 100)
    score_breakdown = {}

    # Skills evaluation (max 25 pts)
    if len(skills_found) >= 10:
        skill_score = 25
    elif len(skills_found) >= 6:
        skill_score = 20
    elif len(skills_found) >= 3:
        skill_score = 15
    elif len(skills_found) >= 1:
        skill_score = 8
    else:
        skill_score = 0
    score_breakdown['skills_evaluation'] = f'{skill_score}/25 pts ({len(skills_found)} skills detected)'

    # Projects evaluation (max 20 pts)
    if sections_checked['Projects']:
        proj_score = 20 if len(projects_found) >= 2 else 15
    else:
        proj_score = 0
    score_breakdown['projects_evaluation'] = f'{proj_score}/20 pts ({len(projects_found)} projects detected)'

    # Internships evaluation (max 20 pts)
    exp_score = 20 if sections_checked['Internships'] else 0
    score_breakdown['experience_internships'] = f'{exp_score}/20 pts'

    # Education evaluation (max 15 pts)
    edu_score = 15 if sections_checked['Education'] else 0
    score_breakdown['education_background'] = f'{edu_score}/15 pts'

    # Certifications evaluation (max 10 pts)
    cert_score = 10 if sections_checked['Certifications'] else 0
    score_breakdown['certifications'] = f'{cert_score}/10 pts'

    # GitHub / Portfolio link (max 5 pts)
    git_score = 5 if sections_checked['GitHub'] else 0
    score_breakdown['github_presence'] = f'{git_score}/5 pts'

    # Achievements / Honors (max 5 pts)
    achieve_score = 5 if sections_checked['Achievements'] else 0
    score_breakdown['achievements_honors'] = f'{achieve_score}/5 pts'

    total_score = min(skill_score + proj_score + exp_score + edu_score + cert_score + git_score + achieve_score, 100)

    # 5. Targeted Suggestions
    suggestions = []
    if 'Certifications' in missing_sections:
        suggestions.append('Add a Certifications section featuring verified technical credentials (e.g. AWS Certified, HackerRank, Coursera).')
    if 'GitHub' in missing_sections:
        suggestions.append('Include clickable GitHub and portfolio links directly in your header contact section.')
    if 'Internships' in missing_sections:
        suggestions.append('Add an Experience/Internships section detailing practical roles, freelance work, or open-source projects.')
    if len(skills_found) < 8:
        suggestions.append('Expand your technical stack listing to include modern frameworks, databases, and developer tools.')
    if len(projects_found) < 2:
        suggestions.append('Detail at least 2 distinct technical projects with quantifiable impact metrics (e.g., latency, users, throughput).')
    if 'Achievements' in missing_sections:
        suggestions.append('Add an Achievements section to highlight hackathon standings, competitive programming ranks, or scholarships.')
    if total_score >= 85 and not suggestions:
        suggestions.append('Excellent resume structure! Ensure all bullet points follow the Google XYZ formula: Accomplished [X] measured by [Y] by doing [Z].')

    return {
        'resume_score': total_score,
        'skills_found': skills_found,
        'projects_found': projects_found[:5],
        'missing_sections': missing_sections,
        'suggestions': suggestions,
        'score_breakdown': score_breakdown,
        'disclaimer': 'This score is computed using transparent rule-based heuristics for campus placement readiness and is not an official industry-standard accreditation.'
    }
