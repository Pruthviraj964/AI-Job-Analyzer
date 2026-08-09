"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Profile } from "@/types";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Profile>) => void;
  setProfile: (profile: Profile) => void;
}

const DEMO_USER: User = {
  id: "user-demo-001",
  email: "demo@aijobanalyzer.com",
  name: "Priya Sharma",
  role: "job_seeker",
  emailVerified: true,
  createdAt: "2026-01-15T10:00:00Z",
};

const DEMO_PROFILE: Profile = {
  userId: "user-demo-001",
  fullName: "Priya Sharma",
  currentRole: "Data Analyst",
  targetRole: "Data Scientist",
  experienceYears: 3,
  location: "San Francisco, CA",
  skills: ["Python", "SQL", "Tableau", "Statistics", "A/B Testing", "Machine Learning"],
  preferences: { remoteOnly: false, industry: "Technology", seniority: "mid" },
  completionScore: 72,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        // Accept demo creds or any email/password
        if (email && password.length >= 6) {
          const user = { ...DEMO_USER, email, name: email.split("@")[0].replace(/[^a-z]/gi, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
          set({ user, profile: DEMO_PROFILE, isLoading: false });
          return true;
        }
        set({ isLoading: false });
        return false;
      },

      signup: async (name: string, email: string, _password: string) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000));
        const user: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          role: "job_seeker",
          emailVerified: false,
          createdAt: new Date().toISOString(),
        };
        const profile: Profile = {
          userId: user.id,
          fullName: name,
          currentRole: "",
          targetRole: "",
          experienceYears: 0,
          location: "",
          skills: [],
          preferences: { remoteOnly: false, industry: "", seniority: "entry" },
          completionScore: 10,
        };
        set({ user, profile, isLoading: false });
        return true;
      },

      logout: () => set({ user: null, profile: null }),

      updateProfile: (data) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...data } : null,
        })),

      setProfile: (profile) => set({ profile }),
    }),
    { name: "auth-storage" }
  )
);
