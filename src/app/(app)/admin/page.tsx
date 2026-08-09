"use client";
import { useState } from "react";
import { Shield, Users, BarChart3, AlertTriangle, CheckCircle, Activity, Settings, Zap, Globe } from "lucide-react";
import { ADMIN_STATS, SYSTEM_HEALTH } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const USER_GROWTH = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  users: Math.round(2000 + i * 600 + (Math.random() - 0.5) * 300),
  analyses: Math.round(5000 + i * 1800 + (Math.random() - 0.5) * 800),
}));

const MODERATION_QUEUE = [
  { id: "1", type: "Job Posting", content: "Senior ML Engineer at TechCorp", status: "pending", reported: "2h ago" },
  { id: "2", type: "User Report", content: "Fake salary data on job #job-042", status: "pending", reported: "4h ago" },
  { id: "3", type: "Content", content: "Off-topic chat message flagged by AI", status: "pending", reported: "5h ago" },
];

export default function AdminPage() {
  const [tab, setTab] = useState("Overview");
  const [moderationItems, setModerationItems] = useState(MODERATION_QUEUE);

  const approve = (id: string) => setModerationItems(prev => prev.filter(i => i.id !== id));
  const reject = (id: string) => setModerationItems(prev => prev.filter(i => i.id !== id));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Admin badge */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl w-fit">
        <Shield className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-amber-300">Admin Panel · Internal Use Only</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/8 w-fit">
        {["Overview", "Users", "System", "Moderation"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-violet-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>{t}</button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Users", value: formatNumber(ADMIN_STATS.totalUsers), icon: Users, color: "#7c3aed" },
              { label: "Active Users", value: formatNumber(ADMIN_STATS.activeUsers), icon: Activity, color: "#10b981" },
              { label: "Total Jobs", value: formatNumber(ADMIN_STATS.totalJobs), icon: Globe, color: "#3b82f6" },
              { label: "Reports Today", value: ADMIN_STATS.reportsToday, icon: BarChart3, color: "#f59e0b" },
            ].map(k => (
              <div key={k.label} className="glass rounded-2xl p-5 border border-white/8">
                <div className="flex items-center gap-2 mb-3">
                  <k.icon className="w-4 h-4" style={{ color: k.color }} />
                  <span className="text-xs text-gray-500">{k.label}</span>
                </div>
                <div className="text-2xl font-black" style={{ color: k.color }}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Growth chart */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="font-bold mb-4">User & Analysis Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={USER_GROWTH} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", fontSize: "11px", color: "#f9fafb" }} />
                <Line type="monotone" dataKey="users" stroke="#7c3aed" dot={false} strokeWidth={2} name="Users" />
                <Line type="monotone" dataKey="analyses" stroke="#10b981" dot={false} strokeWidth={2} name="Analyses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "System" && (
        <div className="glass rounded-2xl border border-white/8 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="font-bold">System Health Monitor</h3>
          </div>
          <div className="divide-y divide-white/5">
            {SYSTEM_HEALTH.map(svc => (
              <div key={svc.name} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${svc.status === "healthy" ? "bg-emerald-400 shadow-glow-emerald" : "bg-amber-400 animate-pulse"}`} />
                  <span className="font-medium text-sm">{svc.name}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Latency</span>
                    <span className={`ml-1.5 font-bold ${svc.latency > 2000 ? "text-amber-400" : "text-emerald-400"}`}>{svc.latency}ms</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Uptime</span>
                    <span className={`ml-1.5 font-bold ${svc.uptime < 99 ? "text-amber-400" : "text-emerald-400"}`}>{svc.uptime}%</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${svc.status === "healthy" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>{svc.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-white/2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Last updated: just now · Auto-refreshes every 30s
            </div>
          </div>
        </div>
      )}

      {tab === "Moderation" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            {moderationItems.length} items pending review
          </div>
          {moderationItems.length > 0 ? (
            moderationItems.map(item => (
              <div key={item.id} className="glass rounded-2xl p-5 border border-amber-500/15">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400">{item.type}</span>
                      <span className="text-xs text-gray-500">{item.reported}</span>
                    </div>
                    <div className="font-medium text-sm">{item.content}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => approve(item.id)} className="btn btn-ghost text-xs py-1.5 text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20">
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => reject(item.id)} className="btn btn-ghost text-xs py-1.5 text-red-400 hover:bg-red-500/10 border-red-500/20">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-400 mb-3" />
              <div className="font-bold">All clear!</div>
              <div className="text-sm text-gray-500 mt-1">No items pending moderation</div>
            </div>
          )}
        </div>
      )}

      {tab === "Users" && (
        <div className="glass rounded-2xl p-6 border border-white/8">
          <h3 className="font-bold mb-4">User Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Total Users", value: ADMIN_STATS.totalUsers.toLocaleString() },
              { label: "Active (30d)", value: ADMIN_STATS.activeUsers.toLocaleString() },
              { label: "New Today", value: ADMIN_STATS.newUsersToday },
              { label: "Total Reports", value: ADMIN_STATS.totalReports.toLocaleString() },
              { label: "API Uptime", value: `${ADMIN_STATS.apiUptime}%` },
              { label: "Avg. AI Latency", value: `${ADMIN_STATS.modelLatency}s` },
            ].map(s => (
              <div key={s.label} className="bg-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                <div className="text-xl font-black">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
