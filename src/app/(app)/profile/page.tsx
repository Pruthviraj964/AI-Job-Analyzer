"use client";
import { useState } from "react";
import { Settings, User, Shield, Bell, Save, Loader2, LogOut, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useRouter } from "next/navigation";
import { ALL_SKILLS } from "@/lib/data";
import toast from "react-hot-toast";

const TABS = ["Profile", "Skills", "Preferences", "Account"];

export default function ProfilePage() {
  const { user, profile, updateProfile, logout } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState("Profile");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: profile?.fullName || user?.name || "",
    currentRole: profile?.currentRole || "",
    targetRole: profile?.targetRole || "",
    experienceYears: profile?.experienceYears || 0,
    location: profile?.location || "",
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>(profile?.skills || []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateProfile({ ...form, skills: selectedSkills });
    setSaving(false);
    toast.success("Profile updated!");
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Tab nav */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/8 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-violet-600 text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Profile */}
      {tab === "Profile" && (
        <div className="glass rounded-2xl p-6 border border-white/8 space-y-5">
          <h3 className="font-bold flex items-center gap-2"><User className="w-4 h-4 text-violet-400" /> Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <input className="input" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input className="input opacity-60" value={user?.email || ""} disabled />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Current Role</label>
              <input className="input" value={form.currentRole} onChange={e => setForm(f => ({ ...f, currentRole: e.target.value }))} placeholder="e.g. Data Analyst" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Target Role</label>
              <input className="input" value={form.targetRole} onChange={e => setForm(f => ({ ...f, targetRole: e.target.value }))} placeholder="e.g. Data Scientist" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Years of Experience</label>
              <input type="number" className="input" value={form.experienceYears} onChange={e => setForm(f => ({ ...f, experienceYears: +e.target.value }))} min={0} max={30} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Location</label>
              <input className="input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="San Francisco, CA" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      )}

      {/* Skills */}
      {tab === "Skills" && (
        <div className="glass rounded-2xl p-6 border border-white/8">
          <h3 className="font-bold mb-1 flex items-center gap-2"><Settings className="w-4 h-4 text-violet-400" /> Your Skills</h3>
          <p className="text-sm text-gray-400 mb-4">{selectedSkills.length} skills selected · Used in all AI analyses</p>
          <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto mb-4">
            {ALL_SKILLS.map(skill => (
              <button key={skill} onClick={() => toggleSkill(skill)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-all ${selectedSkills.includes(skill) ? "border-violet-500 bg-violet-500/20 text-violet-300" : "border-white/10 text-gray-400 hover:border-white/25"}`}
              >
                {selectedSkills.includes(skill) && <span className="mr-1">✓</span>}
                {skill}
              </button>
            ))}
          </div>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Skills</>}
          </button>
        </div>
      )}

      {/* Preferences */}
      {tab === "Preferences" && (
        <div className="glass rounded-2xl p-6 border border-white/8 space-y-5">
          <h3 className="font-bold flex items-center gap-2"><Bell className="w-4 h-4 text-violet-400" /> Preferences</h3>
          <div className="space-y-4">
            {[
              { label: "New job match alerts", desc: "Notify when high-match jobs appear" },
              { label: "Weekly market digest", desc: "Summary of skill trends every Monday" },
              { label: "Report completion alerts", desc: "Notify when AI analyses finish" },
              { label: "Career tips & insights", desc: "Periodic data-backed career tips" },
            ].map(pref => (
              <div key={pref.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-sm font-medium">{pref.label}</div>
                  <div className="text-xs text-gray-500">{pref.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-5 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account */}
      {tab === "Account" && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-violet-400" /> Security</h3>
            <div className="space-y-3">
              <button className="btn btn-ghost w-full justify-start text-sm">Change Password</button>
              <button className="btn btn-ghost w-full justify-start text-sm">Enable Two-Factor Authentication</button>
              <button className="btn btn-ghost w-full justify-start text-sm">Download My Data</button>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 border border-red-500/20 bg-red-500/5">
            <h3 className="font-bold mb-4 text-red-400">Danger Zone</h3>
            <div className="space-y-3">
              <button onClick={handleLogout} className="btn w-full justify-start text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
              <button onClick={() => toast.error("Account deletion requires email confirmation")} className="btn w-full justify-start text-sm bg-red-500/5 text-red-500 border border-red-500/15 hover:bg-red-500/15">
                <X className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
