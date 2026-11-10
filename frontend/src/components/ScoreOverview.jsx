import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  FileCheck, 
  User, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ScoreOverview({ analysis, onNavigateToTab }) {
  if (!analysis) return null;

  const {
    overall_score,
    passed_threshold,
    score_breakdown,
    contact_info,
    matched_skills,
    missing_critical_skills,
    formatting_audit,
    top_recommendations
  } = analysis;

  const getScoreTheme = (score) => {
    if (score >= 70) {
      return {
        color: '#10B981',
        label: 'Strong ATS Match',
        sub: 'Passes automated recruiter filters for human interview review.',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      };
    } else if (score >= 50) {
      return {
        color: '#F59E0B',
        label: 'Moderate ATS Match',
        sub: 'At risk of automated rejection. Keyword optimization recommended.',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      };
    } else {
      return {
        color: '#EF4444',
        label: 'High ATS Rejection Risk',
        sub: 'Critical skill gaps or keyword deficits will cause immediate filtering.',
        badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30'
      };
    }
  };

  const theme = getScoreTheme(overall_score);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Hero Layout: Radial Score Gauge (Left) + Candidate Card & Insights (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radial Score Card */}
        <div className="card-glass p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold uppercase ${theme.badgeClass}`}>
              {theme.label}
            </span>
          </div>

          {/* Circular SVG Gauge */}
          <div className="relative w-44 h-44 flex items-center justify-center font-mono">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#1E293B"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={theme.color}
                strokeWidth="8"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * (overall_score / 100))}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {overall_score}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">OUT OF 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-300 font-sans leading-relaxed px-4">
              {theme.sub}
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              Pass Benchmark: &ge; 70 points
            </div>
          </div>
        </div>

        {/* Candidate Profile & Top Recommendations */}
        <div className="lg:col-span-2 card-glass p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-mono text-brand-cyan uppercase">Parsed Candidate Header</span>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-purple" />
                  {contact_info?.name || 'Candidate Name'}
                </h3>
              </div>

              {/* Quick Contact Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                {contact_info?.email && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-300 text-[11px]">
                    <Mail className="w-3 h-3 text-brand-cyan" />
                    {contact_info.email}
                  </span>
                )}
                {contact_info?.phone && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-300 text-[11px]">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    {contact_info.phone}
                  </span>
                )}
                {contact_info?.github && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-slate-300 text-[11px]">
                    <Github className="w-3 h-3 text-brand-purple" />
                    GitHub
                  </span>
                )}
              </div>
            </div>

            {/* Top Actionable Recommendations */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-amber" />
                Priority Recommendations for Immediate Pass
              </span>

              <div className="space-y-2">
                {top_recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-dark-900/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5 font-sans"
                  >
                    <span className="w-5 h-5 rounded-full bg-brand-purple/20 text-brand-purple font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
            <button
              onClick={() => onNavigateToTab('skills')}
              className="flex items-center gap-1 text-brand-cyan hover:underline"
            >
              <span>View {missing_critical_skills.length} Missing Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-600">&bull;</span>
            <button
              onClick={() => onNavigateToTab('bullets')}
              className="flex items-center gap-1 text-brand-purple hover:underline"
            >
              <span>Rewrite Bullet Points</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 4 Score Component Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        
        {/* 1. Skill Match */}
        <div className="card-glass p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400 uppercase flex items-center justify-between">
            <span>Skill Match</span>
            <span className="text-brand-cyan font-bold">{score_breakdown.skill_match}%</span>
          </div>
          <div className="text-xl font-bold text-white">
            {matched_skills.length} Matched
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-cyan h-full rounded-full transition-all duration-500"
              style={{ width: `${score_breakdown.skill_match}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500">Weight: 35% of total score</div>
        </div>

        {/* 2. Semantic Similarity */}
        <div className="card-glass p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400 uppercase flex items-center justify-between">
            <span>TF-IDF Similarity</span>
            <span className="text-brand-purple font-bold">{score_breakdown.semantic_similarity}%</span>
          </div>
          <div className="text-xl font-bold text-white">
            Cosine Index
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-purple h-full rounded-full transition-all duration-500"
              style={{ width: `${score_breakdown.semantic_similarity}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500">Weight: 25% of total score</div>
        </div>

        {/* 3. Impact & Verbs */}
        <div className="card-glass p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400 uppercase flex items-center justify-between">
            <span>Impact &amp; Verbs</span>
            <span className="text-emerald-400 font-bold">{score_breakdown.impact_strength}%</span>
          </div>
          <div className="text-xl font-bold text-white">
            Quantified XYZ
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${score_breakdown.impact_strength}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500">Weight: 20% of total score</div>
        </div>

        {/* 4. Formatting Quality */}
        <div className="card-glass p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-[11px] text-slate-400 uppercase flex items-center justify-between">
            <span>Formatting</span>
            <span className="text-brand-amber font-bold">{score_breakdown.formatting_quality}%</span>
          </div>
          <div className="text-xl font-bold text-white">
            {formatting_audit.word_count} Words
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand-amber h-full rounded-full transition-all duration-500"
              style={{ width: `${score_breakdown.formatting_quality}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500">Weight: 20% of total score</div>
        </div>

      </div>

    </div>
  );
}
