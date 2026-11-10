"""
FastAPI Application Entrypoint for AI Resume & ATS Analyzer
Author: Prince Kumar (B.Tech CSE IoT, Jain University)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import analyzer

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade AI Resume & ATS Optimization Engine with semantic TF-IDF matching, skill gap analysis, and bullet point impact audit."
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(analyzer.router, prefix=settings.API_V1_STR)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "AI Resume & ATS Optimization Engine",
        "version": settings.VERSION,
        "models": ["tfidf_vectorizer", "skills_taxonomy_500", "xyz_bullet_optimizer"]
    }

@app.get("/")
def root():
    return {
        "message": "AI Resume & ATS Optimization Engine API",
        "author": "Prince Kumar (princekumar993408-stack)",
        "affiliation": "B.Tech CSE (IoT), Jain University",
        "docs": "/docs",
        "health": "/health"
    }
