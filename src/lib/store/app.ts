"use client";
import { create } from "zustand";
import { Notification, Bookmark, Report } from "@/types";
import { generateId } from "@/lib/utils";

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (b: Omit<Bookmark, "id" | "createdAt">) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (entityId: string) => boolean;

  // Reports
  reports: Report[];
  addReport: (r: Omit<Report, "id" | "createdAt">) => void;

  // Resume
  resumeUploaded: boolean;
  resumeData: {
    skills: string[];
    experience: { company: string; title: string; duration: string }[];
    education: { institution: string; degree: string; year: string }[];
    certifications: string[];
    name: string;
  } | null;
  setResumeData: (data: AppState["resumeData"]) => void;
}

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: "notif-1", type: "report_ready", title: "Skill Gap Report Ready", message: "Your analysis for 'Data Scientist' role has completed. You have 4 critical skill gaps.", read: false, createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: "notif-2", type: "new_match", title: "12 New Job Matches", message: "New postings match your profile for Senior Data Scientist roles in SF.", read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "notif-3", type: "tip", title: "Boost Your ATS Score", message: "Add quantified achievements to your experience section to improve ATS ranking by ~15 points.", read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "notif-4", type: "security", title: "New Login Detected", message: "A new sign-in was detected from Chrome on Windows.", read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const useAppStore = create<AppState>()((set, get) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  darkMode: true,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  notifications: DEMO_NOTIFICATIONS,
  addNotification: (n) =>
    set((s) => ({
      notifications: [{ ...n, id: generateId(), createdAt: new Date().toISOString(), read: false }, ...s.notifications],
    })),
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  bookmarks: [],
  addBookmark: (b) =>
    set((s) => ({
      bookmarks: [{ ...b, id: generateId(), createdAt: new Date().toISOString() }, ...s.bookmarks],
    })),
  removeBookmark: (id) =>
    set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
  isBookmarked: (entityId) => get().bookmarks.some((b) => b.entityId === entityId),

  reports: [],
  addReport: (r) =>
    set((s) => ({
      reports: [{ ...r, id: generateId(), createdAt: new Date().toISOString() }, ...s.reports],
    })),

  resumeUploaded: false,
  resumeData: null,
  setResumeData: (data) => set({ resumeData: data, resumeUploaded: !!data }),
}));
