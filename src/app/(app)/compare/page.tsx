"use client";
import { useState } from "react";
import { GitCompare, Plus, X, TrendingUp, DollarSign, BarChart3, Award } from "lucide-react";
import { SKILL_TRENDS, SALARY_DATA } from "@/lib/data";
import { formatSalary } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ALL_ROLES = Object.keys(SALARY_DATA);
const ALL_SKILLS_LIST = SKILL_TRENDS.map(t => t.skill);

export default function ComparePage() {
  const [mode, setMode] = useState<"roles" | "skills">("roles");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["Data Scientist", "Machine Learning Engineer"]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Python", "LLMs", "PyTorch"]);

  const addRole = (role: string) => {
    if (!selectedRoles.includes(role) && selectedRoles.length < 4) {
      setSelectedRoles([...selectedRoles, role]);
    }
  };
  const removeRole = (role: string) => setSelectedRoles(selectedRoles.filter(r => r !== role));

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill) && selectedSkills.length < 5) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  const removeSkill = (skill: string) => setSelectedSkills(selectedSkills.filter(s => s !== skill));

  // Role comparison data
  const roleCompData = selectedRoles.map(role => {
    const data = SALARY_DATA[role];
    return {
      role: role.replace("Machine Learning", "ML").replace("Engineer", "Eng.").replace("Scientist", "Sci."),
      "Entry Salary": Math.round((data.entry[0] + data.entry[1]) / 2),
      "Mid Salary": Math.round((data.mid[0] + data.mid[1]) / 2),
      "Senior Salary": Math.round((data.senior[0] + data.senior[1]) / 2),
    };
  });

  // Skill comparison data
  const skillCompData = selectedSkills.map(skill => {
    const trend = SKILL_TRENDS.find(t => t.skill === skill);
    return {
      skill,
      Growth: trend?.growthRate ?? 0,
      Mentions: Math.round((trend?.totalMentions ?? 0) / 1000),
      "Salary Impact": Math.round((trend?.avgSalaryImpact ?? 0) / 1000),
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Mode tabs */}
      <div className="flex gap-2">
        {["roles", "skills"].map((m) => (
          <button key={m} onClick={() => setMode(m as "roles" | "skills")}
            className={`btn capitalize ${mode === m ? "btn-primary" : "btn-ghost"}`}
          >
            {m === "roles" ? <BarChart3 className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            Compare {m}
          </button>
        ))}
      </div>

      {mode === "roles" && (
        <div className="space-y-6">
          {/* Role selector */}
          <div className="glass rounded-2xl p-5 border border-white/8">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {selectedRoles.map(r => (
                <span key={r} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                  {r}
                  <button onClick={() => removeRole(r)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {selectedRoles.length < 4 && (
                <select className="input w-auto text-sm py-1.5" onChange={e => { addRole(e.target.value); e.target.value = ""; }} defaultValue="">
                  <option value="" disabled>+ Add role</option>
                  {ALL_ROLES.filter(r => !selectedRoles.includes(r)).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              )}
            </div>
            <div className="text-xs text-gray-500">Compare up to 4 roles · Select additional roles above</div>
          </div>

          {/* Salary chart */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Salary Comparison by Seniority
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={roleCompData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="role" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", color: "#f9fafb" }}
                  formatter={(v: any) => [`$${(Number(v) / 1000).toFixed(0)}k`]}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
                <Bar dataKey="Entry Salary" fill="#6b7280" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Mid Salary" fill="#7c3aed" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Senior Salary" fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Role table */}
          <div className="glass rounded-2xl p-6 border border-white/8 overflow-x-auto">
            <h3 className="font-bold mb-4">Detailed Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left pb-3 text-gray-400 font-medium">Role</th>
                  <th className="text-right pb-3 text-gray-400 font-medium">Entry</th>
                  <th className="text-right pb-3 text-gray-400 font-medium">Mid</th>
                  <th className="text-right pb-3 text-gray-400 font-medium">Senior</th>
                  <th className="text-right pb-3 text-gray-400 font-medium">Lead</th>
                </tr>
              </thead>
              <tbody>
                {selectedRoles.map(role => {
                  const d = SALARY_DATA[role];
                  return (
                    <tr key={role} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-3 font-medium">{role}</td>
                      <td className="py-3 text-right text-gray-400">{formatSalary(d.entry[0])}–{formatSalary(d.entry[1])}</td>
                      <td className="py-3 text-right text-violet-400">{formatSalary(d.mid[0])}–{formatSalary(d.mid[1])}</td>
                      <td className="py-3 text-right text-emerald-400">{formatSalary(d.senior[0])}–{formatSalary(d.senior[1])}</td>
                      <td className="py-3 text-right text-amber-400">{formatSalary(d.lead[0])}–{formatSalary(d.lead[1])}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mode === "skills" && (
        <div className="space-y-6">
          {/* Skill selector */}
          <div className="glass rounded-2xl p-5 border border-white/8">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {selectedSkills.map(s => (
                <span key={s} className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20">
                  {s}
                  <button onClick={() => removeSkill(s)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
              {selectedSkills.length < 5 && (
                <select className="input w-auto text-sm py-1.5" onChange={e => { addSkill(e.target.value); e.target.value = ""; }} defaultValue="">
                  <option value="" disabled>+ Add skill</option>
                  {ALL_SKILLS_LIST.filter(s => !selectedSkills.includes(s)).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
            </div>
            <div className="text-xs text-gray-500">Compare up to 5 skills by demand, salary impact, and growth</div>
          </div>

          {/* Skill comparison chart */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="font-bold mb-4">Skills: Growth Rate vs Salary Impact</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={skillCompData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="skill" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "12px", color: "#f9fafb" }} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
                <Bar dataKey="Growth" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Salary Impact" name="Salary Impact ($k)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Skill table */}
          <div className="glass rounded-2xl p-6 border border-white/8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left pb-3 text-gray-400 font-medium">Skill</th>
                  <th className="text-right pb-3 text-gray-400 font-medium">Growth</th>
                  <th className="text-right pb-3 text-gray-400 font-medium">Mentions</th>
                  <th className="text-right pb-3 text-gray-400 font-medium">Salary Impact</th>
                </tr>
              </thead>
              <tbody>
                {selectedSkills.map(skill => {
                  const t = SKILL_TRENDS.find(st => st.skill === skill);
                  return (
                    <tr key={skill} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-3 font-medium">{skill}</td>
                      <td className={`py-3 text-right font-bold ${(t?.growthRate ?? 0) > 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {(t?.growthRate ?? 0) > 0 ? "+" : ""}{t?.growthRate ?? 0}%
                      </td>
                      <td className="py-3 text-right text-gray-400">{((t?.totalMentions ?? 0) / 1000).toFixed(1)}k</td>
                      <td className="py-3 text-right text-emerald-400">+${((t?.avgSalaryImpact ?? 0) / 1000).toFixed(0)}k</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
