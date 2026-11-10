"""
API Endpoints for Resume Analysis, ATS Scoring, and Sample Data
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List, Optional
from app.models.schemas import (
    ATSAnalysisResult,
    AnalyzeTextRequest,
    SampleJob,
    ScoreBreakdown,
    ContactInfo,
    FormattingAudit,
    BulletPointEvaluation,
    MatchedSkillItem
)
from app.core.parser import (
    extract_text_from_pdf,
    extract_contact_info,
    extract_sections,
    extract_skills_from_text
)
from app.core.matcher import (
    calculate_semantic_similarity,
    analyze_skill_gaps
)
from app.core.impact_analyzer import evaluate_bullet_points
from app.core.ats_scorer import audit_formatting_and_sections, compute_overall_ats_score

router = APIRouter(prefix="", tags=["Resume Analysis"])

SAMPLE_JOBS = [
    SampleJob(
        id="job-ai-ml-01",
        title="Machine Learning & AI Systems Engineer",
        department="Artificial Intelligence & Data Platforms",
        description="""We are seeking a Machine Learning Engineer to architect and deploy production AI pipelines and intelligent systems.
Responsibilities:
- Design, train, and fine-tune deep learning models using PyTorch and Scikit-Learn.
- Build high-throughput REST APIs and microservices using FastAPI and Docker.
- Develop Retrieval-Augmented Generation (RAG) pipelines, vector search embeddings, and LangChain agents.
- Implement computer vision or NLP algorithms for multi-modal inference and real-time processing.
- Maintain CI/CD pipelines, containerized deployments, and automated testing suites with Pytest.

Requirements:
- Strong proficiency in Python, C++, NumPy, Pandas, and PyTorch.
- Experience with FastAPI, PostgreSQL, Redis, and Git.
- Familiarity with cloud platforms (AWS or GCP), Docker, and Linux environments.
- Excellent analytical problem-solving and communication skills."""
    ),
    SampleJob(
        id="job-fullstack-02",
        title="Full Stack Software Engineer",
        department="Web & Cloud Engineering",
        description="""Looking for a skilled Full Stack Engineer to build responsive, high-performance web applications.
Responsibilities:
- Develop modern, accessible frontend web interfaces using React, TypeScript, and Tailwind CSS.
- Build robust backend microservices, REST APIs, and database schemas using Node.js, Express, or FastAPI.
- Optimize relational database queries with PostgreSQL and utilize Redis for high-speed caching.
- Write unit, integration, and end-to-end tests ensuring 90%+ code coverage.
- Collaborate with cross-functional engineering teams using Git, GitHub Actions, and Agile methodologies.

Requirements:
- Proven experience with JavaScript, TypeScript, React, HTML5, and CSS3.
- Hands-on experience with Node.js, PostgreSQL, Docker, and REST APIs.
- Understanding of state management, responsive UI design, and cloud deployments."""
    ),
    SampleJob(
        id="job-iot-embedded-03",
        title="Embedded Systems & IoT Firmware Engineer",
        department="Connected Hardware & Edge Computing",
        description="""Join our team to design cyber-physical embedded systems and connected sensor architectures.
Responsibilities:
- Develop low-power C and C++ firmware for microcontrollers (ESP32, STM32, ARM Cortex).
- Implement hardware communication protocols including I2C, SPI, UART, and ADC sensor sampling.
- Architect real-time telemetry streaming pipelines using MQTT, WebSockets, and FreeRTOS.
- Interface with external precision sensors, ADCs, and digital signal processing routines.
- Integrate Edge AI and TinyML algorithms for local on-device anomaly detection.

Requirements:
- Bachelor's degree in Computer Science, IoT, Electrical Engineering, or related discipline.
- Deep expertise in C, C++, Python, ESP32, Arduino, and embedded debugging.
- Familiarity with hardware schematics, PCB bring-up, Linux, and Git."""
    )
]

SAMPLE_RESUME_TEXT = """PRINCE KUMAR
Bangalore, India | princekumar993408@gmail.com | +91 98765 43210
linkedin.com/in/prince-kumar | github.com/princekumar993408-stack

PROFESSIONAL SUMMARY
Results-driven B.Tech Computer Science and Engineering (IoT) student with deep expertise in Artificial Intelligence, Python, embedded systems, and full-stack software development. Proven track record building production-grade RAG systems, deep learning meteorological models, and real-time cyber-physical IoT telemetry pipelines.

TECHNICAL SKILLS
- Programming Languages: Python, C, C++, Java, JavaScript, TypeScript, SQL
- Machine Learning & AI: PyTorch, Scikit-Learn, OpenCV, NumPy, Pandas, RAG, LangChain, FAISS
- Web & Backend: FastAPI, React, Node.js, Tailwind CSS, REST APIs, WebSockets
- Embedded & IoT: ESP32, Arduino, Raspberry Pi, MQTT, I2C, FreeRTOS, ADS1115
- Tools & Platforms: Git, GitHub, Docker, Linux, VS Code, Pytest, Postman

WORK EXPERIENCE & PROJECTS
AI Research Assistant — Full-Stack Lead Developer
- Engineered an end-to-end multi-document RAG scientific research platform serving 1,000+ extracted pages with sub-300ms vector similarity latency.
- Implemented PyPDF semantic chunking and NumPy cosine similarity algorithms, boosting question-answering retrieval accuracy by 32%.
- Built a modern, glassmorphic React 18 frontend with Framer Motion, enabling interactive multi-paper comparison and APA/IEEE citation export.

CycloneSight: Deep Learning Trajectory Intelligence — ML Engineer
- Architected a 5-layer convolutional neural network (PyTorch) with spatial self-attention for tropical cyclone eye detection on INSAT-3D thermal IR imagery.
- Formulated an Atkinson-Holliday physics-informed loss function, achieving a 22.1% reduction in 24-hour track forecast error (48.6 NM MAE) over baseline GFS numerical weather models.
- Developed a high-throughput FastAPI backend handling satellite image normalization and trajectory sequence forecasting.

BioPower IoT: Microbial Fuel Cell Monitoring — Firmware & Cloud Architect
- Programmed ESP32 C++ firmware with 16-bit ADS1115 differential ADC sampling, capturing microvolt cell potentials and microampere bio-currents.
- Created an automated anomaly detection rule engine flagging substrate exhaustion and membrane biofouling, reducing lab diagnostic downtime by 40%.
- Integrated local SPIFFS circular flash ring-buffering to prevent telemetry data loss during WiFi drops.

EDUCATION
B.Tech in Computer Science and Engineering (Internet of Things)
Jain University, India | Expected Graduation: 2026
Coursework: Data Structures & Algorithms, Machine Learning, Embedded Systems, Computer Networks, Database Management Systems."""

def perform_analysis(resume_text: str, jd_text: str) -> ATSAnalysisResult:
    """Core analysis orchestrator combining parser, matcher, impact analyzer, and scorer."""
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is empty or unreadable.")
    if not jd_text.strip():
        raise HTTPException(status_code=400, detail="Job description is empty.")

    # 1. Parse contact details & sections
    contact_dict = extract_contact_info(resume_text)
    sections = extract_sections(resume_text)

    # 2. Extract skills from both documents
    resume_skills = extract_skills_from_text(resume_text)
    jd_skills = extract_skills_from_text(jd_text)

    # 3. Match skills & compute semantic similarity
    skill_gap_result = analyze_skill_gaps(resume_skills, jd_skills)
    semantic_sim = calculate_semantic_similarity(resume_text, jd_text)

    # 4. Analyze bullet point impact & action verbs
    bullet_evals, impact_score = evaluate_bullet_points(resume_text)

    # 5. Audit formatting and structure
    formatting_audit_raw = audit_formatting_and_sections(resume_text, contact_dict, sections)

    # 6. Compute composite score and recommendations
    score_result = compute_overall_ats_score(
        skill_match_ratio=skill_gap_result["match_ratio"],
        semantic_similarity=semantic_sim,
        impact_score=impact_score,
        formatting_score=formatting_audit_raw["formatting_score"],
        missing_critical=skill_gap_result["missing_critical_skills"]
    )

    contact_info_obj = ContactInfo(**contact_dict)
    score_breakdown_obj = ScoreBreakdown(**score_result["breakdown"])
    formatting_audit_obj = FormattingAudit(
        has_contact=formatting_audit_raw["has_contact"],
        has_experience=formatting_audit_raw["has_experience"],
        has_education=formatting_audit_raw["has_education"],
        has_skills=formatting_audit_raw["has_skills"],
        has_summary=formatting_audit_raw["has_summary"],
        has_projects=formatting_audit_raw["has_projects"],
        word_count=formatting_audit_raw["word_count"],
        readability_score=formatting_audit_raw["readability_score"],
        issues=formatting_audit_raw["issues"]
    )

    bullet_eval_objs = [BulletPointEvaluation(**b) for b in bullet_evals]
    matched_detail_objs = [MatchedSkillItem(**m) for m in skill_gap_result["matched_skills_details"]]

    return ATSAnalysisResult(
        overall_score=score_result["overall_score"],
        passed_threshold=score_result["passed_threshold"],
        score_breakdown=score_breakdown_obj,
        contact_info=contact_info_obj,
        matched_skills=skill_gap_result["matched_skills"],
        missing_critical_skills=skill_gap_result["missing_critical_skills"],
        missing_recommended_skills=skill_gap_result["missing_recommended_skills"],
        all_jd_skills=skill_gap_result["all_jd_skills"],
        matched_skills_details=matched_detail_objs,
        bullet_evaluations=bullet_eval_objs,
        formatting_audit=formatting_audit_obj,
        top_recommendations=score_result["top_recommendations"]
    )

@router.post("/analyze", response_model=ATSAnalysisResult)
async def analyze_resume_file(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """Ingests PDF/TXT resume file and compares against job description."""
    content = await file.read()
    filename = (file.filename or "").lower()

    if filename.endswith(".pdf"):
        resume_text = extract_text_from_pdf(content)
    else:
        try:
            resume_text = content.decode("utf-8")
        except UnicodeDecodeError:
            resume_text = content.decode("latin-1", errors="ignore")

    return perform_analysis(resume_text, job_description)

@router.post("/analyze_text", response_model=ATSAnalysisResult)
def analyze_resume_text(payload: AnalyzeTextRequest):
    """Analyzes raw text resume against job description."""
    return perform_analysis(payload.resume_text, payload.job_description)

@router.get("/sample_jobs", response_model=List[SampleJob])
def get_sample_jobs():
    """Returns curated job descriptions for fast benchmarking."""
    return SAMPLE_JOBS

@router.get("/sample_resume")
def get_sample_resume():
    """Returns sample software engineer resume text."""
    return {"resume_text": SAMPLE_RESUME_TEXT}
