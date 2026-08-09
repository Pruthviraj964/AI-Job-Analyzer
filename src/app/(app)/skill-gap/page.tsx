"use client";
import { useState } from "react";
import { Target, Loader2, CheckCircle, AlertCircle, TrendingUp, Map, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useAppStore } from "@/lib/store/app";
import { runSkillGapAnalysis } from "@/lib/ai";
import { SkillGapReport } from "@/types";
import { priorityColor, scoreColor } from "@/lib/utils";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import Link from "next/link";
import toast from "react-hot-toast";

const ROLES = ["Data Scientist", "Machine Learning Engineer", "Data Engineer", "NLP Engineer", "MLOps Engineer", "AI Research Scientist"];

export default function SkillGapPage() {
  const { profile } = useAuthStore();
  const { addReport } = useAppStore();
  const [targetRole, setTargetRole] = useState(profile?.targetRole || "Data Scientist");
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<SkillGapReport | null>(null);

  const handleRun = async () => {
    if (!profile?.skills?.length) {
      toast.error("Please add your skills in Profile settings first");
      return;
    }
    setRunning(true);
    try {
      const result = await runSkillGapAnalysis(profile.skills, targetRole, profile.location);
      setReport(result);
      addReport({
        type: "skill_gap",
        title: `Skill Gap — ${targetRole}`,
        summary: `Market readiness: ${result.marketReadiness}%. ${result.missingSkills.length} gaps identified.`,
        score: result.marketReadiness,
        payload: result as unknown as Record<string, unknown>,
      });
      toast.success("Analysis complete!");
    } finally {
      setRunning(false);
    }
  };

  const radarData = report ? [
    ...report.matchedSkills.slice(0, 4).map(s => ({ skill: s.skill, you: 80, market: 75 })),
    ...report.missingSkills.slice(0, 3).map(s => ({ skill: s.skill, you: 10, market: s.demandScore })),
  ] : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Config panel */}
      <div className="glass rounded-2xl p-6 border border-white/8">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-violet-400" /> AI Skill Gap Analyzer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Your Current Skills</label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-white/5 border border-white/8 min-h-12">
              {profile?.skills?.slice(0, 8).map(s => (
                <span key={s} className="text-xs px-2 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">{s}</span>
              )) || <span className="text-xs text-gray-600">No skills yet — add in Profile</span>}
              {profile?.skills && profile.skills.length > 8 && <span className="text-xs text-gray-500">+{profile.skills.length - 8} more</span>}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Target Role</label>
            <select className="input" value={targetRole} onChange={e => setTargetRole(e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handleRun} disabled={running} className="btn btn-primary">
          {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing market data...</> : <><Target className="w-4 h-4" /> Run Skill Gap Analysis</>}
        </button>
        {running && <p className="text-xs text-gray-500 mt-2">Comparing your skills against {Math.floor(Math.random() * 2000 + 1000).toLocaleString()} job postings for {targetRole}...</p>}
      </div>

      {/* Results */}
      {report && (
        <div className="space-y-6 animate-slide-up">
          {/* Readiness score */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg">Market Readiness Score</h3>
                <p className="text-sm text-gray-400">Based on {report.targetRole} job postings</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="45"
                      stroke={scoreColor(report.marketReadiness)} strokeWidth="8" fill="none" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - report.marketReadiness / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black" style={{ color: scoreColor(report.marketReadiness) }}>{report.marketReadiness}%</span>
                    <span className="text-xs text-gray-500">ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar chart */}
            {radarData.length > 0 && (
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <Radar name="You" dataKey="you" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
                  <Radar name="Market" dataKey="market" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Skill gaps */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Priority Skill Gaps ({report.missingSkills.length})
            </h3>
            <div className="space-y-3">
              {report.missingSkills.map((gap) => (
                <div key={gap.skill} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: priorityColor(gap.priority) }} />
                    <div>
                      <span className="font-medium text-sm">{gap.skill}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">⏱ {gap.timeToLearn}</span>
                        <span className="text-xs text-emerald-400">+${(gap.salaryImpact / 1000).toFixed(0)}k salary impact</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Market demand</div>
                      <div className="flex items-center gap-1">
                        <div className="w-20 h-1.5 rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500" style={{ width: `${gap.demandScore}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{gap.demandScore}%</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize" style={{ background: `${priorityColor(gap.priority)}20`, color: priorityColor(gap.priority) }}>
                      {gap.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matched skills */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Skills You Already Have ({report.matchedSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.matchedSkills.map((s) => (
                <span key={s.skill} className={`text-sm px-3 py-1.5 rounded-full border ${s.strength === "strong" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                  ✓ {s.skill}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link href="/roadmap" className="flex items-center justify-between glass rounded-2xl p-5 border border-violet-500/20 bg-violet-500/5 card-hover group">
            <div className="flex items-center gap-3">
              <Map className="w-6 h-6 text-violet-400" />
              <div>
                <div className="font-bold">Generate Learning Roadmap</div>
                <div className="text-sm text-gray-400">Turn these gaps into a phased, prioritized action plan</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-violet-400 transition-colors" />
          </Link>
        </div>
      )}
    </div>
  );
}
