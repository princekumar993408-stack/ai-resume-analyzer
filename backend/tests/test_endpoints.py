"""
Integration Tests for FastAPI Endpoints
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

SAMPLE_RESUME = """PRINCE KUMAR
princekumar993408@gmail.com | +91 98765 43210
linkedin.com/in/prince-kumar | github.com/princekumar993408-stack

PROFESSIONAL SUMMARY
Machine learning and backend software engineer with expertise in Python, PyTorch, and FastAPI.

TECHNICAL SKILLS
Python, PyTorch, FastAPI, Docker, PostgreSQL, React, Git

EXPERIENCE
Software Engineer
• Architected scalable RAG vector search API serving 1,000+ queries per hour.
• Reduced model inference latency by 35% through quantization and ONNX runtime.

EDUCATION
B.Tech in Computer Science and Engineering
Jain University, India
"""

SAMPLE_JD = """We are seeking a Machine Learning Engineer proficient in Python, PyTorch, FastAPI, and Docker.
Must have experience building REST APIs, vector search, and relational databases like PostgreSQL."""

def test_health_and_root():
    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "ok"

    res_root = client.get("/")
    assert res_root.status_code == 200
    assert "AI Resume" in res_root.json()["message"]

def test_sample_jobs_and_resume():
    res_jobs = client.get("/api/resume/sample_jobs")
    assert res_jobs.status_code == 200
    assert len(res_jobs.json()) >= 3

    res_res = client.get("/api/resume/sample_resume")
    assert res_res.status_code == 200
    assert "PRINCE KUMAR" in res_res.json()["resume_text"]

def test_analyze_text_endpoint():
    payload = {
        "resume_text": SAMPLE_RESUME,
        "job_description": SAMPLE_JD
    }
    res = client.post("/api/resume/analyze_text", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["overall_score"] >= 65
    assert data["score_breakdown"]["skill_match"] > 50.0
    assert "python" in data["matched_skills"]
    assert "pytorch" in data["matched_skills"]
    assert data["contact_info"]["email"] == "princekumar993408@gmail.com"
    assert len(data["bullet_evaluations"]) >= 2
    assert len(data["top_recommendations"]) > 0

def test_analyze_multipart_file_endpoint():
    files = {
        "file": ("test_resume.txt", SAMPLE_RESUME.encode("utf-8"), "text/plain")
    }
    data = {
        "job_description": SAMPLE_JD
    }
    res = client.post("/api/resume/analyze", files=files, data=data)
    assert res.status_code == 200
    res_data = res.json()
    assert res_data["overall_score"] >= 65
    assert res_data["contact_info"]["name"] == "PRINCE KUMAR"
