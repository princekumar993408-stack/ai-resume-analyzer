import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UploadSection from './components/UploadSection';
import ScoreOverview from './components/ScoreOverview';
import SkillGapAnalysis from './components/SkillGapAnalysis';
import BulletOptimizer from './components/BulletOptimizer';
import FormattingAuditView from './components/FormattingAuditView';
import { api } from './api';
import { Cpu, ExternalLink, Activity, FileCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [sampleJobs, setSampleJobs] = useState([]);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const health = await api.getHealth();
      setBackendHealthy(health.status === 'ok');

      const jobs = await api.getSampleJobs();
      setSampleJobs(jobs);
      if (jobs.length > 0) {
        setJobDescription(jobs[0].description);
      }

      const sample = await api.getSampleResume();
      setResumeText(sample.resume_text);
    } catch (err) {
      console.warn('Backend connection warning:', err);
      setBackendHealthy(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a target Job Description.');
      return;
    }
    if (!selectedFile && !resumeText.trim()) {
      setError('Please upload a resume file or paste resume text.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      let result;
      if (selectedFile) {
        result = await api.analyzeFile(selectedFile, jobDescription);
      } else {
        result = await api.analyzeText(resumeText, jobDescription);
      }
      setAnalysis(result);
      setActiveTab('overview');
    } catch (err) {
      setError(err.message || 'Analysis failed. Please verify resume input.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLoadDemo = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      setSelectedFile(null);

      const sample = await api.getSampleResume();
      setResumeText(sample.resume_text);

      let jd = jobDescription;
      if (sampleJobs.length > 0) {
        jd = sampleJobs[0].description;
        setJobDescription(jd);
      }

      const result = await api.analyzeText(sample.resume_text, jd);
      setAnalysis(result);
      setActiveTab('overview');
    } catch (err) {
      setError('Failed to load demo: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasAnalysis={!!analysis}
        overallScore={analysis?.overall_score || 0}
        backendHealthy={backendHealthy}
        onLoadDemo={handleLoadDemo}
        analyzing={analyzing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* VIEW 1: UPLOAD & INPUT */}
        {activeTab === 'upload' && (
          <UploadSection
            sampleJobs={sampleJobs}
            resumeText={resumeText}
            setResumeText={setResumeText}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            onAnalyze={handleRunAnalysis}
            analyzing={analyzing}
            error={error}
          />
        )}

        {/* VIEW 2: ATS SCORE & OVERVIEW */}
        {activeTab === 'overview' && analysis && (
          <ScoreOverview
            analysis={analysis}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* VIEW 3: SKILL GAP INTELLIGENCE */}
        {activeTab === 'skills' && analysis && (
          <SkillGapAnalysis analysis={analysis} />
        )}

        {/* VIEW 4: IMPACT & BULLET POINT OPTIMIZER */}
        {activeTab === 'bullets' && analysis && (
          <BulletOptimizer bulletEvaluations={analysis.bullet_evaluations} />
        )}

        {/* VIEW 5: FORMATTING AUDIT */}
        {activeTab === 'audit' && analysis && (
          <FormattingAuditView formattingAudit={analysis.formatting_audit} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-dark-900/90 backdrop-blur-sm px-6 py-5 mt-12 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-purple" />
            <span className="text-white font-semibold">ResuMatch AI Platform</span>
            <span className="text-slate-600">|</span>
            <span>Developed by Prince Kumar (B.Tech CSE IoT, Jain University)</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/princekumar993408-stack/ai-resume-analyzer"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5 text-brand-purple" />
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <a
              href="https://github.com/princekumar993408-stack/ai-research-assistant"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-brand-cyan" />
              <span>AI Research Assistant</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <span className="text-slate-600">v2.0.0 Production</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
