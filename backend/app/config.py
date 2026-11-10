"""
Configuration and ATS Scoring Weights for AI Resume Analyzer
Author: Prince Kumar (B.Tech CSE IoT, Jain University)
"""

class Settings:
    PROJECT_NAME: str = "AI Resume & ATS Optimization Engine"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/resume"

    # ATS Scoring Component Weights (Sum = 1.0)
    WEIGHT_SKILL_MATCH: float = 0.35
    WEIGHT_SEMANTIC_SIMILARITY: float = 0.25
    WEIGHT_ACTION_VERBS_IMPACT: float = 0.20
    WEIGHT_SECTION_FORMATTING: float = 0.20

    # Minimum recommended ATS pass mark
    ATS_PASS_THRESHOLD: int = 70

settings = Settings()
