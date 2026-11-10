import React from 'react';
import { FileCheck, Sparkles, Award, RefreshCw, Layers, CheckCircle2, Sliders, ShieldCheck } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  hasAnalysis,
  overallScore,
  backendHealthy,
  onLoadDemo,
  analyzing
}) {
  const tabs = [
    { id: 'upload', label: 'Analyze Resume' },
    { id: 'overview', label: 'ATS Score & Match', disabled: !hasAnalysis },
    { id: 'skills', label: 'Skill Gap Intelligence', disabled: !hasAnalysis },
    { id: 'bullets', label: 'Impact & XYZ Rewriter', disabled: !hasAnalysis },
    { id: 'audit', label: 'Formatting Audit', disabled: !hasAnalysis }
  ];

  return (
    <header className="border-b border-slate-800 bg-dark-900/90 backdrop-blur-md px-6 py-3.5 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center text-white shadow-md shadow-brand-purple/20 font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-base text-white tracking-tight flex items-center gap-2">
              <span>ResuMatch AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-brand-purple/20 text-brand-violet border border-brand-purple/30 font-semibold">
                ATS Engine v2.0
              </span>
            </h1>
            <p className="text-[10px] font-mono text-slate-400">
              TF-IDF Semantic Matching &amp; Resume Optimization Engine
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-dark-850 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                tab.disabled
                  ? 'text-slate-600 cursor-not-allowed'
                  : activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Quick Demo & Status Dot */}
        <div className="flex items-center gap-3">
          {hasAnalysis && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-dark-850 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">Score:</span>
              <strong className={`font-bold ${overallScore >= 70 ? 'text-emerald-400' : (overallScore >= 50 ? 'text-amber-400' : 'text-red-400')}`}>
                {overallScore}/100
              </strong>
            </div>
          )}

          <button
            onClick={onLoadDemo}
            disabled={analyzing}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20 border border-brand-cyan/30 text-xs font-mono font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample</span>
          </button>

          {/* Backend Status Dot */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                backendHealthy ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
              }`}
            />
            <span className="hidden sm:inline">
              {backendHealthy ? 'Engine Online' : 'Offline'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
