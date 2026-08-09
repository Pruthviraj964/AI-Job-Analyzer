"use client";
import { useState } from "react";
import {
  Map, Clock, BookOpen, Target, Flame, Sparkles, ChevronDown, ArrowRight,
  TrendingUp, Code, CheckCircle2, Circle, Database, Brain, BarChart2, Layers
} from "lucide-react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import { generateRoadmap } from "@/lib/ai";
import { RoadmapPhase } from "@/types";
import toast from "react-hot-toast";

const ROLES = ["Data Scientist", "Machine Learning Engineer", "Data Analyst", "AI Engineer"];
const EXP_LEVELS = ["Entry Level (0-2 yrs)", "Mid Level (2-5 yrs)", "Senior Level (5+ yrs)"];

const RADAR_DATA = [
  { subject: "Technical Skills", A: 88, fullMark: 100 },
  { subject: "Problem Solving", A: 68, fullMark: 100 },
  { subject: "Communication", A: 60, fullMark: 100 },
  { subject: "Tools & Tech", A: 75, fullMark: 100 },
  { subject: "Domain Knowledge", A: 65, fullMark: 100 },
];

const DEFAULT_PHASES: RoadmapPhase[] = [
  {
    phase: 1,
    title: "Foundation",
    duration: "1-2 Weeks",
    skills: [
      { skill: "Python Basics", resourceType: "course", estimatedHours: 12, priority: "critical" },
      { skill: "Statistics Essentials", resourceType: "course", estimatedHours: 15, priority: "critical" },
      { skill: "Data Manipulation", resourceType: "project", estimatedHours: 18, priority: "high" },
    ],
  },
  {
    phase: 2,
    title: "Core Skills",
    duration: "3-6 Weeks",
    skills: [
      { skill: "Machine Learning", resourceType: "course", estimatedHours: 25, priority: "critical" },
      { skill: "SQL & Databases", resourceType: "course", estimatedHours: 20, priority: "high" },
      { skill: "Data Visualization", resourceType: "project", estimatedHours: 15, priority: "medium" },
    ],
  },
  {
    phase: 3,
    title: "Advanced",
    duration: "7-12 Weeks",
    skills: [
      { skill: "Deep Learning", resourceType: "course", estimatedHours: 30, priority: "high" },
      { skill: "Feature Engineering", resourceType: "project", estimatedHours: 20, priority: "high" },
      { skill: "Model Evaluation", resourceType: "course", estimatedHours: 15, priority: "medium" },
    ],
  },
  {
    phase: 4,
    title: "Specialization",
    duration: "13+ Weeks",
    skills: [
      { skill: "NLP / Computer Vision", resourceType: "course", estimatedHours: 35, priority: "high" },
      { skill: "MLOps Basics", resourceType: "project", estimatedHours: 25, priority: "medium" },
      { skill: "Real World Projects", resourceType: "project", estimatedHours: 40, priority: "critical" },
    ],
  },
];

export default function RoadmapPage() {
  const [targetRole, setTargetRole] = useState("Data Scientist");
  const [expLevel, setExpLevel] = useState("Mid Level (2-5 yrs)");
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [phases, setPhases] = useState<RoadmapPhase[]>(DEFAULT_PHASES);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const newRoadmap = await generateRoadmap(targetRole, expLevel, hoursPerWeek);
      setPhases(newRoadmap);
      toast.success("Personalized Roadmap Generated via OpenRouter AI!");
    } catch (e) {
      toast.error("Failed to generate roadmap");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Welcome back, Demo 👋
        </h1>
        <p className="text-xs text-gray-400 mt-1">Craft your path. Achieve your career goals.</p>
      </div>

      {/* Top 4 KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Learning Hours */}
        <div className="dash-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-gray-500 hover:text-white cursor-pointer" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1">Total Learning Hours</div>
            <div className="text-3xl font-extrabold text-white mb-1">48h</div>
            <div className="text-[11px] text-purple-400 font-medium">+12% this week</div>
          </div>
        </div>

        {/* Metric 2: Skills to Learn */}
        <div className="dash-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1">Skills to Learn</div>
            <div className="text-3xl font-extrabold text-white mb-1">14</div>
            <div className="text-[11px] text-blue-400 font-medium">3 in progress</div>
          </div>
        </div>

        {/* Metric 3: Weekly Goal */}
        <div className="dash-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1">Weekly Goal</div>
            <div className="text-3xl font-extrabold text-white mb-2">
              10h <span className="text-base font-normal text-gray-400">/ 15h</span>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "66%" }} />
            </div>
          </div>
        </div>

        {/* Metric 4: Streak */}
        <div className="dash-card p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium mb-1">Streak</div>
            <div className="text-3xl font-extrabold text-white mb-1">7 Days</div>
            <div className="text-[11px] text-amber-400 font-medium">Keep it up!</div>
          </div>
        </div>
      </div>

      {/* Middle Grid (Roadmap Generator + Career Snapshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Card: Learning Roadmap Generator */}
        <div className="lg:col-span-8 dash-card p-6 md:p-8 relative overflow-hidden flex flex-col justify-between bg-gradient-to-r from-[#0d102a] via-[#0b0e24] to-[#070919]">
          
          <div className="relative z-10 max-w-[62%]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">Learning Roadmap Generator</h2>
                <p className="text-xs text-gray-400 mt-0.5">Customize your roadmap and get a personalized learning plan.</p>
              </div>
            </div>

            {/* Select Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Target Role</label>
                <div className="relative">
                  <select
                    className="w-full bg-[#111536] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-purple-500"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r} className="bg-[#0b0e24] text-white">
                        {r}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Experience Level</label>
                <div className="relative">
                  <select
                    className="w-full bg-[#111536] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-purple-500"
                    value={expLevel}
                    onChange={(e) => setExpLevel(e.target.value)}
                  >
                    {EXP_LEVELS.map((e) => (
                      <option key={e} value={e} className="bg-[#0b0e24] text-white">
                        {e}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Learning Hours Slider */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-400 font-medium">Learning Hours / Week</span>
                <span className="bg-[#151940] border border-white/10 text-white font-bold px-2.5 py-0.5 rounded-lg text-xs">
                  {hoursPerWeek}h
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="5"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                <span>5h</span>
                <span>20h</span>
                <span>40h</span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-purple-500/30 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              {generating ? "Generating AI Roadmap..." : "Generate My Roadmap"}
            </button>
          </div>

          {/* Right Winding Graphic / Illustration overlay */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[34%] h-[85%] pointer-events-none hidden md:block">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 240">
              <defs>
                <linearGradient id="roadGrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              {/* Spline Path */}
              <path
                d="M 180 220 C 130 180, 50 160, 100 110 C 150 60, 160 30, 120 10"
                fill="none"
                stroke="url(#roadGrad)"
                strokeWidth="28"
                strokeLinecap="round"
              />
              <path
                d="M 180 220 C 130 180, 50 160, 100 110 C 150 60, 160 30, 120 10"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
            {/* Target Flag Badge */}
            <div className="absolute top-[5%] left-[45%] w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Target className="w-4 h-4 text-rose-400" />
            </div>
            {/* Code Badge */}
            <div className="absolute top-[40%] right-[10%] w-9 h-9 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Code className="w-4 h-4 text-blue-300" />
            </div>
            {/* Chart Badge */}
            <div className="absolute bottom-[30%] left-[20%] w-9 h-9 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BarChart2 className="w-4 h-4 text-purple-300" />
            </div>
          </div>
        </div>

        {/* Right Card: Career Snapshot */}
        <div className="lg:col-span-4 dash-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" /> Career Snapshot
              </h3>
              <button className="flex items-center gap-1 text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                This Week <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Radar Chart */}
            <div className="h-56 w-full relative -my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 9 }} />
                  <Radar name="Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Feedback Box */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white">Keep learning!</div>
              <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">
                You&apos;re improving steadily. Focus on communication to grow even more.
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row Grid (Roadmap Preview + Recommended Skills) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Your Roadmap Preview (8 cols) */}
        <div className="lg:col-span-8 dash-card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">▶</span> Your Roadmap Preview
            </h3>
            <button className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View Full Roadmap <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4-Phase Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
            {phases.map((p, idx) => (
              <div key={p.phase} className="relative space-y-3">
                {/* Phase Badge Header */}
                <div>
                  <div className="text-xs font-bold text-emerald-400 mb-0.5">{p.title}</div>
                  <div className="text-[11px] text-gray-400">{p.duration}</div>
                </div>

                {/* Phase Number Circle */}
                <div className="relative flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      idx === 0
                        ? "bg-emerald-500 shadow-md shadow-emerald-500/30"
                        : idx === 1
                        ? "bg-blue-600 shadow-md shadow-blue-600/30"
                        : idx === 2
                        ? "bg-purple-600 shadow-md shadow-purple-600/30"
                        : "bg-amber-600 shadow-md shadow-amber-600/30"
                    }`}
                  >
                    0{p.phase}
                  </div>
                  {/* Connecting Line */}
                  {idx < phases.length - 1 && (
                    <div className="flex-1 h-[2px] bg-white/10 mx-2" />
                  )}
                </div>

                {/* Bullets List */}
                <div className="space-y-1.5 pt-1">
                  {p.skills.map((s, si) => (
                    <div key={si} className="text-xs text-gray-300 flex items-center gap-1.5">
                      <span className="text-gray-500 text-[10px]">•</span>
                      <span>{s.skill}</span>
                    </div>
                  ))}
                </div>

                {/* Status Tag */}
                <div className="pt-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      idx === 0
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/5 text-gray-400"
                    }`}
                  >
                    {idx === 0 ? "In Progress" : "Upcoming"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recommended Skills (4 cols) */}
        <div className="lg:col-span-4 dash-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-white">Recommended Skills</h3>
              <span className="text-xs font-semibold text-purple-400 cursor-pointer hover:text-purple-300">View All</span>
            </div>

            <div className="space-y-5">
              {/* Skill 1 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-white font-medium">
                    <div className="w-7 h-7 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400">
                      <Brain className="w-3.5 h-3.5" />
                    </div>
                    <span>Machine Learning</span>
                  </div>
                  <span className="font-bold text-gray-300">78%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "78%" }} />
                </div>
              </div>

              {/* Skill 2 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-white font-medium">
                    <div className="w-7 h-7 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                      <Database className="w-3.5 h-3.5" />
                    </div>
                    <span>SQL</span>
                  </div>
                  <span className="font-bold text-gray-300">65%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              {/* Skill 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-white font-medium">
                    <div className="w-7 h-7 rounded-xl bg-amber-600/20 flex items-center justify-center text-amber-400">
                      <Code className="w-3.5 h-3.5" />
                    </div>
                    <span>Python</span>
                  </div>
                  <span className="font-bold text-gray-300">92%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>

              {/* Skill 4 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-white font-medium">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                      <BarChart2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Data Visualization</span>
                  </div>
                  <span className="font-bold text-gray-300">60%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
