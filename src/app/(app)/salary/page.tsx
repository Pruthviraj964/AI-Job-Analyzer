"use client";
import { useState } from "react";
import { DollarSign, Loader2, TrendingUp, TrendingDown, Info } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { runSalaryPrediction } from "@/lib/ai";
import { SalaryPrediction } from "@/types";
import { SALARY_DATA } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import toast from "react-hot-toast";

const ROLES = Object.keys(SALARY_DATA);
const SENIORITIES = ["entry", "junior", "mid", "senior", "lead"];
const LOCATIONS = ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Remote", "Chicago, IL", "Boston, MA", "London, UK", "Toronto, Canada", "Bengaluru, India"];

export default function SalaryPage() {
  const { profile } = useAuthStore();
  const [role, setRole] = useState(profile?.currentRole && ROLES.includes(profile.currentRole) ? profile.currentRole : "Data Scientist");
  const [seniority, setSeniority] = useState(profile?.preferences?.seniority || "mid");
  const [location, setLocation] = useState(profile?.location || "San Francisco, CA");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SalaryPrediction | null>(null);
  const [adjustedRole, setAdjustedRole] = useState(role);

  const handlePredict = async () => {
    setRunning(true);
    setAdjustedRole(role);
    try {
      const pred = await runSalaryPrediction(role, seniority, location, profile?.skills || []);
      setResult(pred);
    } finally {
      setRunning(false);
    }
  };

  // Bar chart data comparing seniority levels
  const comparisonData = result ? SENIORITIES.map(sen => {
    const roleData = SALARY_DATA[role];
    const key = (sen === "junior" ? "entry" : sen) as keyof typeof roleData;
    const [min, max] = roleData[key] || [0, 0];
    return { seniority: sen.charAt(0).toUpperCase() + sen.slice(1), salary: Math.round((min + max) / 2), min, max };
  }) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input form */}
      <div className="glass rounded-2xl p-6 border border-white/8">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" /> Salary Prediction
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Role</label>
            <select className="input" value={role} onChange={e => setRole(e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Seniority</label>
            <select className="input" value={seniority} onChange={e => setSeniority(e.target.value)}>
              {SENIORITIES.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Location</label>
            <select className="input" value={location} onChange={e => setLocation(e.target.value)}>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <button onClick={handlePredict} disabled={running} className="btn btn-primary">
          {running ? <><Loader2 className="w-4 h-4 animate-spin" /> Predicting salary...</> : <><DollarSign className="w-4 h-4" /> Predict Salary Range</>}
        </button>
        <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
          <Info className="w-3 h-3" /> Statistical estimate based on ML regression model trained on 48,200+ job postings. Not a guarantee.
        </p>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-slide-up">
          {/* Range cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Low End", value: result.low, color: "#9ca3af", note: "25th percentile" },
              { label: "Median", value: result.median, color: "#10b981", note: "50th percentile · Most likely" },
              { label: "High End", value: result.high, color: "#7c3aed", note: "75th percentile" },
            ].map((r) => (
              <div key={r.label} className="glass rounded-2xl p-5 border border-white/8 text-center">
                <div className="text-xs text-gray-500 mb-2">{r.label}</div>
                <div className="text-2xl font-black mb-1" style={{ color: r.color }}>
                  ${(r.value / 1000).toFixed(0)}k
                </div>
                <div className="text-xs text-gray-600">{r.note}</div>
              </div>
            ))}
          </div>

          {/* Confidence */}
          <div className="glass rounded-2xl p-4 border border-white/8 flex items-center gap-4">
            <div className="text-sm text-gray-400">Model confidence:</div>
            <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" style={{ width: `${result.confidence * 100}%` }} />
            </div>
            <div className="font-bold text-emerald-400 text-sm">{(result.confidence * 100).toFixed(0)}%</div>
          </div>

          {/* Factor breakdown */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="font-bold mb-4">What&apos;s driving your salary</h3>
            <div className="space-y-3">
              {result.factors.map((f, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{f.factor}</span>
                  <span className={`font-bold flex items-center gap-1 ${f.direction === "positive" ? "text-emerald-400" : "text-red-400"}`}>
                    {f.direction === "positive" ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {f.direction === "positive" ? "+" : "-"}{Math.abs(f.impact)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison by seniority */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="font-bold mb-4">Salary by Seniority — {adjustedRole}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={comparisonData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="seniority" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#f9fafb", fontSize: "12px" }}
                  formatter={(v: any) => [`$${(Number(v) / 1000).toFixed(0)}k`, "Median Salary"]}
                />
                <ReferenceLine y={result.median} stroke="#10b981" strokeDasharray="4 2" label={{ value: "Your estimate", fill: "#10b981", fontSize: 11 }} />
                <Bar dataKey="salary" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
