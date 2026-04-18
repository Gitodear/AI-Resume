import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckCircle2, AlertCircle, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: analysis, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !analysis) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Analysis Not Found</h2>
        <p className="text-slate-400 mb-8">We couldn't find the requested analysis.</p>
        <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const results = analysis.results_json;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white">{analysis.job_title}</h1>
        <p className="text-slate-400 mt-1">Analyzed on {new Date(analysis.created_at).toLocaleDateString()}</p>
      </div>

      <div className="space-y-8">
        {/* Score Header */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative w-32 h-32 shrink-0">
            {/* Circular Progress */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-slate-800 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
              <circle 
                className={`${results.matchScore >= 80 ? 'text-emerald-500' : results.matchScore >= 60 ? 'text-amber-500' : 'text-red-500'} stroke-current`}
                strokeWidth="8" 
                strokeLinecap="round" 
                cx="50" cy="50" r="40" 
                fill="transparent" 
                strokeDasharray="251.2" 
                strokeDashoffset={251.2 - (251.2 * results.matchScore) / 100} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{results.matchScore}%</span>
            </div>
          </div>
          
          <div className="text-center md:text-left z-10">
            <h2 className="text-2xl font-bold text-white mb-2">
              {results.matchScore >= 80 ? 'Great Match!' : results.matchScore >= 60 ? 'Good Match!' : 'Needs Improvement'}
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl">
              This is a historical view of your analysis.
            </p>
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
              {results.matchedSkills?.length > 0 ? (
                results.matchedSkills.map((skill: string) => (
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
              {results.missingSkills?.length > 0 ? (
                results.missingSkills.map((skill: string) => (
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
            {results.suggestions?.length > 0 ? (
              results.suggestions.map((suggestion: string, i: number) => (
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
    </div>
  );
}
