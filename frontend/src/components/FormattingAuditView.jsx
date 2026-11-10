import React from 'react';
import { FileCheck, CheckCircle2, AlertTriangle, AlertCircle, FileText, Layers, ShieldCheck } from 'lucide-react';

export default function FormattingAuditView({ formattingAudit }) {
  if (!formattingAudit) return null;

  const {
    has_contact,
    has_experience,
    has_education,
    has_skills,
    has_summary,
    has_projects,
    word_count,
    readability_score,
    issues
  } = formattingAudit;

  const sections = [
    { label: 'Contact Details (Email & Phone)', present: has_contact, critical: true },
    { label: 'Professional Summary / Objective', present: has_summary, critical: false },
    { label: 'Work Experience / History', present: has_experience, critical: true },
    { label: 'Technical Skills Section', present: has_skills, critical: true },
    { label: 'Education & Academic Degrees', present: has_education, critical: true },
    { label: 'Projects / Practical Engineering', present: has_projects, critical: false },
  ];

  const presentCount = sections.filter(s => s.present).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="card-glass p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-amber/20 text-brand-amber border border-brand-amber/30 font-semibold">
              STRUCTURE &amp; PARSEABILITY AUDIT
            </span>
            <span className="text-xs font-mono text-slate-400">
              {presentCount} / {sections.length} Critical Sections Verified
            </span>
          </div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-amber" />
            ATS Structural Formatting &amp; Readability Audit
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Verifies heading hierarchy, contact parseability, length thresholds, and ensures document layout 
            can be indexed cleanly by legacy and modern Applicant Tracking Systems.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase">Total Words</div>
            <div className="text-xl font-bold text-white">{word_count}</div>
          </div>
          <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase">Readability Index</div>
            <div className="text-xl font-bold text-emerald-400">{readability_score}%</div>
          </div>
        </div>
      </div>

      {/* Section Completeness Grid */}
      <div className="card-glass p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-emerald" />
          Section Header Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                sec.present
                  ? 'bg-dark-900/60 border-slate-800 text-slate-200'
                  : (sec.critical ? 'bg-red-950/30 border-red-800/60 text-red-200' : 'bg-amber-950/20 border-amber-800/40 text-amber-300')
              }`}
            >
              <div className="flex items-center gap-2.5">
                {sec.present ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className={`w-4 h-4 shrink-0 ${sec.critical ? 'text-red-400' : 'text-amber-400'}`} />
                )}
                <span className="font-semibold">{sec.label}</span>
              </div>
              <span className={`text-[10px] font-bold uppercase ${sec.present ? 'text-emerald-400' : 'text-slate-500'}`}>
                {sec.present ? 'Detected' : 'Missing'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Formatting Warnings & Length Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Detected Issues */}
        <div className="card-glass p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-brand-amber" />
            Detected Formatting Flags ({issues.length})
          </h3>

          {issues.length === 0 ? (
            <div className="p-4 rounded-xl bg-dark-900 border border-slate-800 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero formatting penalties detected. Clean ATS parseability.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-dark-900/80 border border-slate-800/80 text-slate-300 flex items-start gap-2 text-[11px] font-sans leading-relaxed"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best Practice ATS Rules */}
        <div className="card-glass p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-cyan" />
            ATS Formatting Golden Rules
          </h3>

          <div className="space-y-2 text-[11px] font-sans text-slate-300">
            <div className="p-2.5 rounded-lg bg-dark-900 border border-slate-800">
              <strong className="text-white block font-mono">1. Avoid Complex Multi-Column Layouts</strong>
              Older ATS parsers read left-to-right across columns, jumbling text and company names.
            </div>
            <div className="p-2.5 rounded-lg bg-dark-900 border border-slate-800">
              <strong className="text-white block font-mono">2. Keep Tables and Textboxes to Zero</strong>
              Text embedded inside graphics, tables, or floating text frames is often invisible to parsers.
            </div>
            <div className="p-2.5 rounded-lg bg-dark-900 border border-slate-800">
              <strong className="text-white block font-mono">3. Use Standard Section Headings</strong>
              Stick to 'Experience', 'Education', and 'Skills' rather than bespoke phrases like 'My Journey'.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
