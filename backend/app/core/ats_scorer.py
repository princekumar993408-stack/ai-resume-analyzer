"""
ATS Scoring Engine & Formatting Auditor
Aggregates weighted scores, audits section completeness, and compiles recommendations.
Author: Prince Kumar (B.Tech CSE IoT, Jain University)
"""

from typing import Dict, Any, List
from app.config import settings

def audit_formatting_and_sections(
    text: str,
    contact_info: Dict[str, Any],
    sections: Dict[str, str]
) -> Dict[str, Any]:
    """
    Audits the structural integrity and ATS parseability of the resume.
    """
    issues = []
    words = text.split()
    word_count = len(words)

    has_contact = bool(contact_info.get("email") or contact_info.get("phone"))
    has_experience = "experience" in sections
    has_education = "education" in sections
    has_skills = "skills" in sections
    has_summary = "summary" in sections
    has_projects = "projects" in sections

    if not contact_info.get("email"):
        issues.append("Missing or unparseable email address in header.")
    if not contact_info.get("phone"):
        issues.append("Missing contact telephone number.")
    if not contact_info.get("github") and not contact_info.get("linkedin"):
        issues.append("No professional profile link detected (LinkedIn or GitHub).")

    if not has_experience and not has_projects:
        issues.append("Neither 'Experience' nor 'Projects' section heading was explicitly detected.")
    if not has_education:
        issues.append("No 'Education' or 'Academic Background' section heading found.")
    if not has_skills:
        issues.append("No dedicated 'Technical Skills' section heading found.")

    if word_count < 250:
        issues.append(f"Resume text is unusually short ({word_count} words). Recommended range: 450–900 words.")
    elif word_count > 1200:
        issues.append(f"Resume text is lengthy ({word_count} words). Consider condensing to 1–2 pages.")

    # Compute formatting score out of 100
    base_score = 100.0
    deductions = len(issues) * 12.0
    formatting_score = max(20.0, base_score - deductions)

    # Readability heuristic (average sentence length ~ 15-20 words)
    readability = round(min(100.0, max(50.0, 95.0 - (len(issues) * 8.0))), 1)

    return {
        "has_contact": has_contact,
        "has_experience": has_experience,
        "has_education": has_education,
        "has_skills": has_skills,
        "has_summary": has_summary,
        "has_projects": has_projects,
        "word_count": word_count,
        "readability_score": readability,
        "formatting_score": float(formatting_score),
        "issues": issues
    }

def compute_overall_ats_score(
    skill_match_ratio: float,
    semantic_similarity: float,
    impact_score: float,
    formatting_score: float,
    missing_critical: List[str]
) -> Dict[str, Any]:
    """
    Computes weighted final ATS score based on configured weighting parameters.
    """
    # Convert ratios to 0-100 scale
    s_skills = skill_match_ratio * 100.0
    s_semantic = semantic_similarity * 100.0
    s_impact = impact_score
    s_format = formatting_score

    # Weighted calculation
    composite = (
        (s_skills * settings.WEIGHT_SKILL_MATCH) +
        (s_semantic * settings.WEIGHT_SEMANTIC_SIMILARITY) +
        (s_impact * settings.WEIGHT_ACTION_VERBS_IMPACT) +
        (s_format * settings.WEIGHT_SECTION_FORMATTING)
    )

    # Critical skill deficit penalty
    if len(missing_critical) >= 3:
        composite *= 0.92

    final_score = int(round(max(10, min(99, composite))))
    passed = final_score >= settings.ATS_PASS_THRESHOLD

    # Compile actionable recommendations
    recommendations = []
    if missing_critical:
        top_missing = ", ".join(missing_critical[:4])
        recommendations.append(
            f"Add missing critical job keywords: {top_missing}."
        )

    if s_impact < 65.0:
        recommendations.append(
            "Rewrite passive bullet points using the Google XYZ formula: 'Accomplished [X] as measured by [Y % metric], by doing [Z]'."
        )

    if s_semantic < 50.0:
        recommendations.append(
            "Align resume terminology more closely with the specific phrasing and technologies in the Job Description."
        )

    if formatting_score < 75.0:
        recommendations.append(
            "Ensure standard section headings ('Experience', 'Education', 'Technical Skills') are clearly legible to ATS parsers."
        )

    if not recommendations:
        recommendations.append("Resume demonstrates strong semantic alignment and ATS parseability.")

    return {
        "overall_score": final_score,
        "passed_threshold": passed,
        "breakdown": {
            "skill_match": round(s_skills, 1),
            "semantic_similarity": round(s_semantic, 1),
            "impact_strength": round(s_impact, 1),
            "formatting_quality": round(s_format, 1)
        },
        "top_recommendations": recommendations
    }
