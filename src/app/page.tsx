"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Brain, TrendingUp, Target, FileText, BarChart3, MessageSquare,
  Zap, Shield, Users, Star, ArrowRight, CheckCircle, ChevronRight,
  Activity, Sparkles, LineChart, Layers, Box, ChevronDown, BookOpen
} from "lucide-react";

const FEATURES = [
  { icon: Target, title: "AI Skill Gap Analyzer", desc: "Quantify exactly where you stand against your target role with demand-weighted gap scoring.", color: "#818cf8", tag: "AI-Powered" },
  { icon: FileText, title: "ATS Score Generator", desc: "Simulate how any ATS system scores your resume and get an itemized remediation checklist.", color: "#3b82f6", tag: "Instant" },
  { icon: TrendingUp, title: "Skill Trend Analyzer", desc: "Track rising and falling skill demand across 150+ roles with 12 months of trend history.", color: "#10b981", tag: "Real Data" },
  { icon: BarChart3, title: "Salary Prediction", desc: "ML-powered salary range predictions adjusted for role, geography, experience, and skills.", color: "#f59e0b", tag: "ML Model" },
  { icon: Brain, title: "Learning Roadmap", desc: "LLM-generated, phased learning plans grounded in your specific skill gaps — not generic advice.", color: "#ec4899", tag: "Generative AI" },
  { icon: MessageSquare, title: "AI Chat Assistant", desc: "Ask any career question. Get data-backed answers from 48,000+ job postings via RAG.", color: "#14b8a6", tag: "RAG" },
];

const SKILL_BARS = [
  { name: "SQL", pct: 92 },
  { name: "Python", pct: 88 },
  { name: "Excel", pct: 76 },
  { name: "Power BI", pct: 71 },
  { name: "Tableau", pct: 65 },
];

const TESTIMONIALS = [
  { name: "Priya S.", role: "Data Analyst → Data Scientist", text: "The Skill Gap Analyzer showed me I only needed to add PyTorch and MLflow to my stack. Got 3 interviews in 6 weeks.", rating: 5, avatar: "PS" },
  { name: "Aarav K.", role: "CS Student → ML Intern at Google", text: "I had no idea how my projects compared to what companies actually wanted. The roadmap feature changed everything.", rating: 5, avatar: "AK" },
  { name: "Rahul M.", role: "SWE → ML Engineer", text: "My ATS score went from 52 to 81 in one weekend using the remediation checklist. Real interviews started coming in.", rating: 5, avatar: "RM" },
];

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#070919] text-gray-100 overflow-x-hidden">
      {/* TOP NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 border-b border-white/5 bg-[#070919]/90 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-purple-500/20">
            A
          </div>
          <span className="font-bold text-sm text-white tracking-tight">AI Job Analyzer</span>
        </div>

        <div className="hidden md:flex items-center gap-7 text-xs font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#data" className="hover:text-white transition-colors">Data</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-medium text-gray-300 hover:text-white transition-colors px-2 py-1">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary-purple text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5">
            Get Started Free <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION - CANVAS MATCHING MOCKUP ASPECT RATIO */}
      <section className="relative pt-20 pb-8 px-4 md:px-8 max-w-[1440px] mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          
          {/* HERO LEFT COLUMN */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-950/40 text-purple-300 text-[11px] font-medium mb-4 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-purple-400" />
              48,200+ job postings analyzed · Updated daily
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[50px] font-black leading-[1.08] tracking-tight mb-4 text-white">
              You don’t just need<br />
              a job listing.<br />
              <span className="gradient-purple-text">You need market<br />intelligence.</span>
            </h1>

            <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-6 max-w-[420px]">
              The AI platform that tells you exactly where you stand against the market — and exactly what to do next to land your dream role as a Data Analyst.
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link href="/signup" className="btn-primary-purple text-xs font-semibold px-5 py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto">
                Analyze My Market Position <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/login" className="btn-secondary-dark text-xs font-semibold px-5 py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto">
                Sign In <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* HERO RIGHT COLUMN - DASHBOARD PREVIEW CARD */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-4 md:p-5 shadow-2xl relative border border-white/10">
              
              {/* TOP ROW: Market Overview + Job Postings Trend */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3 items-start">
                
                {/* Market Overview Title & Stat */}
                <div className="md:col-span-5 flex flex-col pt-1">
                  <span className="text-xs font-semibold text-gray-200 tracking-wide">Market Overview</span>
                  <div className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                    48,200+
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium mt-0.5">Job Postings Analyzed</div>
                  <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1.5">
                    <span className="text-emerald-400">↑ 12.4%</span>
                    <span className="text-gray-400 font-normal text-[10px]">this week</span>
                  </div>
                </div>

                {/* Job Postings Trend Chart Box */}
                <div className="md:col-span-7 glass-card-sub rounded-xl p-3 border border-white/5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-300">Job Postings Trend</span>
                    <div className="text-[10px] text-gray-400 bg-white/5 border border-white/10 rounded-md px-2 py-0.5 flex items-center gap-1 cursor-pointer">
                      This Week <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
                    </div>
                  </div>

                  {/* SVG Spline Trend Line */}
                  <div className="relative w-full h-[55px]">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 65" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 42 C 30 18, 60 52, 100 22 C 140 38, 180 10, 220 26 C 260 8, 280 18, 300 12 L 300 65 L 0 65 Z"
                        fill="url(#trendGradient)"
                      />
                      <path
                        d="M 0 42 C 30 18, 60 52, 100 22 C 140 38, 180 10, 220 26 C 260 8, 280 18, 300 12"
                        fill="none"
                        stroke="#a5b4fc"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-400 font-medium mt-1 px-0.5">
                    <span>May 11</span>
                    <span>May 12</span>
                    <span>May 13</span>
                    <span>May 14</span>
                    <span>May 15</span>
                    <span>May 16</span>
                    <span>May 17</span>
                  </div>
                </div>
              </div>

              {/* MIDDLE ROW: 3 METRIC CARDS */}
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                
                {/* Stat 1 */}
                <div className="glass-card-sub rounded-xl p-3 flex flex-col justify-between border border-white/5">
                  <div className="w-6 h-6 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center mb-1.5">
                    <Box className="w-3 h-3 text-indigo-400" />
                  </div>
                  <div className="text-lg md:text-xl font-bold text-white">350+</div>
                  <div className="text-[10px] text-gray-400 font-medium">Skills Tracked</div>
                </div>

                {/* Stat 2 */}
                <div className="glass-card-sub rounded-xl p-3 flex flex-col justify-between border border-white/5">
                  <div className="w-6 h-6 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mb-1.5">
                    <TrendingUp className="w-3 h-3 text-purple-400" />
                  </div>
                  <div className="text-lg md:text-xl font-bold text-white">+24pts</div>
                  <div className="text-[10px] text-gray-400 font-medium leading-tight">Avg. Skills Score Improvement</div>
                </div>

                {/* Stat 3 */}
                <div className="glass-card-sub rounded-xl p-3 flex flex-col justify-between border border-white/5">
                  <div className="text-xl md:text-2xl font-extrabold text-white mt-1 mb-1">3.2x</div>
                  <div className="text-[10px] text-gray-400 font-medium leading-tight">Users Found Jobs Faster</div>
                </div>

              </div>

              {/* BOTTOM ROW: TOP SKILLS & EXPERIENCE BREAKDOWN */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                
                {/* Top In-Demand Skills */}
                <div className="md:col-span-7 glass-card-sub rounded-xl p-3.5 border border-white/5">
                  <div className="text-xs font-semibold text-gray-300 mb-2.5">Top In-Demand Skills</div>
                  <div className="space-y-2">
                    {SKILL_BARS.map((skill) => (
                      <div key={skill.name} className="flex items-center gap-2.5">
                        <span className="text-xs font-medium text-gray-300 w-14 shrink-0">{skill.name}</span>
                        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                            style={{ width: `${skill.pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-300 w-7 text-right shrink-0">{skill.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Job Market by Experience Level */}
                <div className="md:col-span-5 glass-card-sub rounded-xl p-3.5 border border-white/5 flex flex-col justify-between">
                  <div className="text-xs font-semibold text-gray-300 mb-2">Job Market by Experience Level</div>
                  
                  <div className="flex items-center justify-between gap-2 my-auto">
                    {/* SVG Donut Chart */}
                    <div className="relative w-18 h-18 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        {/* Background ring */}
                        <path
                          className="text-white/5"
                          strokeWidth="5.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {/* Entry Level 42% (Purple) */}
                        <path
                          strokeWidth="5.5"
                          strokeDasharray="42, 100"
                          stroke="#6366f1"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {/* Mid Level 38% (Blue) */}
                        <path
                          strokeWidth="5.5"
                          strokeDasharray="38, 100"
                          strokeDashoffset="-42"
                          stroke="#3b82f6"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {/* Senior Level 20% (Teal) */}
                        <path
                          strokeWidth="5.5"
                          strokeDasharray="20, 100"
                          strokeDashoffset="-80"
                          stroke="#10b981"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                    </div>

                    {/* Legend */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-1.5 text-gray-300 text-[10px]">
                          <span className="w-2 h-2 rounded-full bg-[#6366f1]"></span>
                          Entry Level
                        </div>
                        <span className="font-bold text-white text-[10px]">42%</span>
                      </div>
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-1.5 text-gray-300 text-[10px]">
                          <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                          Mid Level
                        </div>
                        <span className="font-bold text-white text-[10px]">38%</span>
                      </div>
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-1.5 text-gray-300 text-[10px]">
                          <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                          Senior Level
                        </div>
                        <span className="font-bold text-white text-[10px]">20%</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* STAT BAR BANNER BELOW HERO - EXACT MARGIN & ASPECT RATIO */}
      <section className="px-4 md:px-8 max-w-[1440px] mx-auto mb-12">
        <div className="glass-panel rounded-2xl p-4 md:p-5 shadow-xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          {/* Stat Item 1 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-white tracking-tight">48,200+</div>
              <div className="text-[11px] text-gray-400 font-medium">Job Postings Analyzed</div>
            </div>
          </div>

          {/* Stat Item 2 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-white tracking-tight">350+</div>
              <div className="text-[11px] text-gray-400 font-medium">Skills Tracked</div>
            </div>
          </div>

          {/* Stat Item 3 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-white tracking-tight">+24pts</div>
              <div className="text-[11px] text-gray-400 font-medium">Avg. Skills Score Improvement</div>
            </div>
          </div>

          {/* Stat Item 4 */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-pink-950/50 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-white tracking-tight">3.2x</div>
              <div className="text-[11px] text-gray-400 font-medium">Users Found Jobs Faster</div>
            </div>
          </div>

        </div>
      </section>

      {/* WHY AI JOB ANALYZER / FEATURE HIGHLIGHTS - MATCHING SCREENSHOT */}
      <section id="features" className="py-8 px-4 md:px-8 max-w-[1440px] mx-auto mb-16">
        <div className="text-center mb-8">
          <span className="text-[11px] font-extrabold tracking-widest text-indigo-400 uppercase mb-1.5 block">
            WHY AI JOB ANALYZER?
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
            Data. Insights. Action.
          </h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            We turn complex job market data into actionable insights that help you make smarter career moves.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* Card 1 */}
          <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col justify-between hover:border-purple-500/40 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
                <Target className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-xs text-white mb-1.5">Market Position Analysis</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                See exactly where you stand compared to other candidates in the job market.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <BarChart3 className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-xs text-white mb-1.5">Real-time Job Data</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Access the latest job postings and market trends updated every day.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col justify-between hover:border-amber-500/40 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                <Star className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-xs text-white mb-1.5">Skills Gap Insights</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Identify skill gaps and get personalized recommendations to stay competitive.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col justify-between hover:border-pink-500/40 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-pink-950/60 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-xs text-white mb-1.5">Career Guidance</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Data-driven advice to help you land your dream role faster.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col justify-between hover:border-teal-500/40 transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <h3 className="font-bold text-xs text-white mb-1.5">Trusted & Secure</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Your data is encrypted and never shared with third parties.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* DETAILED FEATURES GRID */}
      <section id="data" className="py-12 px-4 md:px-8 max-w-[1440px] mx-auto border-t border-white/5">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Every tool you need to <span className="gradient-purple-text">win the job market</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto">
            6 AI-powered modules. One platform. A complete feedback loop from assessment to action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-panel rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                >
                  <f.icon className="w-4.5 h-4.5" style={{ color: f.color }} />
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }}>
                  {f.tag}
                </span>
              </div>
              <h3 className="font-bold text-sm text-white mb-1.5 group-hover:text-indigo-300 transition-colors">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-12 px-4 md:px-8 max-w-[1440px] mx-auto border-t border-white/5">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Real results from <span className="gradient-purple-text">real people</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="glass-panel rounded-xl p-5 border border-white/10">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-xs text-white">{t.name}</div>
                  <div className="text-[10px] text-indigo-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-12 px-4 md:px-8 max-w-[1100px] mx-auto border-t border-white/5">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Simple, transparent <span className="gradient-purple-text">pricing</span>
          </h2>
          <p className="text-xs text-gray-400">Start free. Upgrade when you’re ready.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Free", price: "$0", period: "forever",
              features: ["Job Search & Filters", "Skill Trend Analyzer", "3 Skill Gap Reports/month", "3 ATS Score checks/month", "Basic Career Recommendations"],
              cta: "Start Free", href: "/signup", highlight: false,
            },
            {
              name: "Pro", price: "$19", period: "/month",
              features: ["Everything in Free", "Unlimited AI analyses", "Learning Roadmap Generator", "AI Chat Assistant (RAG)", "Salary Prediction with factors", "PDF/CSV export", "Priority support"],
              cta: "Start Pro Free Trial", href: "/signup", highlight: true,
            },
          ].map((plan) => (
            <div key={plan.name} className={`relative p-6 rounded-2xl border ${plan.highlight ? "border-indigo-500/50 bg-indigo-950/20 shadow-xl shadow-indigo-500/10" : "glass-panel border-white/10"}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold tracking-wider">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-5">
                <h3 className="font-bold text-base text-white mb-1.5">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-xs text-gray-400">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`btn w-full justify-center text-xs py-2.5 rounded-xl font-semibold flex items-center ${plan.highlight ? "btn-primary-purple" : "btn-secondary-dark"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-12 px-4 md:px-8 max-w-[1100px] mx-auto">
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-indigo-500/20 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Know where you stand.<br /><span className="gradient-purple-text">Act on what matters.</span>
          </h2>
          <p className="text-xs text-gray-400 mb-6 max-w-md mx-auto">
            Join thousands of data professionals using AI-powered market intelligence to accelerate their careers.
          </p>
          <Link href="/signup" className="btn-primary-purple text-xs font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2">
            Start Your Analysis — Free <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="about" className="border-t border-white/5 py-8 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-[11px] text-white">
              A
            </div>
            <span className="font-bold text-xs text-white">AI Job Market Analyzer</span>
          </div>
          <div className="flex items-center gap-5 text-[11px] text-gray-400">
            <span>© 2026 AI Job Analyzer</span>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Production-grade security</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
