import Link from "next/link";
import { ArrowRight, FileText, Target, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
              <Zap className="h-4 w-4" />
              <span>AI-Powered Resume Analysis</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">
              Land your dream job with precision.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload your resume, paste the job description, and let our AI analyze the match. 
              Discover skill gaps, get tailored improvement suggestions, and beat the ATS.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dashboard/analyze" 
                className="group flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white hover:bg-indigo-700 transition-all shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.7)] w-full sm:w-auto"
              >
                Start Free Analysis
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t border-slate-800 bg-slate-950/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Match Scoring</h3>
                <p className="text-slate-400">Get an instant percentage match score based on how well your resume aligns with the specific job requirements.</p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                  <FileText className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Skill Gap Analysis</h3>
                <p className="text-slate-400">Instantly identify exactly which crucial keywords and skills you are missing to pass the initial screening.</p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Suggestions</h3>
                <p className="text-slate-400">Receive actionable, AI-generated bullet points and rewriting suggestions to make your experience stand out.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
