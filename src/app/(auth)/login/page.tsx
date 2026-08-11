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
  Sparkles,
  TrendingUp,
  Target,
  Shield,
  Lock,
  Mail,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { sendPasswordResetEmail, auth } from "@/lib/firebase";
import toast from "react-hot-toast";

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    email: "demo@aijobanalyzer.com",
    password: "••••••••",
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Convert dots back to standard demo password if unedited
    const actualPassword =
      form.password === "••••••••" ? "demo123" : form.password;

    const res = await login(form.email, actualPassword);
    if (res.success) {
      toast.success("Welcome back! 🎉");
      router.push("/dashboard");
    } else {
      toast.error(res.error || "Authentication failed. Check your credentials.");
    }
  };

  const handleGoogleSignIn = async () => {
    const res = await loginWithGoogle();
    if (res.success) {
      toast.success("Signed in with Google! 🚀");
      router.push("/dashboard");
    } else {
      toast.error(res.error || "Google sign in failed.");
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      toast.error("Please enter your email address first.");
      return;
    }
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, form.email);
      toast.success(`Password reset link sent to ${form.email}`);
    } catch (err: unknown) {
      toast.success(`Password reset requested for ${form.email}`);
    } finally {
      setIsResetting(false);
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

          {/* Hero Tagline & Main Text */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 text-purple-300 text-xs font-semibold backdrop-blur-md shadow-inner">
              <span>Welcome back!</span>
              <span className="text-sm">👋</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold leading-[1.12] tracking-tight">
              Unlock your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">
                career potential
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-[460px]">
              Sign in to access personalized insights, track your progress and get
              AI-powered career guidance tailored just for you.
            </p>
          </div>

          {/* 3 Feature Highlights */}
          <div className="space-y-4 pt-2">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-950/70 border border-violet-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 shadow-md shadow-purple-950/50">
                <TrendingUp className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-100">
                  Smart Insights
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  AI-powered analysis of jobs, skills and market trends.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-950/70 border border-violet-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 shadow-md shadow-purple-950/50">
                <Target className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-100">
                  Personalized for You
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  Get recommendations tailored to your profile and goals.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-950/70 border border-violet-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 shadow-md shadow-purple-950/50">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-100">
                  Secure &amp; Private
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                  Your data is encrypted and always protected.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Card Preview */}
          <div className="pt-2 relative">
            <div className="w-full max-w-[480px] bg-[#0d0e26]/90 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-transform hover:scale-[1.01] duration-300">
              {/* Card Window Controls */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-[11px] font-semibold text-gray-300">
                  Dashboard
                </span>
                <span className="text-gray-500 text-xs">✕</span>
              </div>

              {/* Card Grid Content */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* Profile Strength Widget */}
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col items-center justify-center text-center">
                  <div className="text-[9px] text-gray-400 font-medium mb-1">
                    Profile Strength
                  </div>
                  <div className="w-11 h-11 rounded-full border-4 border-violet-500 border-t-transparent flex items-center justify-center my-0.5">
                    <span className="text-xs font-bold text-white">85%</span>
                  </div>
                  <div className="text-[8px] text-gray-400 mt-0.5">
                    Keep going!
                  </div>
                </div>

                {/* Skills Match Widget */}
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col justify-between">
                  <div className="text-[9px] text-gray-400 font-medium">
                    Skills Match
                  </div>
                  <div className="text-lg font-extrabold text-white">92%</div>
                  <div className="h-4 w-full flex items-end">
                    <svg className="w-full h-3" viewBox="0 0 50 15">
                      <path
                        d="M0 12 Q 15 2, 30 10 T 50 2 L 50 15 L 0 15 Z"
                        fill="rgba(16, 185, 129, 0.15)"
                      />
                      <path
                        d="M0 12 Q 15 2, 30 10 T 50 2"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <div className="text-[8px] text-emerald-400 font-medium">
                    Excellent match
                  </div>
                </div>

                {/* Job Opportunities Widget */}
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col justify-between">
                  <div className="text-[9px] text-gray-400 font-medium">
                    Job Opportunities
                  </div>
                  <div className="text-lg font-extrabold text-white">128</div>
                  <div className="inline-flex items-center gap-1 bg-violet-500/20 px-1.5 py-0.5 rounded text-[8px] text-violet-300 font-semibold w-fit">
                    <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" />
                    New matches
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (LOGIN CARD) ================= */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-[460px] bg-[#0c0e29]/80 backdrop-blur-2xl border border-violet-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(124,58,237,0.15)] relative overflow-hidden">
            {/* Top Glowing Lock Icon Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-purple-600/30 to-violet-950/60 border border-purple-500/40 flex items-center justify-center text-white mb-3 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <Lock className="w-6 h-6 text-violet-300" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Sign in to your career intelligence dashboard
              </p>
              <div className="flex items-center gap-2 w-full my-4">
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-purple-400 text-xs">✦</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>
            </div>

            {/* Pre-filled Demo Banner */}
            <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-3.5 mb-6 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs text-purple-200 leading-relaxed font-medium">
                Demo credentials pre-filled.
                <br />
                Just click &ldquo;Sign In&rdquo; to explore the platform.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="demo@aijobanalyzer.com"
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
                    placeholder="••••••••"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#08091c] border-white/20 text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isResetting}
                  className="text-gray-400 hover:text-violet-300 transition-colors font-medium"
                >
                  {isResetting ? "Sending..." : "Forgot password?"}
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all hover:shadow-purple-600/50 active:scale-[0.99] disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Or Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="text-[11px] font-medium text-gray-500 uppercase">
                or
              </span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            {/* Footer Sign Up Link */}
            <p className="text-center text-xs text-gray-400 mt-6 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
