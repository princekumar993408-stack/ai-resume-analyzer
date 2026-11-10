/**
 * AI Resume Analyzer & ATS Optimizer - Frontend API Client
 */

const API_BASE = '/api/resume';

export const api = {
  async getHealth() {
    try {
      const res = await fetch('/health');
      return await res.json();
    } catch (err) {
      return { status: 'disconnected', error: err.message };
    }
  },

  async getSampleJobs() {
    const res = await fetch(`${API_BASE}/sample_jobs`);
    if (!res.ok) throw new Error('Failed to fetch sample job descriptions');
    return await res.json();
  },

  async getSampleResume() {
    const res = await fetch(`${API_BASE}/sample_resume`);
    if (!res.ok) throw new Error('Failed to fetch sample resume');
    return await res.json();
  },

  async analyzeText(resumeText, jobDescription) {
    const res = await fetch(`${API_BASE}/analyze_text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobDescription
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Analysis failed' }));
      throw new Error(err.detail || 'Analysis failed');
    }
    return await res.json();
  },

  async analyzeFile(file, jobDescription) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'File analysis failed' }));
      throw new Error(err.detail || 'File analysis failed');
    }
    return await res.json();
  }
};
