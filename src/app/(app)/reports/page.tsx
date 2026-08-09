"use client";
import { FileBarChart, Target, ScanLine, DollarSign, Map, Download, Trash2 } from "lucide-react";
import { useAppStore } from "@/lib/store/app";
import { timeAgo, scoreColor } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

const TYPE_META: Record<string, { icon: React.ElementType; color: string; label: string; href: string }> = {
  skill_gap: { icon: Target, color: "#7c3aed", label: "Skill Gap", href: "/skill-gap" },
  ats_score: { icon: ScanLine, color: "#3b82f6", label: "ATS Score", href: "/ats" },
  salary_prediction: { icon: DollarSign, color: "#10b981", label: "Salary", href: "/salary" },
  roadmap: { icon: Map, color: "#f59e0b", label: "Roadmap", href: "/roadmap" },
};

export default function ReportsPage() {
  const { reports } = useAppStore();

  if (reports.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
            <FileBarChart className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">No reports yet</h2>
          <p className="text-gray-400 mb-6">Run an AI analysis — Skill Gap, ATS Score, or Salary Prediction — to generate your first report.</p>
          <div className="flex gap-3">
            <Link href="/skill-gap" className="btn btn-primary">Run Skill Gap</Link>
            <Link href="/ats" className="btn btn-ghost">Check ATS</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Reports History</h2>
          <p className="text-sm text-gray-400 mt-1">{reports.length} reports generated · Stored locally</p>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map((report) => {
          const meta = TYPE_META[report.type] || TYPE_META.skill_gap;
          return (
            <div key={report.id} className="glass rounded-2xl p-5 border border-white/8 card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}30` }}>
                    <meta.icon className="w-5 h-5" style={{ color: meta.color }} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${meta.color}15`, color: meta.color }}>{meta.label}</span>
                      {report.score !== undefined && (
                        <span className="text-sm font-bold" style={{ color: scoreColor(report.score) }}>{report.score}/100</span>
                      )}
                    </div>
                    <div className="font-semibold truncate">{report.title}</div>
                    <div className="text-sm text-gray-400 mt-0.5 truncate">{report.summary}</div>
                    <div className="text-xs text-gray-600 mt-1">{timeAgo(report.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toast.success("Download coming in Pro tier!")} className="p-2 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                  <Link href={meta.href} className="btn btn-ghost text-xs py-1.5">View →</Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
