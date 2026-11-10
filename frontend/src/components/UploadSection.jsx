import React, { useState } from 'react';
import { UploadCloud, FileText, Briefcase, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function UploadSection({
  sampleJobs,
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  selectedFile,
  setSelectedFile,
  onAnalyze,
  analyzing,
  error
}) {
  const [inputMode, setInputMode] = useState('text'); // 'file' or 'text'
  const [selectedJobId, setSelectedJobId] = useState('job-ai-ml-01');

  const handleSelectJobPreset = (jobId) => {
    setSelectedJobId(jobId);
    const job = sampleJobs.find((j) => j.id === jobId);
    if (job) {
      setJobDescription(job.description);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setInputMode('file');
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Hero Banner */}
      <div className="card-glass p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-brand-purple/20 text-brand-violet border border-brand-purple/30 font-semibold">
              PRIVACY-FIRST ATS OPTIMIZATION
            </span>
            <span className="text-xs font-mono text-slate-400">
              100% Local Inference &bull; Zero External AI API Leakage
            </span>
          </div>
          <h2 className="text-xl font-bold font-mono text-white tracking-tight">
            Optimize Your Resume for Enterprise Applicant Tracking Systems
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-1 max-w-3xl leading-relaxed">
            Extract candidate credentials, benchmark keyword density against target job specifications, 
            detect missing critical skills, and strengthen bullet points using Google's quantified XYZ formula.
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={analyzing}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan hover:opacity-90 text-white font-mono font-bold text-sm shadow-lg shadow-brand-purple/25 transition-all shrink-0 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing Match...</span>
            </>
          ) : (
            <>
              <span>Run ATS Scan</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs font-mono flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Dual Inputs Grid: Resume (Left) + Job Description (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: RESUME INPUT */}
        <div className="card-glass p-5 rounded-2xl border border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-cyan" />
              <h3 className="font-mono font-bold text-sm text-white">Candidate Resume</h3>
            </div>

            {/* Input Mode Switcher */}
            <div className="flex items-center gap-1 bg-dark-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setInputMode('file')}
                className={`px-2.5 py-1 rounded transition-all ${
                  inputMode === 'file' ? 'bg-slate-800 text-brand-cyan font-semibold' : 'text-slate-400'
                }`}
              >
                PDF Upload
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`px-2.5 py-1 rounded transition-all ${
                  inputMode === 'text' ? 'bg-slate-800 text-brand-purple font-semibold' : 'text-slate-400'
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          {inputMode === 'file' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="flex-1 min-h-[300px] border-2 border-dashed border-slate-700 hover:border-brand-cyan/60 rounded-xl bg-dark-900/50 p-6 flex flex-col items-center justify-center text-center space-y-3 transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="font-mono text-xs font-bold text-white">
                  {selectedFile ? selectedFile.name : 'Click to Browse or Drag & Drop Resume PDF'}
                </p>
                <p className="font-mono text-[11px] text-slate-400 mt-1">
                  Supports .PDF and .TXT documents (Max 10MB)
                </p>
              </div>
              {selectedFile && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready for parsing: {(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your complete resume text here (Summary, Skills, Work Experience, Education, Projects)..."
              className="w-full flex-1 min-h-[320px] p-4 rounded-xl bg-dark-900/80 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-purple resize-none leading-relaxed"
            />
          )}

          <div className="text-[11px] font-mono text-slate-500 flex justify-between items-center">
            <span>{inputMode === 'text' ? `${resumeText.split(/\s+/).filter(Boolean).length} words` : (selectedFile ? selectedFile.name : 'No file chosen')}</span>
            <span>PDF parser strips tables &amp; extract clean plain text</span>
          </div>
        </div>

        {/* RIGHT COLUMN: JOB DESCRIPTION INPUT */}
        <div className="card-glass p-5 rounded-2xl border border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-purple" />
              <h3 className="font-mono font-bold text-sm text-white">Target Job Description (JD)</h3>
            </div>

            {/* Preset Selector */}
            <select
              value={selectedJobId}
              onChange={(e) => handleSelectJobPreset(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-dark-900 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-brand-purple"
            >
              <option value="" disabled>Load Preset Role...</option>
              {sampleJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job requirements, responsibilities, and required qualifications..."
            className="w-full flex-1 min-h-[320px] p-4 rounded-xl bg-dark-900/80 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-purple resize-none leading-relaxed"
          />

          <div className="text-[11px] font-mono text-slate-500 flex justify-between items-center">
            <span>{jobDescription.split(/\s+/).filter(Boolean).length} words</span>
            <span>Keywords matched against 500+ technical skill taxonomy</span>
          </div>
        </div>

      </div>

    </div>
  );
}
