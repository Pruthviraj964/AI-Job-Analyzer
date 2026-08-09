"use client";
import { useState } from "react";
import {
  ScanLine, Loader2, Upload, FileText, Sparkles, TrendingUp, Search, User,
  CheckCircle2, AlertCircle, ArrowRight
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useAppStore } from "@/lib/store/app";
import { runATSScore } from "@/lib/ai";
import { ATSReport } from "@/types";
import { scoreColor, priorityColor } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ATSPage() {
  const { resumeData, addReport } = useAppStore();
  const [jobDescription, setJobDescription] = useState("");
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<ATSReport | null>(null);

  const handleRun = async () => {
    const candidateSkills = resumeData?.skills || [
      "Python", "SQL", "Tableau", "Statistics", "A/B Testing", "Machine Learning", "pandas", "numpy"
    ];

    setRunning(true);
    try {
      const result = await runATSScore(candidateSkills, jobDescription || undefined);
      setReport(result);
      addReport({
        type: "ats_score",
        title: "ATS Score Analysis",
        summary: `Overall score: ${result.overallScore}/100. ${result.remediations.filter((r) => r.priority === "critical").length} critical issues found.`,
        score: result.overallScore,
        payload: result as unknown as Record<string, unknown>,
      });
      toast.success(`ATS Analysis Complete: ${result.overallScore}/100`);
    } catch (err) {
      toast.error("Failed to run ATS analysis");
    } finally {
      setRunning(false);
    }
  };

  const subScores = report
    ? [
        { name: "Formatting", value: report.scores.formatting, color: "#8b5cf6" },
        { name: "Keywords", value: report.scores.keywords, color: "#3b82f6" },
        { name: "Sections", value: report.scores.sections, color: "#10b981" },
        { name: "Readability", value: report.scores.readability, color: "#f59e0b" },
      ]
    : [];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Top Banner (No Resume Uploaded Warning) */}
      {!resumeData ? (
        <div className="rounded-2xl p-5 border border-amber-500/30 bg-[#120f17] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-400 mb-0.5">No resume uploaded yet.</h3>
              <p className="text-xs text-gray-400">Upload your resume to run ATS scoring and get personalized insights.</p>
            </div>
          </div>
          <Link
            href="/resume"
            className="px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-semibold text-xs transition-all flex items-center gap-2 shrink-0"
          >
            <Upload className="w-4 h-4" />
            Upload Resume
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl p-5 border border-emerald-500/30 bg-[#0a1715] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-emerald-400 mb-0.5">Resume Uploaded: {resumeData.name}</h3>
              <p className="text-xs text-gray-400">{resumeData.skills?.length || 0} skills extracted • Ready for ATS scoring</p>
            </div>
          </div>
          <Link
            href="/resume"
            className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-2 shrink-0"
          >
            <Upload className="w-4 h-4" />
            Change Resume
          </Link>
        </div>
      )}

      {/* Main Grid: ATS Generator Card + What is ATS Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Card: ATS Score Generator */}
        <div className="lg:col-span-8 dash-card p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-5">
              <ScanLine className="w-6 h-6 text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">ATS Score Generator</h2>
            <p className="text-xs text-gray-400 mb-6">Paste a target job description for keyword-match scoring (optional)</p>

            <div className="relative mb-6">
              <textarea
                className="w-full bg-[#080b21]/90 border border-white/10 rounded-2xl p-5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none h-64 leading-relaxed"
                maxLength={5000}
                placeholder={`Paste a job description here to get keyword-match scoring...\n\n(leave blank for general ATS compatibility check)`}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="absolute right-5 bottom-4 text-[11px] text-gray-500 font-mono">
                {jobDescription.length}/5000
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleRun}
              disabled={running}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/25 hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2.5"
            >
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Running ATS Simulation...
                </>
              ) : (
                <>
                  <ScanLine className="w-4 h-4" /> Generate ATS Score
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Card: What is ATS Score? */}
        <div className="lg:col-span-4 dash-card p-6 md:p-8 flex flex-col justify-between bg-gradient-to-b from-[#0e112d] to-[#070919]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              What is ATS Score? <Sparkles className="w-4 h-4 text-violet-400" />
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              ATS (Applicant Tracking System) score predicts how well your resume matches job requirements and ranks in recruiter screening.
            </p>

            <div className="space-y-5 pt-5 border-t border-white/5">
              {/* Item 1 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4.5 h-4.5 text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-gray-200">Improves shortlisting chances</span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Search className="w-4.5 h-4.5 text-amber-400" />
                </div>
                <span className="text-xs font-semibold text-gray-200">Highlights missing keywords & skills</span>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <User className="w-4.5 h-4.5 text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-gray-200">Increases interview opportunities</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* AI Analysis Output Section */}
      {report && (
        <div className="space-y-6 animate-slide-up pt-4">
          <div className="dash-card p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">ATS Analysis Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Overall radial score */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5">
                <div className="relative w-36 h-36 mb-3">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke={scoreColor(report.overallScore)}
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - report.overallScore / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black" style={{ color: scoreColor(report.overallScore) }}>
                      {report.overallScore}
                    </span>
                    <span className="text-xs text-gray-400">/ 100</span>
                  </div>
                </div>
                <div className="font-bold text-sm text-center text-white">
                  {report.overallScore >= 80 ? "🟢 Strong ATS Profile" : report.overallScore >= 60 ? "🟡 Needs Improvement" : "🔴 High Risk of Rejection"}
                </div>
              </div>

              {/* Sub-scores */}
              <div className="md:col-span-7 space-y-4">
                {subScores.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-gray-300">{s.name}</span>
                      <span style={{ color: s.color }}>{s.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${s.value}%`, background: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Remediation checklist */}
          <div className="dash-card p-6 border border-white/10">
            <h3 className="text-base font-bold text-white mb-4">
              Remediation Checklist ({report.remediations.length} items)
            </h3>
            <div className="space-y-3">
              {report.remediations.map((r, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border transition-all"
                  style={{
                    borderColor: `${priorityColor(r.priority)}30`,
                    background: `${priorityColor(r.priority)}08`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ background: `${priorityColor(r.priority)}25`, color: priorityColor(r.priority) }}
                    >
                      {r.priority}
                    </span>
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{r.category}</div>
                      <div className="font-semibold text-xs text-white mb-1">{r.issue}</div>
                      <div className="text-xs text-gray-300">
                        <span className="text-emerald-400 font-semibold">Fix: </span>
                        {r.fix}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
