"""
Semantic Matching and Skill Gap Analysis Engine
Pure NumPy TF-IDF Vectorizer & Cosine Similarity.
Author: Prince Kumar (B.Tech CSE IoT, Jain University)
"""

import re
import math
from typing import Dict, Any, List, Set
from collections import Counter
import numpy as np

# Standard English Stop Words
STOP_WORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
    "can", "did", "do", "does", "doing", "don", "down", "during", "each", "few", "for", "from",
    "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him", "himself",
    "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me", "more", "most",
    "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once", "only", "or", "other", "our",
    "ours", "ourselves", "out", "over", "own", "s", "same", "she", "should", "so", "some", "such", "t",
    "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", "these", "they",
    "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "were", "what",
    "when", "where", "which", "while", "who", "whom", "why", "will", "with", "you", "your", "yours"
}

def tokenize(text: str) -> List[str]:
    """Tokenize text into lowercase unigrams, excluding standard stop words."""
    words = re.findall(r"\b[a-zA-Z0-9_\+\#\.-]{2,}\b", text.lower())
    return [w for w in words if w not in STOP_WORDS]

def calculate_semantic_similarity(resume_text: str, jd_text: str) -> float:
    """
    Computes TF-IDF cosine similarity between resume text and job description using NumPy.
    Returns float score between 0.0 and 1.0.
    """
    if not resume_text.strip() or not jd_text.strip():
        return 0.0

    # Tokenize both documents
    tokens_res = tokenize(resume_text)
    tokens_jd = tokenize(jd_text)

    if not tokens_res or not tokens_jd:
        return 0.0

    # Vocabulary
    vocab: Set[str] = set(tokens_res).union(set(tokens_jd))
    vocab_list = sorted(list(vocab))
    word2idx = {w: i for i, w in enumerate(vocab_list)}
    num_features = len(vocab_list)

    # Document frequencies
    df = Counter()
    for w in set(tokens_res):
        df[w] += 1
    for w in set(tokens_jd):
        df[w] += 1

    # IDF (smooth idf formula)
    N = 2
    idf = np.zeros(num_features, dtype=np.float32)
    for w, idx in word2idx.items():
        idf[idx] = math.log((1 + N) / (1 + df[w])) + 1.0

    # TF for resume
    counts_res = Counter(tokens_res)
    tf_res = np.zeros(num_features, dtype=np.float32)
    len_res = len(tokens_res)
    for w, c in counts_res.items():
        tf_res[word2idx[w]] = c / len_res

    # TF for JD
    counts_jd = Counter(tokens_jd)
    tf_jd = np.zeros(num_features, dtype=np.float32)
    len_jd = len(tokens_jd)
    for w, c in counts_jd.items():
        tf_jd[word2idx[w]] = c / len_jd

    # TF-IDF vectors
    vec_res = tf_res * idf
    vec_jd = tf_jd * idf

    # L2 Norm
    norm_res = np.linalg.norm(vec_res)
    norm_jd = np.linalg.norm(vec_jd)

    if norm_res == 0.0 or norm_jd == 0.0:
        return 0.0

    # Cosine Similarity
    similarity = np.dot(vec_res, vec_jd) / (norm_res * norm_jd)
    return float(np.clip(similarity, 0.0, 1.0))

def analyze_skill_gaps(
    resume_skills: Dict[str, str],
    jd_skills: Dict[str, str]
) -> Dict[str, Any]:
    """
    Compares candidate skills against job requirements.
    Categorizes skills by importance: Critical (Languages, Frameworks, Core Tools) vs Recommended.
    """
    matched = []
    missing_critical = []
    missing_recommended = []
    matched_details = []

    critical_categories = {
        "programming_languages",
        "ai_ml_data_science",
        "web_and_backend",
        "cloud_and_devops",
        "iot_and_hardware"
    }

    # Evaluate all JD skills
    for skill, cat in jd_skills.items():
        in_resume = skill in resume_skills
        is_critical = cat in critical_categories

        if in_resume:
            matched.append(skill)
            matched_details.append({
                "skill": skill,
                "category": cat,
                "in_resume": True,
                "in_jd": True,
                "priority": "critical" if is_critical else "recommended"
            })
        else:
            if is_critical:
                missing_critical.append(skill)
            else:
                missing_recommended.append(skill)

            matched_details.append({
                "skill": skill,
                "category": cat,
                "in_resume": False,
                "in_jd": True,
                "priority": "critical" if is_critical else "recommended"
            })

    # Add bonus skills (in resume but not explicitly in JD)
    for skill, cat in resume_skills.items():
        if skill not in jd_skills:
            matched_details.append({
                "skill": skill,
                "category": cat,
                "in_resume": True,
                "in_jd": False,
                "priority": "bonus"
            })

    total_jd = len(jd_skills)
    match_ratio = (len(matched) / max(1, total_jd)) if total_jd > 0 else 0.75

    return {
        "match_ratio": float(match_ratio),
        "matched_skills": sorted(matched),
        "missing_critical_skills": sorted(missing_critical),
        "missing_recommended_skills": sorted(missing_recommended),
        "all_jd_skills": sorted(list(jd_skills.keys())),
        "matched_skills_details": matched_details
    }
