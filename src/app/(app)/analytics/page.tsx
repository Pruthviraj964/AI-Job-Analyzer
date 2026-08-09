"use client";
import { useState } from "react";
import { BarChart3, TrendingUp, Users, Briefcase, Activity, Globe, DollarSign } from "lucide-react";
import { SKILL_TRENDS, SALARY_DATA, JOBS } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, ScatterChart, Scatter
} from "recharts";

const COLORS = ["#7c3aed", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#14b8a6", "#8b5cf6"];

export default function AnalyticsPage() {
  const [period] = useState("Last 12 months");

  // Salary by role data
  const salaryByRole = Object.entries(SALARY_DATA).map(([role, data]) => ({
    role: role.replace("Machine Learning", "ML").replace("Engineer", "Eng.").replace("Scientist", "Sci.").replace("Research", "Res."),
    mid: Math.round((data.mid[0] + data.mid[1]) / 2),
    senior: Math.round((data.senior[0] + data.senior[1]) / 2),
  })).sort((a, b) => b.senior - a.senior);

  // Job type distribution
  const jobTypeData = [
    { name: "Hybrid", value: JOBS.filter(j => j.type === "hybrid").length },
    { name: "Remote", value: JOBS.filter(j => j.type === "remote").length },
    { name: "On-site", value: JOBS.filter(j => j.type === "onsite").length },
  ];

  // Top growing skills
  const topSkills = SKILL_TRENDS.sort((a, b) => b.growthRate - a.growthRate).slice(0, 8).map(t => ({
    skill: t.skill,
    growth: t.growthRate,
    mentions: Math.round(t.totalMentions / 1000),
  }));

  // Market activity over time (simulated)
  const marketActivity = SKILL_TRENDS[0].trend.map((d, i) => ({
    month: d.month,
    postings: Math.round(3200 + i * 180 + (Math.random() - 0.5) * 300),
    applications: Math.round(18000 + i * 800 + (Math.random() - 0.5) * 2000),
  }));

  // Industry distribution
  const industryDist = [
    { name: "AI/ML", count: 8, color: "#7c3aed" },
    { name: "FinTech", count: 5, color: "#10b981" },
    { name: "Technology", count: 12, color: "#3b82f6" },
    { name: "Media/Tech", count: 4, color: "#f59e0b" },
    { name: "Data/Tech", count: 6, color: "#ec4899" },
    { name: "Other", count: 9, color: "#6b7280" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* KPI bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Postings", value: "48,200+", icon: Briefcase, color: "#7c3aed" },
          { label: "Skills Tracked", value: "350+", icon: TrendingUp, color: "#10b981" },
          { label: "Avg. ML Engineer Salary", value: "$155k", icon: DollarSign, color: "#3b82f6" },
          { label: "YoY LLM Demand Growth", value: "+187%", icon: Activity, color: "#f59e0b" },
        ].map(k => (
          <div key={k.label} className="glass rounded-2xl p-4 border border-white/8">
            <div className="flex items-center justify-between mb-2">
              <k.icon className="w-4 h-4" style={{ color: k.color }} />
              <span className="text-xs text-gray-500">{period}</span>
            </div>
            <div className="text-2xl font-black mb-1" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs text-gray-500">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market activity */}
        <div className="glass rounded-2xl p-5 border border-white/8">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-400" /> Market Activity (12 months)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={marketActivity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 10 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", fontSize: "11px", color: "#f9fafb" }} />
              <Line type="monotone" dataKey="postings" stroke="#7c3aed" dot={false} strokeWidth={2} name="New Postings" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Job type pie */}
        <div className="glass rounded-2xl p-5 border border-white/8">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" /> Work Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={jobTypeData} cx="50%" cy="50%" outerRadius={75} innerRadius={35} paddingAngle={3} dataKey="value">
                {jobTypeData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", fontSize: "11px", color: "#f9fafb" }} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top growing skills bar */}
        <div className="glass rounded-2xl p-5 border border-white/8">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Fastest Growing Skills (YoY %)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topSkills} layout="vertical" margin={{ top: 0, right: 20, left: 70, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} tickFormatter={v => `+${v}%`} />
              <YAxis type="category" dataKey="skill" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", fontSize: "11px", color: "#f9fafb" }} formatter={(v: any) => [`+${v}%`, "Growth"]} />
              <Bar dataKey="growth" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Salary by role */}
        <div className="glass rounded-2xl p-5 border border-white/8">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" /> Salary by Role — Mid vs Senior ($k)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salaryByRole} margin={{ top: 0, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="role" tick={{ fill: "#9ca3af", fontSize: 9 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", fontSize: "11px", color: "#f9fafb" }} formatter={(v: any) => [`$${(Number(v) / 1000).toFixed(0)}k`]} />
              <Bar dataKey="mid" name="Mid" fill="#7c3aed" radius={[2, 2, 0, 0]} />
              <Bar dataKey="senior" name="Senior" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Industry distribution */}
      <div className="glass rounded-2xl p-5 border border-white/8">
        <h3 className="font-bold mb-4">Postings by Industry</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {industryDist.map(ind => (
            <div key={ind.name} className="text-center p-3 rounded-xl bg-white/3 border border-white/5">
              <div className="text-xl font-black mb-1" style={{ color: ind.color }}>{ind.count}</div>
              <div className="text-xs text-gray-400">{ind.name}</div>
              <div className="h-1 rounded-full mt-2" style={{ background: `${ind.color}40` }}>
                <div className="h-full rounded-full" style={{ width: `${(ind.count / 12) * 100}%`, background: ind.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
