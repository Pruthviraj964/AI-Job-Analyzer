"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  User,
  Mail,
  Lock,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || form.password.length < 6) {
      toast.error("Please fill all fields. Password must be 6+ characters.");
      return;
    }
    const res = await signup(form.name, form.email, form.password);
    if (res.success) {
      toast.success("Account created! Let's set up your profile.");
      router.push("/onboarding");
    } else {
      toast.error(res.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070817] text-white flex items-center justify-center p-4 md:p-8 relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      {/* Background Lighting & Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-900/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[160px]" />
        <div className="absolute top-[30%] right-[30%] w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-6">
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8 pr-0 lg:pr-4">
          {/* Logo Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight text-white">
                AI Job Analyzer
              </h1>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Career Intelligence
              </p>
            </div>
          </div>

          {/* Hero Tagline */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold leading-[1.12] tracking-tight">
              Start your journey <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">
                towards a smarter career
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-[460px]">
              Get your first AI analysis in under 2 minutes and unlock personalized
              career insights.
            </p>
          </div>

          {/* 3 Feature Bullet Points */}
          <div className="space-y-5 pt-1">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-950/70 border border-violet-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 shadow-md shadow-purple-950/50">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-100">
                  Skill Gap Analysis
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  Discover skills you need to advance in your dream role.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-950/70 border border-violet-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 shadow-md shadow-purple-950/50">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-100">
                  ATS Scoring
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  See how well your resume performs against ATS systems.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-950/70 border border-violet-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 shadow-md shadow-purple-950/50">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-100">
                  Learning Roadmap
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  Get a personalized plan to upskill and achieve your goals.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom 3D Graphic Card Preview */}
          <div className="pt-2 relative flex items-center justify-center sm:justify-start">
            <div className="relative w-full max-w-[440px] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Pedestal Glow Ring */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-12 bg-purple-600/30 blur-xl rounded-full pointer-events-none" />

              {/* Tilted Card Container */}
              <div className="bg-[#0e0f2b]/95 border border-purple-500/30 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative">
                <div className="flex items-start justify-between">
                  {/* Line Chart Graphic */}
                  <div className="flex-1 pr-4">
                    <svg className="w-full h-20" viewBox="0 0 160 60">
                      <path
                        d="M 0 50 L 30 40 L 60 25 L 90 45 L 120 15 L 150 20"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="2.5"
                      />
                      <circle cx="30" cy="40" r="3" fill="#c084fc" />
                      <circle cx="60" cy="25" r="3" fill="#c084fc" />
                      <circle cx="90" cy="45" r="3" fill="#c084fc" />
                      <circle cx="120" cy="15" r="4" fill="#38bdf8" />
                      <circle cx="150" cy="20" r="3" fill="#c084fc" />
                    </svg>
                  </div>

                  {/* Donut Chart Graphic */}
                  <div className="w-14 h-14 relative shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        strokeWidth="5"
                        stroke="#261b4d"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        strokeWidth="5"
                        strokeDasharray="75, 100"
                        stroke="#9333ea"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="bg-purple-950/80 border border-purple-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white">92%</span>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      ATS Score
                    </span>
                  </div>
                  <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full w-[92%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (SIGNUP CARD) ================= */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-[480px] bg-[#0c0e29]/80 backdrop-blur-2xl border border-violet-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(124,58,237,0.15)] relative overflow-hidden">
            {/* Top Glowing User Icon Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-purple-600/30 to-violet-950/60 border border-purple-500/40 flex items-center justify-center text-white mb-3 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <User className="w-6 h-6 text-violet-300" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Create your free account
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Join thousands of professionals improving their careers
              </p>
            </div>

            {/* 3 Step Process Indicator Row */}
            <div className="grid grid-cols-3 gap-2 bg-[#07081c]/70 border border-white/5 rounded-2xl p-2.5 mb-6">
              {/* Step 1 */}
              <div className="flex items-center gap-2 p-1">
                <div className="w-7 h-7 rounded-full bg-violet-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-md shadow-purple-500/30">
                  1
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white leading-tight truncate">
                    Quick Sign Up
                  </div>
                  <div className="text-[9px] text-gray-400 leading-tight truncate">
                    Takes less than 30s
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-2 p-1">
                <div className="w-7 h-7 rounded-full bg-violet-950/80 border border-purple-500/30 text-purple-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-gray-300 leading-tight truncate">
                    AI Analysis
                  </div>
                  <div className="text-[9px] text-gray-500 leading-tight truncate">
                    Get insights in &lt;2m
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-2 p-1">
                <div className="w-7 h-7 rounded-full bg-violet-950/80 border border-purple-500/30 text-purple-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-gray-300 leading-tight truncate">
                    Career Growth
                  </div>
                  <div className="text-[9px] text-gray-500 leading-tight truncate">
                    Unlock potential
                  </div>
                </div>
              </div>
            </div>

            {/* Divider Line with Diamond */}
            <div className="flex items-center gap-2 w-full mb-6">
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="text-purple-400 text-xs">◇</span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Priya Sharma"
                    className="w-full bg-[#08091c] border border-white/10 focus:border-violet-500 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="priya@example.com"
                    className="w-full bg-[#08091c] border border-white/10 focus:border-violet-500 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    placeholder="Min. 6 characters"
                    className="w-full bg-[#08091c] border border-white/10 focus:border-violet-500 rounded-xl py-3 pl-10 pr-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Create Free Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:shadow-purple-600/50 active:scale-[0.99] disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Terms of Service & Privacy Policy Notice */}
            <p className="text-center text-[11px] text-gray-400 mt-5 leading-tight">
              By signing up you agree to our{" "}
              <a href="#" className="underline hover:text-white transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-white transition-colors">
                Privacy Policy
              </a>
              .
            </p>

            {/* Already have an account? Sign in */}
            <p className="text-center text-xs text-gray-400 mt-4 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
