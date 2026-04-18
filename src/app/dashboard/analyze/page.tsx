"use client";

import { useState } from "react";
import { UploadCloud, FileText, Briefcase, Zap, CheckCircle2, AlertCircle } from "lucide-react";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze resume");
      }

      const data = await response.json();
      setAnalysisResult(data);
      setShowResults(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">New Analysis</h1>
        <p className="text-slate-400 mt-1">Upload your resume and the job description to see your match score.</p>
      </div>

      {!showResults ? (
        <form onSubmit={handleAnalyze} className="space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Resume Upload */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <FileText className="h-4 w-4 text-indigo-400" />
                Your Resume (PDF)
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors ${file ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-700 bg-slate-900/50 group-hover:border-slate-500'}`}>
                  <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                    <UploadCloud className={`h-6 w-6 ${file ? 'text-indigo-400' : 'text-slate-400'}`} />
                  </div>
                  <div className="text-sm font-medium text-white text-center mb-1">
                    {file ? file.name : "Click or drag file to upload"}
                  </div>
                  <div className="text-xs text-slate-500 text-center">
                    {file ? "PDF selected" : "PDF files only, max 5MB"}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description Input */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Briefcase className="h-4 w-4 text-indigo-400" />
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-[200px] rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-sm text-slate-300 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors resize-none"
                placeholder="Paste the full job description here..."
                required
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-800 pt-6">
            <button
              type="submit"
              disabled={isAnalyzing || !file || !jobDescription}
              className="group flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
              {isAnalyzing ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Results UI Skeleton */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Score Header */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="relative w-32 h-32 shrink-0">
              {/* Circular Progress Placeholder */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle className="text-slate-800 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
                <circle 
                  className={`${analysisResult?.matchScore >= 80 ? 'text-emerald-500' : analysisResult?.matchScore >= 60 ? 'text-amber-500' : 'text-red-500'} stroke-current transition-all duration-1000 ease-out`}
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  cx="50" cy="50" r="40" 
                  fill="transparent" 
                  strokeDasharray="251.2" 
                  strokeDashoffset={251.2 - (251.2 * (analysisResult?.matchScore || 0)) / 100} 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{analysisResult?.matchScore || 0}%</span>
              </div>
            </div>
            
            <div className="text-center md:text-left z-10">
              <h2 className="text-2xl font-bold text-white mb-2">
                {analysisResult?.matchScore >= 80 ? 'Great Match!' : analysisResult?.matchScore >= 60 ? 'Good Match!' : 'Needs Improvement'}
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                We've analyzed your resume against the job description. Review the matched skills, gaps, and our AI suggestions below to optimize your chances.
              </p>
            </div>
            
            <div className="md:ml-auto">
              <button 
                onClick={() => setShowResults(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
              >
                New Analysis
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Skills Matched */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult?.matchedSkills?.length > 0 ? (
                  analysisResult.matchedSkills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-sm">No specific skills matched.</span>
                )}
              </div>
            </div>

            {/* Skills Missing */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                <AlertCircle className="h-5 w-5 text-red-400" />
                Missing Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysisResult?.missingSkills?.length > 0 ? (
                  analysisResult.missingSkills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-sm">No missing skills detected!</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-6">
              <Zap className="h-5 w-5 text-indigo-400" />
              AI Suggestions to Improve
            </h3>
            <ul className="space-y-4">
              {analysisResult?.suggestions?.length > 0 ? (
                analysisResult.suggestions.map((suggestion: string, i: number) => (
                  <li key={i} className="flex gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="shrink-0 h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{suggestion}</p>
                  </li>
                ))
              ) : (
                <p className="text-slate-500 text-sm">No specific suggestions at this time.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
