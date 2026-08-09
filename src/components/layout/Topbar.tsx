"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, Moon, Upload, FileText, ChevronDown, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useAppStore } from "@/lib/store/app";
import Link from "next/link";

export function Topbar() {
  const { user, logout } = useAuthStore();
  const { notifications } = useAppStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length || 3;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="px-8 py-5 border-b border-white/5 bg-[#070913]/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
      {/* Greeting Title */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Welcome back, {user?.name || "Demo"} 👋
        </h1>
        <p className="text-xs text-gray-400 mt-1">Here&apos;s your personalized career intelligence overview</p>
      </div>

      {/* Top Controls & Profile Pill */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, skills, companies..."
            className="w-full bg-[#11162a] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-200 placeholder-gray-400 focus:outline-none focus:border-violet-500 transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘ K</kbd>
        </div>

        {/* Notifications */}
        <Link href="/notifications" className="relative p-2.5 rounded-xl bg-[#11162a] border border-white/10 text-gray-300 hover:text-white hover:border-violet-500/40 transition-all">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#070913]">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Theme Toggle */}
        <button className="p-2.5 rounded-xl bg-[#11162a] border border-white/10 text-gray-300 hover:text-white hover:border-violet-500/40 transition-all">
          <Moon className="w-4 h-4" />
        </button>

        {/* User Pill */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 bg-[#11162a] border border-white/10 rounded-xl pl-1.5 pr-3 py-1.5 hover:border-violet-500/40 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {user?.name?.[0] || "D"}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white leading-none">{user?.name || "Demo"}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Job Seeker</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#11162a] border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-fade-in">
              <Link href="/profile" className="block px-4 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white">Profile Settings</Link>
              <Link href="/reports" className="block px-4 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white">My Reports</Link>
              <div className="border-t border-white/5 my-1" />
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
