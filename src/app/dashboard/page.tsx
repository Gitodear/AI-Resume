import Link from "next/link";
import { Plus, FileText, Calendar, ChevronRight, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch analyses
  const { data: analyses, error } = await supabase
    .from("analyses")
    .select("*")
    .order("created_at", { ascending: false });

  const totalAnalyses = analyses?.length || 0;
  const averageScore = totalAnalyses > 0 
    ? Math.round(analyses!.reduce((acc, curr) => acc + curr.match_score, 0) / totalAnalyses) 
    : 0;

  const recentActivity = totalAnalyses > 0 
    ? new Date(analyses![0].created_at).toLocaleDateString()
    : "Never";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your resume analyses and track your progress.</p>
        </div>
        <Link 
          href="/dashboard/analyze" 
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          New Analysis
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="text-sm font-medium text-slate-400 mb-1">Total Analyses</div>
          <div className="text-3xl font-bold text-white">{totalAnalyses}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="text-sm font-medium text-slate-400 mb-1">Average Match Score</div>
          <div className="text-3xl font-bold text-emerald-400">{averageScore}%</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="text-sm font-medium text-slate-400 mb-1">Recent Activity</div>
          <div className="text-3xl font-bold text-white">{recentActivity}</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Recent Analyses</h2>
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        {analyses && analyses.length > 0 ? (
          <ul className="divide-y divide-slate-800">
            {analyses.map((analysis) => (
              <li key={analysis.id}>
                <Link 
                  href={`/dashboard/history/${analysis.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-200 group-hover:text-white transition-colors">
                        {analysis.job_title}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${analysis.match_score >= 80 ? 'text-emerald-400' : analysis.match_score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                        {analysis.match_score}%
                      </div>
                      <div className="text-xs text-slate-500">Match</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <LayoutDashboard className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No analyses yet</h3>
            <p className="text-slate-400 mb-4">Upload your resume and a job description to get started.</p>
            <Link 
              href="/dashboard/analyze" 
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Create your first analysis &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
