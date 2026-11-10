"""
Tests for Resume Text Parsing and Contact Extraction
"""

import pytest
from app.core.parser import (
    extract_contact_info,
    extract_sections,
    extract_skills_from_text
)

SAMPLE_TEXT = """PRINCE KUMAR
Bangalore, India | princekumar993408@gmail.com | +91 98765 43210
https://linkedin.com/in/prince-kumar | https://github.com/princekumar993408-stack

PROFESSIONAL SUMMARY
Experienced software engineer specializing in Python, PyTorch, and React.

TECHNICAL SKILLS
Python, JavaScript, PyTorch, FastAPI, React, Docker, PostgreSQL, MQTT, ESP32

WORK EXPERIENCE
Software Engineer
- Engineered scalable backend microservices using FastAPI and PostgreSQL.
- Optimized vector search pipeline reducing latency by 45%.

EDUCATION
B.Tech in Computer Science and Engineering
Jain University, India
"""

def test_contact_info_extraction():
    contacts = extract_contact_info(SAMPLE_TEXT)
    assert contacts["email"] == "princekumar993408@gmail.com"
    assert "98765" in contacts["phone"]
    assert "prince-kumar" in contacts["linkedin"]
    assert "princekumar993408-stack" in contacts["github"]
    assert contacts["name"] == "PRINCE KUMAR"

def test_section_extraction():
    sections = extract_sections(SAMPLE_TEXT)
    assert "summary" in sections
    assert "skills" in sections
    assert "experience" in sections
    assert "education" in sections

def test_skills_extraction():
    skills = extract_skills_from_text(SAMPLE_TEXT)
    assert "python" in skills
    assert "pytorch" in skills
    assert "fastapi" in skills
    assert "react" in skills
    assert "docker" in skills
    assert "esp32" in skills
    assert skills["python"] == "programming_languages"
    assert skills["pytorch"] == "ai_ml_data_science"
