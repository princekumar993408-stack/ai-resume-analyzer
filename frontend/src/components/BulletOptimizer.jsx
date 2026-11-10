import React from 'react';
import { Target, CheckCircle2, AlertTriangle, Sparkles, TrendingUp, HelpCircle, ArrowRight } from 'lucide-react';

export default function BulletOptimizer({ bulletEvaluations }) {
  if (!bulletEvaluations || bulletEvaluations.length === 0) {
    return (
      <div className="card-glass p-8 rounded-2xl border border-slate-800 text-center font-mono text-slate-400">
        No experience or project bullet points parsed. Paste detailed work experience bullet points to analyze impact.
      </div>
    );
  }

  const strongCount = bulletEvaluations.filter(b => b.strength === 'strong').length;
  const quantifiedCount = bulletEvaluations.filter(b => b.has_quantification).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="card-glass p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple border border-brand-purple/30 font-semibold">
              GOOGLE XYZ IMPACT ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              {strongCount} / {bulletEvaluations.length} Strong Impact Bullets
            </span>
          </div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-purple" />
            Bullet Point Strength &amp; Quantified Outcome Optimizer
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Replaces passive responsibility phrasing with leadership power verbs and guides quantification 
            using the formula: <code className="text-brand-cyan">"Accomplished [X] as measured by [Y], by doing [Z]"</code>.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase">Quantified Bullets</div>
            <div className="text-xl font-bold text-emerald-400">
              {quantifiedCount} / {bulletEvaluations.length}
            </div>
          </div>
        </div>
      </div>

      {/* Bullet Point Evaluations List */}
      <div className="space-y-4">
        {bulletEvaluations.map((b, idx) => (
          <div
            key={idx}
            className="card-glass p-5 rounded-2xl border border-slate-800 space-y-3"
          >
            {/* Top Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-bold">#{idx + 1}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  b.strength === 'strong'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : (b.strength === 'moderate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30')
                }`}>
                  {b.strength} Impact
                </span>

                {b.action_verb && (
                  <span className="px-2 py-0.5 rounded bg-dark-900 border border-slate-800 text-brand-cyan text-[11px]">
                    Verb: <strong>{b.action_verb}</strong>
                  </span>
                )}
              </div>

              <div>
                {b.has_quantification ? (
                  <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Quantified Outcome
                  </span>
                ) : (
                  <span className="text-amber-400 text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Missing Metrics
                  </span>
                )}
              </div>
            </div>

            {/* Original Bullet */}
            <p className="text-xs text-white font-mono leading-relaxed pl-3 border-l-2 border-brand-purple">
              {b.original_text}
            </p>

            {/* AI Optimization Suggestion */}
            <div className="p-3 rounded-xl bg-dark-900 border border-slate-800/80 text-xs space-y-1 font-sans">
              <span className="text-[10px] font-mono text-brand-violet font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-violet" />
                ATS IMPACT RECOMMENDATION:
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {b.suggestion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Power Action Verb Cheat Sheet */}
      <div className="card-glass p-5 rounded-2xl border border-slate-800 font-mono text-xs space-y-3">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Recommended High-Impact Engineering Action Verbs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
          <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 space-y-1">
            <span className="text-brand-cyan font-bold block">Architecture &amp; Design</span>
            <p className="text-slate-400">Architected, Engineered, Formulated, Designed, Constructed</p>
          </div>
          <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 space-y-1">
            <span className="text-brand-purple font-bold block">Execution &amp; Deployment</span>
            <p className="text-slate-400">Deployed, Orchestrated, Programmed, Implemented, Automated</p>
          </div>
          <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-bold block">Speed &amp; Optimization</span>
            <p className="text-slate-400">Optimized, Streamlined, Accelerated, Reduced, Scaled</p>
          </div>
          <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 space-y-1">
            <span className="text-brand-amber font-bold block">Research &amp; Modeling</span>
            <p className="text-slate-400">Trained, Benchmarked, Synthesized, Discovered, Evaluated</p>
          </div>
        </div>
      </div>

    </div>
  );
}
