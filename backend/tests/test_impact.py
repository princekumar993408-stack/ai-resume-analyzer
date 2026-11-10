"""
Tests for Bullet Point Impact and Action Verb Analyzer
"""

import pytest
from app.core.impact_analyzer import evaluate_bullet_points

SAMPLE_BULLETS = """
• Architected a real-time event-driven microservices architecture handling 50,000 requests per minute with 99.9% uptime.
• Responsible for helping the team with bug fixes and writing code.
• Optimized PostgreSQL query execution plans, reducing p99 response times by 42%.
"""

def test_bullet_point_impact():
    evals, impact_score = evaluate_bullet_points(SAMPLE_BULLETS)
    assert len(evals) == 3

    # First bullet should be strong (Architected + 50,000 + 99.9%)
    b1 = evals[0]
    assert b1["strength"] == "strong"
    assert b1["has_quantification"] is True
    assert b1["action_verb"] == "architected"

    # Second bullet should be weak (Responsible for + no metrics)
    b2 = evals[1]
    assert b2["strength"] == "weak"
    assert "xyz" in b2["suggestion"].lower()

    # Third bullet should be strong (Optimized + 42%)
    b3 = evals[2]
    assert b3["strength"] == "strong"
    assert b3["has_quantification"] is True

    assert impact_score > 50.0
