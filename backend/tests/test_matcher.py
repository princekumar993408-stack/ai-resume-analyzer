"""
Tests for Semantic Matching & Skill Gap Analysis
"""

import pytest
from app.core.matcher import (
    calculate_semantic_similarity,
    analyze_skill_gaps
)

def test_semantic_similarity():
    text_a = "Senior Python engineer building PyTorch deep learning models and FastAPI microservices."
    text_b = "We are hiring a Python developer with PyTorch machine learning and FastAPI experience."
    text_unrelated = "Pastry chef baking artisanal sourdough bread and chocolate croissants."

    sim_high = calculate_semantic_similarity(text_a, text_b)
    sim_low = calculate_semantic_similarity(text_a, text_unrelated)

    assert sim_high > 0.25
    assert sim_low < 0.05
    assert sim_high > sim_low * 5
    assert calculate_semantic_similarity("", text_b) == 0.0

def test_skill_gap_analysis():
    resume_skills = {
        "python": "programming_languages",
        "pytorch": "ai_ml_data_science",
        "fastapi": "web_and_backend",
        "git": "software_engineering_tools"
    }
    jd_skills = {
        "python": "programming_languages",
        "pytorch": "ai_ml_data_science",
        "kubernetes": "cloud_and_devops",  # Missing critical
        "leadership": "soft_skills"         # Missing recommended
    }

    gaps = analyze_skill_gaps(resume_skills, jd_skills)
    assert "python" in gaps["matched_skills"]
    assert "pytorch" in gaps["matched_skills"]
    assert "kubernetes" in gaps["missing_critical_skills"]
    assert "leadership" in gaps["missing_recommended_skills"]
    assert gaps["match_ratio"] == 0.5
