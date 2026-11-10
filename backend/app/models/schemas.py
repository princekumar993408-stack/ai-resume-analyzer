"""
Pydantic Data Models for AI Resume & ATS Analyzer
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class ContactInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None

class MatchedSkillItem(BaseModel):
    skill: str
    category: str
    in_resume: bool
    in_jd: bool
    priority: str  # critical, recommended, bonus

class BulletPointEvaluation(BaseModel):
    original_text: str
    has_quantification: bool
    action_verb: Optional[str] = None
    strength: str  # strong, moderate, weak
    suggestion: str

class FormattingAudit(BaseModel):
    has_contact: bool
    has_experience: bool
    has_education: bool
    has_skills: bool
    has_summary: bool
    has_projects: bool
    word_count: int
    readability_score: float
    issues: List[str]

class ScoreBreakdown(BaseModel):
    skill_match: float
    semantic_similarity: float
    impact_strength: float
    formatting_quality: float

class ATSAnalysisResult(BaseModel):
    overall_score: int
    passed_threshold: bool
    score_breakdown: ScoreBreakdown
    contact_info: ContactInfo
    matched_skills: List[str]
    missing_critical_skills: List[str]
    missing_recommended_skills: List[str]
    all_jd_skills: List[str]
    matched_skills_details: List[MatchedSkillItem]
    bullet_evaluations: List[BulletPointEvaluation]
    formatting_audit: FormattingAudit
    top_recommendations: List[str]

class AnalyzeTextRequest(BaseModel):
    resume_text: str
    job_description: str

class SampleJob(BaseModel):
    id: str
    title: str
    department: str
    description: str
