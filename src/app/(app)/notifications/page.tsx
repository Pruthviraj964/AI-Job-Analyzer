"use client";
import { Bell, CheckCheck, Info, Zap, Shield, Star } from "lucide-react";
import { useAppStore } from "@/lib/store/app";
import { Notification } from "@/types";
import { timeAgo } from "@/lib/utils";
import toast from "react-hot-toast";

const TYPE_META: Record<string, { icon: React.ElementType; color: string }> = {
  report_ready: { icon: Zap, color: "#10b981" },
  new_match: { icon: Star, color: "#7c3aed" },
  tip: { icon: Info, color: "#3b82f6" },
  security: { icon: Shield, color: "#f59e0b" },
  system: { icon: Bell, color: "#9ca3af" },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllRead } = useAppStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Notifications</h2>
          <p className="text-sm text-gray-400 mt-1">{unread > 0 ? `${unread} unread` : "All caught up"}</p>
        </div>
        {unread > 0 && (
          <button onClick={() => { markAllRead(); toast.success("All marked as read"); }} className="btn btn-ghost text-sm">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map(n => {
          const meta = TYPE_META[n.type] || TYPE_META.system;
          return (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`glass rounded-2xl p-4 border card-hover cursor-pointer transition-all ${!n.read ? "border-violet-500/25 bg-violet-500/5" : "border-white/8"}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}30` }}>
                  <meta.icon className="w-4 h-4" style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm">{n.title}</span>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-400">{n.message}</p>
                  <span className="text-xs text-gray-600 mt-1 block">{timeAgo(n.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <Bell className="w-10 h-10 text-gray-700 mb-4" />
            <div className="font-bold text-lg mb-2">No notifications</div>
            <div className="text-sm text-gray-500">You&apos;re all caught up!</div>
          </div>
        )}
      </div>
    </div>
  );
}
