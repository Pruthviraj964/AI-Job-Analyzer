"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Target, ScanLine, Briefcase, FileText, Upload, Sparkles, ArrowRight,
  TrendingUp, Star, ChevronRight, CheckCircle2, Circle,
  Map, MessageSquare, ChevronDown
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, PieChart, Pie, Cell
} from "recharts";

// Data for Market Overview multi-line chart
const MARKET_OVERVIEW_DATA = [
  { date: "May 1", "Data Science": 4200, "Machine Learning": 7800, "Data Analyst": 11200, "AI Engineer": 3100 },
  { date: "May 8", "Data Science": 7500, "Machine Learning": 10500, "Data Analyst": 13500, "AI Engineer": 5800 },
  { date: "May 15", "Data Science": 6100, "Machine Learning": 14200, "Data Analyst": 11800, "AI Engineer": 8900 },
  { date: "May 22", "Data Science": 11500, "Machine Learning": 16800, "Data Analyst": 14500, "AI Engineer": 12400 },
  { date: "May 29", "Data Science": 14800, "Machine Learning": 20500, "Data Analyst": 16200, "AI Engineer": 18500 },
];

// Sparkline data
const ATS_SPARK = [
  { v: 40 }, { v: 55 }, { v: 48 }, { v: 62 }, { v: 58 }, { v: 78 }
];
const JOBS_SPARK = [
  { v: 80 }, { v: 95 }, { v: 90 }, { v: 110 }, { v: 105 }, { v: 124 }
];
const SALARY_SPARK = [
  { v: 9 }, { v: 10.5 }, { v: 10 }, { v: 11.8 }, { v: 11.2 }, { v: 12.8 }
];

// Top In-Demand Skills
const TOP_SKILLS = [
  { name: "Python", pct: 94, color: "from-violet-500 to-indigo-500", icon: "🐍" },
  { name: "SQL", pct: 82, color: "from-blue-500 to-cyan-500", icon: "🗄️" },
  { name: "Machine Learning", pct: 78, color: "from-indigo-500 to-purple-500", icon: "🤖" },
  { name: "Power BI", pct: 71, color: "from-cyan-500 to-teal-500", icon: "📊" },
  { name: "AWS", pct: 62, color: "from-amber-500 to-orange-500", icon: "☁️" },
];

// Salary Insights Bar Chart Data
const SALARY_BAR_DATA = [
  { role: "Data Scientist", salary: 22.5, fill: "#7c3aed" },
  { role: "ML Engineer", salary: 18.7, fill: "#6366f1" },
  { role: "Data Analyst", salary: 12.3, fill: "#06b6d4" },
  { role: "AI Engineer", salary: 24.8, fill: "#8b5cf6" },
  { role: "BI Analyst", salary: 14.6, fill: "#a855f7" },
];

// Skill Gap Doughnut Data
const SKILL_GAP_PIE = [
  { name: "Matched", value: 72, color: "#6366f1" },
  { name: "Missing", value: 28, color: "#1e1b4b" },
];

// Trending Skills Ribbon
const TRENDING_SKILLS = [
  { name: "LLMs", growth: "+189%", icon: "🤖" },
  { name: "Vector DB", growth: "+156%", icon: "🗄️" },
  { name: "LangChain", growth: "+134%", icon: "🔗" },
  { name: "MLOps", growth: "+121%", icon: "⚙️" },
  { name: "Prompt Engineering", growth: "+98%", icon: "💬" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [timeFilter, setTimeFilter] = useState("This Month");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Top Action Bar (Buttons under Header) */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/resume"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-purple-500/20 hover:opacity-95 transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Resume
        </Link>
        <Link
          href="/reports"
          className="px-4 py-2.5 rounded-xl bg-[#11162a] border border-white/10 text-gray-200 hover:text-white font-semibold text-xs hover:border-violet-500/40 transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4 text-violet-400" />
          Generate Report
        </Link>
      </div>

      {/* Top 4 KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Market Readiness */}
        <div className="dash-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-violet-400" />
            </div>
            <span className="text-[11px] text-gray-400 font-medium">2.3</span>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1">Market Readiness</div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold text-white">72%</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                ▲ 12%
              </span>
            </div>
            <div className="text-[11px] text-gray-400 mb-3">Good progress!</div>
            {/* Bottom Progress Bar */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: "72%" }} />
            </div>
          </div>
        </div>

        {/* Metric 2: ATS Score */}
        <div className="dash-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ▲ 15
            </span>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1">ATS Score</div>
            <div className="text-3xl font-extrabold text-white mb-1">78<span className="text-lg text-gray-400 font-normal">/100</span></div>
            <div className="text-[11px] text-gray-400">Above Average</div>
          </div>
          {/* Sparkline overlay */}
          <div className="h-10 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ATS_SPARK}>
                <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric 3: Jobs Matched */}
        <div className="dash-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ▲ 23
            </span>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1">Jobs Matched</div>
            <div className="text-3xl font-extrabold text-white mb-1">124</div>
            <div className="text-[11px] text-gray-400">This week</div>
          </div>
          {/* Sparkline overlay */}
          <div className="h-10 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={JOBS_SPARK}>
                <Line type="monotone" dataKey="v" stroke="#a855f7" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metric 4: Avg. Salary Match */}
        <div className="dash-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2">
            <div className="w-11 h-11 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ▲ 18%
            </span>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1">Avg. Salary Match</div>
            <div className="text-3xl font-extrabold text-white mb-1">₹12.8 <span className="text-sm text-gray-400 font-normal">LPA</span></div>
            <div className="text-[11px] text-gray-400">+₹2.1 LPA vs last month</div>
          </div>
          {/* Sparkline overlay */}
          <div className="h-10 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SALARY_SPARK}>
                <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle Grid (Job Market Overview + Top Skills + AI Insights) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Job Market Overview (6 cols) */}
        <div className="lg:col-span-6 dash-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white">Job Market Overview</h3>
            <button className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl hover:text-white transition-colors">
              {timeFilter} <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MARKET_OVERVIEW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradDS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradML" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradDA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip />
                <Area type="monotone" dataKey="Data Science" stroke="#c084fc" fill="url(#gradDS)" strokeWidth={3} />
                <Area type="monotone" dataKey="Machine Learning" stroke="#38bdf8" fill="url(#gradML)" strokeWidth={3} />
                <Area type="monotone" dataKey="Data Analyst" stroke="#34d399" fill="url(#gradDA)" strokeWidth={3} />
                <Area type="monotone" dataKey="AI Engineer" stroke="#fbbf24" fill="url(#gradAI)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-white/5 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span>Data Science</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Machine Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Data Analyst</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>AI Engineer</span>
            </div>
          </div>
        </div>

        {/* Middle Column: Top In-Demand Skills (3 cols) */}
        <div className="lg:col-span-3 dash-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white">Top In-Demand Skills</h3>
            <Link href="/trends" className="text-xs font-semibold text-violet-400 hover:text-violet-300">View all</Link>
          </div>

          <div className="space-y-4 flex-1 justify-center flex flex-col">
            {TOP_SKILLS.map((skill) => (
              <div key={skill.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-gray-200 font-semibold">
                    <span>{skill.icon}</span>
                    <span>{skill.name}</span>
                  </div>
                  <span className="font-bold text-gray-300">{skill.pct}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                    style={{ width: `${skill.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Insights For You (3 cols) */}
        <div className="lg:col-span-3 dash-card p-6 flex flex-col justify-between relative bg-gradient-to-b from-[#111736] to-[#0c1024]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              AI Insights For You <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
          </div>

          {/* Robot mascot card banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-violet-900/30 border border-violet-500/20 relative mb-4">
            <div className="flex items-start gap-3">
              <p className="text-xs text-gray-200 leading-relaxed flex-1">
                Great news! Your Python skills are in high demand. Consider learning AWS and Docker to increase your job opportunities.
              </p>
              <div className="w-16 h-16 relative shrink-0">
                <img
                  src="/ai-robot.png"
                  alt="AI Assistant"
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                />
              </div>
            </div>
            <button className="mt-3 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs hover:bg-violet-500 transition-colors shadow-md shadow-purple-500/30">
              ›
            </button>
          </div>

          {/* Bottom metrics bar */}
          <div className="grid grid-cols-3 gap-2 bg-white/5 border border-white/5 rounded-2xl p-3 text-center">
            <div>
              <div className="text-[10px] text-gray-400">High Demand Role</div>
              <div className="text-xs font-bold text-white mt-0.5">Data Scientist</div>
            </div>
            <div className="border-x border-white/10">
              <div className="text-[10px] text-gray-400">Salary Range</div>
              <div className="text-xs font-bold text-white mt-0.5">₹10L - ₹25L</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400">Growth Rate</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">+32% YoY</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row (Top Job Matches + Skill Gap + Salary Insights + Quick Actions Stack) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Top Job Matches (4 cols) */}
        <div className="lg:col-span-4 dash-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Top Job Matches</h3>
            <Link href="/jobs" className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Job item list */}
          <div className="space-y-3 mb-4">
            {/* Job 1 */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    S
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Senior Data Scientist</h4>
                    <p className="text-xs text-gray-400">Stripe · San Francisco, CA</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  87% Match <Star className="w-3 h-3 fill-emerald-400" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-2 border-t border-white/5">
                <span className="font-semibold text-gray-300">$160k - $210k</span>
                <div className="flex gap-1.5">
                  <span className="bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded text-[10px]">Python</span>
                  <span className="bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded text-[10px]">ML</span>
                  <span className="bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded text-[10px]">PyTorch</span>
                </div>
              </div>
            </div>

            {/* Job 2 */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    M
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Machine Learning Engineer</h4>
                    <p className="text-xs text-gray-400">OpenAI · Remote</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  92% Match <Star className="w-3 h-3 fill-emerald-400" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-2 border-t border-white/5">
                <span className="font-semibold text-gray-300">$140k - $185k</span>
                <div className="flex gap-1.5">
                  <span className="bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded text-[10px]">Python</span>
                  <span className="bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded text-[10px]">LLMs</span>
                  <span className="bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded text-[10px]">PyTorch</span>
                </div>
              </div>
            </div>

            {/* Job 3 */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    D
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Data Analyst</h4>
                    <p className="text-xs text-gray-400">Microsoft · Bangalore</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  76% Match <Star className="w-3 h-3 stroke-emerald-400 fill-none" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-2 border-t border-white/5">
                <span className="font-semibold text-gray-300">₹8L - ₹14L</span>
                <div className="flex gap-1.5">
                  <span className="bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded text-[10px]">SQL</span>
                  <span className="bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded text-[10px]">Power BI</span>
                  <span className="bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded text-[10px]">Excel</span>
                </div>
              </div>
            </div>
          </div>

          <Link href="/jobs" className="text-xs font-semibold text-violet-400 hover:text-violet-300 block text-center">
            Browse all jobs →
          </Link>
        </div>

        {/* Card 2: Skill Gap Analysis (3 cols) */}
        <div className="lg:col-span-3 dash-card p-6 flex flex-col justify-between">
          <h3 className="text-base font-bold text-white mb-4">Skill Gap Analysis</h3>

          <div className="flex items-center gap-4 mb-4">
            {/* Doughnut Chart */}
            <div className="relative w-32 h-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SKILL_GAP_PIE}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={56}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {SKILL_GAP_PIE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-white">72%</span>
                <span className="text-[9px] text-gray-400">Overall Match</span>
              </div>
            </div>

            {/* Missing skills list */}
            <div className="space-y-2 flex-1">
              <div className="text-[10px] text-gray-400 font-semibold mb-1">Missing Skills</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">AWS</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-medium">High</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">Docker</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-medium">High</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">Statistics</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-medium">Medium</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">Tableau</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-medium">Low</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">Advanced SQL</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-medium">Low</span>
              </div>
            </div>
          </div>

          <Link href="/skill-gap" className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-violet-300 hover:text-white font-semibold text-xs text-center block hover:border-violet-500/40 transition-all">
            View Full Analysis →
          </Link>
        </div>

        {/* Card 3: Salary Insights (3 cols) */}
        <div className="lg:col-span-3 dash-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Salary Insights</h3>
            <button className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              This Month <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Bar Chart */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALARY_BAR_DATA} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="role" tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}L`} />
                <Tooltip formatter={(v) => [`${v}L`, "Salary"]} />
                <Bar dataKey="salary" radius={[6, 6, 0, 0]}>
                  {SALARY_BAR_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Salary Stats */}
          <div className="pt-3 border-t border-white/5">
            <div className="text-[10px] text-gray-400">Average Salary Range</div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-extrabold text-white">₹12L - ₹25L</span>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                ▲ 18% <span className="text-gray-400 font-normal">vs last month</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Actions & Resume Stack (2 cols) */}
        <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
          {/* Quick Actions Grid */}
          <div className="dash-card p-4">
            <div className="text-xs font-bold text-white mb-3">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/skill-gap" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center text-center transition-all">
                <div className="w-7 h-7 rounded-xl bg-purple-600/30 flex items-center justify-center mb-1.5">
                  <Target className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="text-[10px] font-medium text-gray-200">Run Skill Gap</span>
              </Link>
              <Link href="/ats" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center text-center transition-all">
                <div className="w-7 h-7 rounded-xl bg-blue-600/30 flex items-center justify-center mb-1.5">
                  <ScanLine className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-[10px] font-medium text-gray-200">ATS Checker</span>
              </Link>
              <Link href="/chat" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center text-center transition-all">
                <div className="w-7 h-7 rounded-xl bg-pink-600/30 flex items-center justify-center mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <span className="text-[10px] font-medium text-gray-200">AI Chat</span>
              </Link>
              <Link href="/roadmap" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center text-center transition-all">
                <div className="w-7 h-7 rounded-xl bg-cyan-600/30 flex items-center justify-center mb-1.5">
                  <Map className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <span className="text-[10px] font-medium text-gray-200">Roadmap</span>
              </Link>
            </div>
          </div>

          {/* Resume Analysis */}
          <div className="dash-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-white">Resume Analysis</div>
              <span className="text-[10px] font-semibold text-violet-400">72% Complete</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: "72%" }} />
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Skills Extracted</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Experience Parsed</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Circle className="w-3.5 h-3.5 text-gray-500" />
                <span>ATS Optimization</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Row: 🔥 Trending Skills */}
      <div className="dash-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white">🔥 Trending Skills</span>
            <span className="text-xs text-gray-400 font-normal">Based on current job market</span>
          </div>
          <button className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TRENDING_SKILLS.map((skill) => (
            <div key={skill.name} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-violet-500/30 transition-all">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{skill.icon}</span>
                <span className="text-xs font-bold text-white">{skill.name}</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">{skill.growth}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
