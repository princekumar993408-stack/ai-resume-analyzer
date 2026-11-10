"""
Resume Document & Text Parser
Extracts contact details, section headings, and skills from raw text and PDFs.
Author: Prince Kumar (B.Tech CSE IoT, Jain University)
"""

import re
import io
import json
import os
from typing import Dict, Any, List, Optional
from pypdf import PdfReader

TAXONOMY_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "skills_taxonomy.json")

def load_skills_taxonomy() -> Dict[str, List[str]]:
    if os.path.exists(TAXONOMY_PATH):
        with open(TAXONOMY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

SKILLS_TAXONOMY = load_skills_taxonomy()

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extracts raw text from a PDF document in bytes."""
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        extracted = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted.append(text)
        return "\n".join(extracted)
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return ""

def extract_contact_info(text: str) -> Dict[str, Optional[str]]:
    """Extracts email, phone number, LinkedIn, and GitHub links."""
    contacts: Dict[str, Optional[str]] = {
        "name": None,
        "email": None,
        "phone": None,
        "linkedin": None,
        "github": None,
        "website": None
    }

    # 1. Email
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    if email_match:
        contacts["email"] = email_match.group(0)

    # 2. Phone (Supports international 10-digit, 5+5 Indian, and US 3+4 formats)
    phone_match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?(?:\d{5}[-.\s]?\d{5}|\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})", text)
    if phone_match:
        contacts["phone"] = phone_match.group(0).strip()

    # 3. LinkedIn
    linkedin_match = re.search(r"(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+", text, re.IGNORECASE)
    if linkedin_match:
        contacts["linkedin"] = linkedin_match.group(0)

    # 4. GitHub
    github_match = re.search(r"(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+", text, re.IGNORECASE)
    if github_match:
        contacts["github"] = github_match.group(0)

    # 5. Name Heuristic (usually first non-empty line with 2-4 words, capitalized)
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    for line in lines[:5]:
        # Filter out lines that look like emails, urls, or headers
        if not re.search(r"(@|http|www|resume|curriculum|page|\+)", line, re.IGNORECASE):
            words = line.split()
            if 2 <= len(words) <= 4 and all(w[0].isupper() for w in words if w.isalpha()):
                contacts["name"] = line
                break

    return contacts

def extract_sections(text: str) -> Dict[str, str]:
    """Segment resume text into major functional sections."""
    section_patterns = {
        "summary": r"(?:professional\s+summary|career\s+profile|executive\s+summary|about\s+me|profile|objective)",
        "experience": r"(?:work\s+experience|professional\s+experience|employment\s+history|experience)",
        "education": r"(?:education|academic\s+background|academic\s+qualifications|university)",
        "skills": r"(?:technical\s+skills|core\s+competencies|technologies|skills\s+and\s+tools|skills)",
        "projects": r"(?:projects|key\s+projects|academic\s+projects|personal\s+projects)",
        "certifications": r"(?:certifications|licenses|credentials|awards)"
    }

    # Normalize newlines
    lines = text.splitlines()
    found_sections: Dict[str, List[str]] = {k: [] for k in section_patterns.keys()}
    current_section = "summary"

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        matched_section = None
        for sec_name, pattern in section_patterns.items():
            if re.match(rf"^{pattern}\b", stripped, re.IGNORECASE) and len(stripped) < 40:
                matched_section = sec_name
                break

        if matched_section:
            current_section = matched_section
        else:
            found_sections[current_section].append(stripped)

    return {k: "\n".join(v) for k, v in found_sections.items() if v}

def extract_skills_from_text(text: str) -> Dict[str, str]:
    """
    Scans text against the comprehensive skills taxonomy.
    Returns mapping of {skill: category}.
    """
    text_lower = " " + re.sub(r"[^\w\s\+\#\./-]", " ", text.lower()) + " "
    found_skills = {}

    for category, skill_list in SKILLS_TAXONOMY.items():
        for skill in skill_list:
            # Word boundary matching with escape for special characters (+, #, etc.)
            pattern = rf"(?:\b|\s){re.escape(skill)}(?:\b|\s)"
            if re.search(pattern, text_lower):
                found_skills[skill] = category

    return found_skills
