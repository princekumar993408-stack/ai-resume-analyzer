# 📄 ResuMatch AI: Production ATS Resume Optimization & Skill Gap Platform

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **Privacy-first, production-grade Applicant Tracking System (ATS) resume optimization platform. Combines PyPDF document parsing, TF-IDF cosine semantic similarity, a 500+ technical skill taxonomy gap analyzer, and the Google XYZ bullet-point impact optimizer.**

---

## 🎯 Executive Overview & Problem Statement

Over **75% of qualified technical resumes** are automatically filtered out by enterprise Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo) before reaching a human recruiter. Common rejection causes include:
- **Keyword Deficits:** Critical frameworks and languages mentioned in the job description are missing from the resume text.
- **Passive Framing:** Bullet points describe duties ("Responsible for...") rather than quantifiable engineering outcomes.
- **Unparseable Layouts:** Non-standard section headings, multi-column tables, or unreadable PDF artifacts.

**ResuMatch AI** evaluates resumes directly against target Job Descriptions (JDs), computing a weighted composite ATS score (0–100) and generating targeted keyword and bullet point recommendations. **All parsing and inference run 100% locally with zero external API dependencies or candidate data leaks.**

---

## 🏛️ System Architecture

```
                       Candidate Resume (PDF / TXT)
                                    │
                                    ▼
       ┌──────────────────────────────────────────────────────────┐
       │             DOCUMENT INGESTION & HEURISTICS              │
       │                                                          │
       │  • PyPDF Stream Extractor & Normalizer                   │
       │  • Contact RegEx (Email, Phone, LinkedIn, GitHub, Web)   │
       │  • Section Boundary Parser (Summary, Exp, Skills, Edu)   │
       └────────────────────────────┬─────────────────────────────┘
                                    │
       ┌────────────────────────────┴─────────────────────────────┐
       ▼                                                          ▼
┌──────────────────────────────┐           ┌──────────────────────────────┐
│  TF-IDF SEMANTIC MATCHER     │           │  TAXONOMY SKILL GAP ENGINE   │
│  • N-gram Tokenizer          │           │  • 500+ Technical Skill Map  │
│  • Smooth IDF Weighting      │           │  • Critical vs Recommended   │
│  • Cosine Similarity Matrix  │           │  • Bonus Skills Extraction   │
└──────────────┬───────────────┘           └──────────────┬───────────────┘
               │                                          │
               └────────────────────┬─────────────────────┘
                                    │
                                    ▼
       ┌──────────────────────────────────────────────────────────┐
       │        IMPACT ANALYZER & GOOGLE XYZ REWRITER             │
       │                                                          │
       │  • Active Leadership Verbs (Architected, Engineered...)  │
       │  • Passive Phrase Detection ("Responsible for...")       │
       │  • Metric Pattern Matcher (%, $, QPS, Latency, Users)    │
       │  • XYZ Formula Enhancer: "Accomplished [X] by doing [Z]" │
       └────────────────────────────┬─────────────────────────────┘
                                    │
                                    ▼
       ┌──────────────────────────────────────────────────────────┐
       │              WEIGHTED ATS SCORING ENGINE                 │
       │                                                          │
       │  • Skill Match (35%) + Semantic Sim (25%)                │
       │  • Action Impact (20%) + Formatting Audit (20%)          │
       │  • Pass/Fail Benchmark (>= 70 Points)                    │
       └────────────────────────────┬─────────────────────────────┘
                                    │
                                    ▼
       ┌──────────────────────────────────────────────────────────┐
       │             REACT 18 GLASSMORPHISM DASHBOARD             │
       │                                                          │
       │  • Radial ATS Match Gauge & Score Breakdown              │
       │  • Filterable Skills Matrix with Priority Badges         │
       │  • Bullet-by-Bullet Strength & Rewrite Suggestions       │
       │  • Structural Section Completeness Audit                 │
       └──────────────────────────────────────────────────────────┘
```

---

## 📐 ATS Scoring Mathematical Model

The composite ATS score ($S_{ATS} \in [0, 100]$) is computed through four weighted dimensions:

$$S_{ATS} = \left(0.35 \cdot S_{skill} + 0.25 \cdot S_{semantic} + 0.20 \cdot S_{impact} + 0.20 \cdot S_{format}\right) \times \Phi_{penalty}$$

Where:
- **Skill Match Score ($S_{skill}$):** Proportion of required Job Description skills detected in the candidate resume:
  $$S_{skill} = \frac{|Skills_{resume} \cap Skills_{JD}|}{|Skills_{JD}|} \times 100$$
- **Semantic Similarity ($S_{semantic}$):** Cosine angle between normalized TF-IDF document vectors:
  $$S_{semantic} = \frac{\mathbf{v}_{resume} \cdot \mathbf{v}_{JD}}{\|\mathbf{v}_{resume}\|_2 \|\mathbf{v}_{JD}\|_2} \times 100$$
- **Impact & Action Verb Strength ($S_{impact}$):** Percentage of bullet points featuring strong active verbs and quantifiable business metrics.
- **Formatting Quality ($S_{format}$):** Structural audit assessing contact information completeness, standard section headings, and length bounds ($450\text{–}900\text{ words}$).
- **Critical Deficit Penalty ($\Phi_{penalty}$):** Multiplicative factor ($0.92$) applied when 3 or more critical technical skills are missing.

---

## 💡 The Google XYZ Bullet Formula

ResuMatch AI automatically identifies weak, passive bullet points and formats actionable rewrite recommendations:

$$\text{\bf Accomplished [X], as measured by [Y], by doing [Z]}$$

- **Before (Weak / Passive):** *"Responsible for helping the team optimize search queries."*
- **After (High-Impact / ATS Optimized):** *"Optimized vector database similarity search queries, reducing p99 API latency by 45% by implementing NumPy cosine chunking."*

---

## 🔌 REST API Reference

| Endpoint | Method | Description |
|:---|:---:|:---|
| `/health` | `GET` | Service health status and loaded model capabilities |
| `/api/resume/sample_jobs` | `GET` | Retrieve curated job descriptions (ML, Full Stack, IoT) |
| `/api/resume/sample_resume` | `GET` | Retrieve sample engineering resume text |
| `/api/resume/analyze` | `POST` | Multipart upload for PDF/TXT resume + job description |
| `/api/resume/analyze_text` | `POST` | JSON payload analysis of raw resume text + job description |

---

## 🚀 Quickstart Installation Guide

### Prerequisites
- Python 3.10, 3.11, 3.12, or 3.13
- Node.js 18+ and npm

### 1. Clone the Repository
```bash
git clone https://github.com/princekumar993408-stack/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Set Up Python Backend
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate       # On Linux/macOS
# .\venv\Scripts\Activate.ps1  # On Windows PowerShell

# Install dependencies
pip install -r backend/requirements.txt
```

### 3. Run Automated Pytest Suite
```bash
python run.py --test
```
*Expected output: `10 passed in ~0.84s`.*

### 4. Start Backend Server
```bash
python run.py --port 8000
```
- API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

### 5. Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5175](http://localhost:5175) in your browser.

---

## 👨‍💻 Author

**Prince Kumar**  
- B.Tech in Computer Science and Engineering (IoT), **Jain University**, India.  
- GitHub: [@princekumar993408-stack](https://github.com/princekumar993408-stack)  
- Focus: Artificial Intelligence, Natural Language Processing, Embedded Systems, and Full-Stack Engineering.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
