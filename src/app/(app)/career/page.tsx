"use client";
import { useState, useEffect } from "react";
import { Compass, Loader2, ChevronRight, TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { runCareerRecommendations } from "@/lib/ai";
import { CareerRecommendation } from "@/types";
import { scoreColor, formatSalary } from "@/lib/utils";
import Link from "next/link";

export default function CareerPage() {
  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<CareerRecommendation[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    if (!profile) return;
    setLoading(true);
    const results = await runCareerRecommendations(profile.currentRole, profile.skills);
    setRecs(results);
    setLoading(false);
    setLoaded(true);
  };

  useEffect(() => { load(); }, []);

  const trendIcon = (t: string) =>
    t === "rising" ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> :
    t === "declining" ? <TrendingDown className="w-3.5 h-3.5 text-red-400" /> :
    <Minus className="w-3.5 h-3.5 text-gray-400" />;

  const trendColor = (t: string) =>
    t === "rising" ? "text-emerald-400" : t === "declining" ? "text-red-400" : "text-gray-400";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Career Recommendation Engine</h2>
          <p className="text-sm text-gray-400 mt-1">Personalized next-step roles based on your current profile and market patterns</p>
        </div>
        <button onClick={load} disabled={loading} className="btn btn-ghost text-sm">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "↻ Refresh"}
        </button>
      </div>

      {/* Current position */}
      {profile && (
        <div className="glass rounded-2xl p-4 border border-white/8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Your current position</div>
            <div className="font-bold">{profile.currentRole || "—"}</div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-600 mx-2" />
          <div>
            <div className="text-sm text-gray-400">Exploring paths to</div>
            <div className="font-bold text-violet-400">{profile.targetRole || "next role"}</div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center py-16 text-center">
          <Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-4" />
          <div className="font-bold">Analyzing career transition patterns...</div>
          <div className="text-sm text-gray-400 mt-1">Comparing your profile against thousands of successful transitions</div>
        </div>
      )}

      {loaded && recs.length > 0 && (
        <div className="space-y-4 animate-slide-up">
          <p className="text-xs text-gray-500">Recommendations ranked by feasibility score · Based on your skill profile and market transition data</p>
          {recs.map((rec, i) => (
            <div key={rec.role} className="glass rounded-2xl p-5 border border-white/8 card-hover">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{rec.role}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{rec.rationale}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-black" style={{ color: scoreColor(rec.feasibilityScore) }}>
                    {rec.feasibilityScore}%
                  </div>
                  <div className="text-xs text-gray-500">feasible</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Salary Range</div>
                  <div className="font-bold text-sm">{formatSalary(rec.salaryRange.min)}–{formatSalary(rec.salaryRange.max)}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Market Demand</div>
                  <div className={`font-bold text-sm flex items-center gap-1 ${trendColor(rec.demandTrend)}`}>
                    {trendIcon(rec.demandTrend)} {rec.demandTrend}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Skill Gaps</div>
                  <div className="font-bold text-sm">{rec.skillGapCount} skills</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Transition Time</div>
                  <div className="font-bold text-sm">{rec.transitionTime}</div>
                </div>
              </div>

              {/* Feasibility bar */}
              <div className="mb-4">
                <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${rec.feasibilityScore}%`, background: `linear-gradient(90deg, ${scoreColor(rec.feasibilityScore)}, ${scoreColor(Math.min(100, rec.feasibilityScore + 15))})` }} />
                </div>
              </div>

              <Link href={`/skill-gap?role=${encodeURIComponent(rec.role)}`} className="btn btn-secondary text-sm">
                Analyze Skill Gap for this Role <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
