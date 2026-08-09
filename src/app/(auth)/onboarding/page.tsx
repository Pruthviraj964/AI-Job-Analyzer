"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, ChevronRight, Check } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { ALL_SKILLS } from "@/lib/data";
import toast from "react-hot-toast";

const ROLES = [
  "Data Analyst", "Data Scientist", "Machine Learning Engineer", "Data Engineer",
  "NLP Engineer", "MLOps Engineer", "AI Research Scientist", "Software Engineer",
  "Business Analyst", "Product Manager", "Quantitative Analyst",
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Student / Fresh Graduate", years: "0-1 years" },
  { value: "junior", label: "Junior Professional", years: "1-3 years" },
  { value: "mid", label: "Mid-Level", years: "3-5 years" },
  { value: "senior", label: "Senior", years: "5-8 years" },
  { value: "lead", label: "Lead / Principal", years: "8+ years" },
];

const POPULAR_SKILLS = ["Python", "SQL", "Machine Learning", "PyTorch", "TensorFlow", "Tableau", "Excel", "Statistics", "R", "Spark", "Airflow", "dbt", "AWS", "Docker", "Kubernetes", "LLMs", "NLP", "Computer Vision", "A/B Testing", "MLflow"];

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile, profile } = useAuthStore();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    currentRole: profile?.currentRole || "",
    targetRole: profile?.targetRole || "",
    experienceLevel: profile?.preferences?.seniority || "mid",
    experienceYears: profile?.experienceYears || 3,
    location: profile?.location || "",
    skills: profile?.skills || [] as string[],
  });

  const toggleSkill = (skill: string) => {
    setData((d) => ({
      ...d,
      skills: d.skills.includes(skill) ? d.skills.filter((s) => s !== skill) : [...d.skills, skill],
    }));
  };

  const handleFinish = () => {
    updateProfile({
      currentRole: data.currentRole,
      targetRole: data.targetRole,
      experienceYears: data.experienceYears,
      location: data.location,
      skills: data.skills,
      preferences: { remoteOnly: false, industry: "Technology", seniority: data.experienceLevel },
      completionScore: 85,
    });
    toast.success("Profile set up! Running your first analysis...");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-animated opacity-40" />
      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">AI Job Analyzer</span>
          </div>
          <h1 className="text-3xl font-black mb-2">Let&apos;s set up your profile</h1>
          <p className="text-gray-400">This personalizes every AI analysis for your specific situation.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
                style={{ width: step >= s ? "100%" : "0%" }}
              />
            </div>
          ))}
        </div>

        <div className="glass-strong rounded-2xl border border-white/10 p-8">
          {/* Step 1: Roles */}
          {step === 1 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-bold mb-6">What are your roles?</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">Current Role</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        onClick={() => setData((d) => ({ ...d, currentRole: role }))}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all text-left ${data.currentRole === role ? "border-violet-500 bg-violet-500/15 text-violet-300" : "border-white/10 hover:border-white/20 text-gray-400"}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">Target Role</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        onClick={() => setData((d) => ({ ...d, targetRole: role }))}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all text-left ${data.targetRole === role ? "border-emerald-500 bg-emerald-500/15 text-emerald-300" : "border-white/10 hover:border-white/20 text-gray-400"}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience + Location */}
          {step === 2 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-bold mb-6">Experience & Location</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-300">Experience Level</label>
                  <div className="space-y-2">
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <button
                        key={lvl.value}
                        onClick={() => setData((d) => ({ ...d, experienceLevel: lvl.value, experienceYears: parseInt(lvl.years.split("-")[0]) || 1 }))}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${data.experienceLevel === lvl.value ? "border-violet-500 bg-violet-500/10" : "border-white/10 hover:border-white/20"}`}
                      >
                        <div className="text-left">
                          <div className="font-medium text-sm">{lvl.label}</div>
                          <div className="text-xs text-gray-500">{lvl.years}</div>
                        </div>
                        {data.experienceLevel === lvl.value && <Check className="w-4 h-4 text-violet-400" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Location (City, Country)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="San Francisco, CA / Remote / Mumbai, India"
                    value={data.location}
                    onChange={(e) => setData((d) => ({ ...d, location: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-bold mb-2">Your current skills</h2>
              <p className="text-sm text-gray-400 mb-6">Select all that apply. This powers your Skill Gap Analysis.</p>
              <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
                {POPULAR_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${data.skills.includes(skill) ? "border-violet-500 bg-violet-500/20 text-violet-300" : "border-white/10 text-gray-400 hover:border-white/30"}`}
                  >
                    {data.skills.includes(skill) && <span className="mr-1">✓</span>}
                    {skill}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">{data.skills.length} skills selected</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="btn btn-ghost disabled:opacity-30"
            >
              Back
            </button>
            {step < 3 ? (
              <button onClick={() => setStep((s) => s + 1)} className="btn btn-primary">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleFinish} className="btn btn-primary">
                Launch Dashboard <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
