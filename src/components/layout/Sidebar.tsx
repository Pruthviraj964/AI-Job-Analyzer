"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain, LayoutDashboard, Search, Target, ScanLine,
  Map, MessageSquare, TrendingUp, LineChart, Building2,
  GitCompare, Bookmark, FileBarChart, Bell, User, Settings,
  Crown, ChevronLeft, ChevronRight, Sparkles
} from "lucide-react";
import { useAppStore } from "@/lib/store/app";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Job Search", icon: Search, href: "/jobs" },
    ],
  },
  {
    title: "AI TOOLS",
    items: [
      { label: "Skill Gap", icon: Target, href: "/skill-gap" },
      { label: "ATS Score", icon: ScanLine, href: "/ats" },
      { label: "Roadmap", icon: Map, href: "/roadmap" },
      { label: "AI Chat", icon: MessageSquare, href: "/chat" },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { label: "Skill Trends", icon: TrendingUp, href: "/trends" },
      { label: "Market Insights", icon: LineChart, href: "/analytics" },
      { label: "Company Insights", icon: Building2, href: "/analytics" },
      { label: "Compare", icon: GitCompare, href: "/compare" },
    ],
  },
  {
    title: "MY SPACE",
    items: [
      { label: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
      { label: "Reports", icon: FileBarChart, href: "/reports" },
      { label: "Notifications", icon: Bell, href: "/notifications" },
      { label: "Profile", icon: User, href: "/profile" },
      { label: "Settings", icon: Settings, href: "/profile" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-40 flex flex-col border-r border-white/5 transition-all duration-300",
        "bg-[#070913]",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header / Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
          <Brain className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <div className="min-w-0">
            <div className="font-bold text-base text-white tracking-tight leading-none">AI Job Analyzer</div>
            <div className="text-[11px] text-gray-400 mt-1 font-medium">Career Intelligence</div>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 no-scrollbar">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className="space-y-1">
            {group.title && sidebarOpen && (
              <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                {group.title}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "nav-item-active"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Unlimited Pro Banner */}
      {sidebarOpen && (
        <div className="px-3 py-3">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-violet-950/40 to-indigo-950/20 border border-violet-500/20 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Unlimited Pro</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-3 leading-tight">Upgrade for advanced AI features</p>
            <button className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-purple-500/30 hover:opacity-95 transition-opacity">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 text-xs font-medium transition-all"
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
