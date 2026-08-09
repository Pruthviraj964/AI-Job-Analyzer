"use client";
import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Search, Filter } from "lucide-react";
import { SKILL_TRENDS } from "@/lib/data";
import { SkillTrend } from "@/types";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatNumber } from "@/lib/utils";

const CATEGORIES = ["All", "Programming Languages", "Machine Learning", "LLMs & AI", "Data Engineering", "MLOps", "Analytics", "Cloud", "NLP"];
const SORT_OPTIONS = ["Growth Rate", "Total Mentions", "Salary Impact"];

function TrendCard({ t }: { t: SkillTrend }) {
  const [selected, setSelected] = useState(false);
  const color = t.growthRate > 100 ? "#10b981" : t.growthRate > 20 ? "#7c3aed" : t.growthRate > 0 ? "#3b82f6" : "#ef4444";

  return (
    <div
      onClick={() => setSelected(!selected)}
      className={`glass rounded-2xl p-5 border card-hover cursor-pointer transition-all ${selected ? "border-violet-500/40" : "border-white/8"}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-bold">{t.skill}</div>
          <div className="text-xs text-gray-500">{t.category}</div>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-sm" style={{ color }}>
          {t.growthRate > 10 ? <TrendingUp className="w-4 h-4" /> : t.growthRate < -5 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          {t.growthRate > 0 ? "+" : ""}{t.growthRate}%
        </div>
      </div>

      <div className="mb-3">
        <ResponsiveContainer width="100%" height={60}>
          <AreaChart data={t.trend.slice(-6)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${t.skill}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="count" stroke={color} fill={`url(#grad-${t.skill})`} strokeWidth={2} dot={false} />
            <Tooltip
              contentStyle={{ background: "#1f2937", border: "none", borderRadius: "6px", fontSize: "11px", color: "#f9fafb" }}
              formatter={(v: any) => [formatNumber(Number(v)), "Mentions"]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-gray-500 mb-0.5">Total Mentions</div>
          <div className="font-bold">{formatNumber(t.totalMentions)}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <div className="text-gray-500 mb-0.5">Salary Impact</div>
          <div className="font-bold text-emerald-400">+${(t.avgSalaryImpact / 1000).toFixed(0)}k</div>
        </div>
      </div>
    </div>
  );
}

export default function TrendsPage() {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Growth Rate");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let result = SKILL_TRENDS.filter(t => {
      const matchesCat = category === "All" || t.category === category;
      const matchesQ = !query || t.skill.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQ;
    });
    if (sort === "Growth Rate") result = [...result].sort((a, b) => b.growthRate - a.growthRate);
    else if (sort === "Total Mentions") result = [...result].sort((a, b) => b.totalMentions - a.totalMentions);
    else result = [...result].sort((a, b) => b.avgSalaryImpact - a.avgSalaryImpact);
    return result;
  }, [category, sort, query]);

  // Top rising for the chart
  const topRising = SKILL_TRENDS.sort((a, b) => b.growthRate - a.growthRate).slice(0, 5);
  const chartData = SKILL_TRENDS[0].trend.map((d, i) => {
    const row: Record<string, number | string> = { month: d.month };
    topRising.forEach(t => { row[t.skill] = t.trend[i].count; });
    return row;
  }).slice(-9);

  const COLORS = ["#7c3aed", "#10b981", "#3b82f6", "#f59e0b", "#ec4899"];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero chart */}
      <div className="glass rounded-2xl p-6 border border-white/8">
        <h3 className="font-bold mb-1">Top 5 Fastest-Growing Skills — Last 9 Months</h3>
        <p className="text-xs text-gray-500 mb-4">Mention count across 48,200+ indexed job postings</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickFormatter={(v) => formatNumber(v)} />
            <Tooltip
              contentStyle={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", color: "#f9fafb" }}
              formatter={(v: any) => [formatNumber(Number(v)), ""]}
            />
            {topRising.map((t, i) => (
              <Area key={t.skill} type="monotone" dataKey={t.skill} stroke={COLORS[i]} fill="none" strokeWidth={2} dot={false} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3">
          {topRising.map((t, i) => (
            <div key={t.skill} className="flex items-center gap-1.5 text-xs">
              <div className="w-3 h-1.5 rounded-full" style={{ background: COLORS[i] }} />
              <span className="text-gray-400">{t.skill}</span>
              <span className="font-bold" style={{ color: COLORS[i] }}>+{t.growthRate}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input className="input pl-9 text-sm" placeholder="Search skills..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="input w-auto text-sm" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input w-auto text-sm" value={sort} onChange={e => setSort(e.target.value)}>
          {SORT_OPTIONS.map(s => <option key={s} value={s}>Sort: {s}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(t => <TrendCard key={t.skill} t={t} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <div>No skills found for your filters</div>
        </div>
      )}
    </div>
  );
}
