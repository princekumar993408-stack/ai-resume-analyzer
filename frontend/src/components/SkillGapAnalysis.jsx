import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertCircle, Search, Sparkles, Filter, Tag } from 'lucide-react';

export default function SkillGapAnalysis({ analysis }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!analysis) return null;

  const {
    matched_skills,
    missing_critical_skills,
    missing_recommended_skills,
    all_jd_skills,
    matched_skills_details
  } = analysis;

  const filteredDetails = matched_skills_details.filter((item) => {
    const matchesSearch = item.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', ...new Set(matched_skills_details.map(m => m.category))];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="card-glass p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 font-semibold">
              KEYWORD &amp; TAXONOMY INTELLIGENCE
            </span>
            <span className="text-xs font-mono text-slate-400">
              {matched_skills.length} / {all_jd_skills.length} Target Keywords Matched
            </span>
          </div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-cyan" />
            Hard Skill Gap &amp; Critical Requirement Audit
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Identifies exact technical keywords, libraries, and frameworks present in the job description 
            and highlights critical gaps that trigger automated ATS candidate rejection.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-dark-900 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase">Match Ratio</div>
            <div className="text-xl font-bold text-brand-cyan">
              {all_jd_skills.length > 0 ? `${Math.round((matched_skills.length / all_jd_skills.length) * 100)}%` : '100%'}
            </div>
          </div>
        </div>
      </div>

      {/* Missing Critical Skills Callout */}
      {missing_critical_skills.length > 0 && (
        <div className="p-5 rounded-2xl bg-red-950/40 border border-red-700/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-300 uppercase">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Missing Critical Skills ({missing_critical_skills.length}) — High Priority</span>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            These essential technologies appear in the job requirements but are absent from your resume text. 
            Incorporate them into your Skills or Experience bullet points:
          </p>
          <div className="flex flex-wrap gap-2">
            {missing_critical_skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-xl bg-red-900/60 text-red-200 border border-red-600/50 text-xs font-mono font-semibold"
              >
                + {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Matched Skills Overview */}
      <div className="card-glass p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Verified Matched Credentials ({matched_skills.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {matched_skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 text-xs font-mono flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{skill}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Filterable Skills Breakdown Table */}
      <div className="card-glass p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-brand-purple" />
            <span className="font-bold text-white">Full Taxonomy Verification Matrix</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search skills..."
                className="w-full pl-8 pr-3 py-1 rounded-lg bg-dark-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-dark-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Domains' : c.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Technology / Skill</th>
                <th className="py-2.5 px-3">Domain Category</th>
                <th className="py-2.5 px-3">In Resume</th>
                <th className="py-2.5 px-3">In Job Description</th>
                <th className="py-2.5 px-3 text-right">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDetails.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">
                    {item.skill}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 capitalize">
                    {item.category.replace(/_/g, ' ')}
                  </td>
                  <td className="py-2.5 px-3">
                    {item.in_resume ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Present
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Missing
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {item.in_jd ? 'Required' : 'Bonus'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.priority === 'critical'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : (item.priority === 'recommended' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30')
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
