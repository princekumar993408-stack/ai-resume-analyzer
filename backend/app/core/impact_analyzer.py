"""
Bullet Point Impact & Action Verb Analyzer
Evaluates quantified achievements and generates Google XYZ-formula enhancements.
Author: Prince Kumar (B.Tech CSE IoT, Jain University)
"""

import re
from typing import List, Dict, Any, Tuple

STRONG_ACTION_VERBS = {
    # Engineering & Building
    "architected", "engineered", "implemented", "developed", "designed", "constructed",
    "built", "programmed", "coded", "configured", "deployed", "integrated", "automated",
    # Optimization & Performance
    "optimized", "streamlined", "accelerated", "reduced", "scaled", "boosted", "maximized",
    "refactored", "enhanced", "upgraded", "consolidated", "fine-tuned",
    # Leadership & Orchestration
    "spearheaded", "orchestrated", "led", "directed", "mentored", "championed",
    "coordinated", "executed", "initiated", "founded",
    # Research & Innovation
    "formulated", "synthesized", "evaluated", "benchmarked", "discovered", "trained", "modeled"
}

WEAK_PASSIVE_PHRASES = [
    r"\bresponsible\s+for\b",
    r"\bworked\s+on\b",
    r"\bhelped\s+(?:with|in)\b",
    r"\bassisted\s+(?:with|in)\b",
    r"\btasked\s+with\b",
    r"\bparticipated\s+in\b",
    r"\bhandled\b",
    r"\bduties\s+included\b"
]

METRIC_PATTERNS = [
    r"\b\d+%\b",                                      # 25%
    r"\b\$\d+(?:,\d{3})*(?:\.\d+)?(?:k|m|b)?\b",       # $50k
    r"\b\d+(?:,\d{3})*\s*(?:users|clients|customers)\b", # 50,000 users
    r"\b\d+(?:\.\d+)?\s*(?:ms|seconds|minutes|hours)\b", # 120ms
    r"\b\d+x\b",                                      # 3x faster
    r"\b\d+(?:,\d{3})*\s*(?:records|qps|requests|rows)\b" # 10,000 QPS
]

def evaluate_bullet_points(text: str) -> Tuple[List[Dict[str, Any]], float]:
    """
    Extracts bullet points from resume text and evaluates their impact,
    identifying quantification metrics, action verbs, and actionable suggestions.
    """
    lines = text.splitlines()
    bullets = []

    for line in lines:
        stripped = line.strip()
        # Detect bullet-like lines
        if re.match(r"^[\u2022\u2023\u25E6\u2043\u2219\*\-\–\—]\s*", stripped) or (
            len(stripped) > 40 and any(stripped.lower().startswith(v) for v in STRONG_ACTION_VERBS)
        ):
            clean_bullet = re.sub(r"^[\u2022\u2023\u25E6\u2043\u2219\*\-\–\—]\s*", "", stripped).strip()
            if len(clean_bullet) >= 20:
                bullets.append(clean_bullet)

    # Fallback: if no formal bullets found, take sentences from body
    if not bullets:
        sentences = re.split(r"(?<=[.!?])\s+", text)
        bullets = [s.strip() for s in sentences if len(s.strip()) > 35][:8]

    evaluations = []
    strong_count = 0

    for b in bullets[:12]:  # Evaluate top 12 bullets
        b_lower = b.lower()
        first_word = re.findall(r"^[a-zA-Z]+", b_lower)
        first_verb = first_word[0] if first_word else ""

        has_action_verb = first_verb in STRONG_ACTION_VERBS
        has_passive = any(re.search(p, b_lower) for p in WEAK_PASSIVE_PHRASES)

        # Check quantification
        has_quantification = any(re.search(p, b_lower) for p in METRIC_PATTERNS) or bool(
            re.search(r"\b\d+\b", b)
        )

        if has_action_verb and has_quantification and not has_passive:
            strength = "strong"
            strong_count += 1
            suggestion = "Exceptional impact phrasing. Includes a strong power verb with measurable quantified outcome."
        elif has_action_verb or has_quantification:
            strength = "moderate"
            if not has_quantification:
                suggestion = "Strengthen by quantifying the outcome: add metrics like '% latency reduction', 'users served', or 'throughput improved'."
            else:
                suggestion = f"Begin with an active power verb (e.g. 'Architected', 'Optimized', or 'Engineered') instead of passive framing."
        else:
            strength = "weak"
            suggestion = "Transform using the Google XYZ formula: 'Accomplished [X] as measured by [Y % metric], by doing [Z technology action]'."

        evaluations.append({
            "original_text": b,
            "has_quantification": has_quantification,
            "action_verb": first_verb if has_action_verb else None,
            "strength": strength,
            "suggestion": suggestion
        })

    total = len(evaluations)
    impact_score = (strong_count / max(1, total)) * 100.0 if total > 0 else 70.0

    return evaluations, float(impact_score)
