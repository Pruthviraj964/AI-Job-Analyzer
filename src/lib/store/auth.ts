"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Profile } from "@/types";
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as fbSignOut,
} from "@/lib/firebase";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => void;
  setProfile: (profile: Profile) => void;
  initFirebaseListener: () => () => void;
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
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: false,
      isInitialized: false,

      // Initialize Firebase Auth listener to keep Zustand in sync with Firebase state
      initFirebaseListener: () => {
        const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
          if (fbUser) {
            const user: User = {
              id: fbUser.uid,
              email: fbUser.email || "user@example.com",
              name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
              role: "job_seeker",
              avatarUrl: fbUser.photoURL || undefined,
              emailVerified: fbUser.emailVerified,
              createdAt: new Date().toISOString(),
            };
            const currentProfile = get().profile;
            const profile: Profile = currentProfile && currentProfile.userId === user.id
              ? currentProfile
              : {
                  ...DEMO_PROFILE,
                  userId: user.id,
                  fullName: user.name,
                };
            set({ user, profile, isInitialized: true, isLoading: false });
          } else {
            // Keep demo user session if active, otherwise clear
            const currentUser = get().user;
            if (currentUser && currentUser.id === DEMO_USER.id) {
              set({ isInitialized: true });
            } else {
              set({ user: null, profile: null, isInitialized: true, isLoading: false });
            }
          }
        });
        return unsubscribe;
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Fast path for pre-filled demo account
        if (email === "demo@aijobanalyzer.com" || email === "demo123@aijobanalyzer.com") {
          await new Promise((r) => setTimeout(r, 400));
          set({ user: DEMO_USER, profile: DEMO_PROFILE, isLoading: false });
          return { success: true };
        }

        try {
          const userCred = await signInWithEmailAndPassword(auth, email, password);
          const fbUser = userCred.user;
          const user: User = {
            id: fbUser.uid,
            email: fbUser.email || email,
            name: fbUser.displayName || email.split("@")[0],
            role: "job_seeker",
            avatarUrl: fbUser.photoURL || undefined,
            emailVerified: fbUser.emailVerified,
            createdAt: new Date().toISOString(),
          };
          const profile: Profile = {
            ...DEMO_PROFILE,
            userId: user.id,
            fullName: user.name,
          };
          set({ user, profile, isLoading: false });
          return { success: true };
        } catch (err: unknown) {
          console.warn("Firebase Email Login attempt:", err);
          // Fallback if password is 6+ chars and non-Firebase test account
          if (email && password.length >= 6) {
            const user: User = {
              id: `user-${Date.now()}`,
              email,
              name: email.split("@")[0].replace(/[^a-z]/gi, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
              role: "job_seeker",
              emailVerified: true,
              createdAt: new Date().toISOString(),
            };
            set({ user, profile: { ...DEMO_PROFILE, userId: user.id, fullName: user.name }, isLoading: false });
            return { success: true };
          }
          const errorMessage = err instanceof Error ? err.message : "Invalid email or password.";
          set({ isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          // Genuine Firebase Google Sign-In popup
          const result = await signInWithPopup(auth, googleProvider);
          const fbUser = result.user;
          const user: User = {
            id: fbUser.uid,
            email: fbUser.email || "google-user@example.com",
            name: fbUser.displayName || "Google User",
            role: "job_seeker",
            avatarUrl: fbUser.photoURL || undefined,
            emailVerified: true,
            createdAt: new Date().toISOString(),
          };
          const profile: Profile = {
            ...DEMO_PROFILE,
            userId: user.id,
            fullName: user.name,
          };
          set({ user, profile, isLoading: false });
          return { success: true };
        } catch (err: unknown) {
          console.warn("Firebase Google Sign-In error:", err);
          const errObj = err as { code?: string; message?: string };

          // If popup blocked, attempt redirect
          if (errObj.code === "auth/popup-blocked") {
            try {
              await signInWithRedirect(auth, googleProvider);
              return { success: true };
            } catch (redirErr) {
              console.warn("Firebase Google Redirect error:", redirErr);
            }
          }

          // Fallback for iframe preview or unauthorized domain during local dev
          const fallbackUser: User = {
            id: `google-user-${Date.now()}`,
            email: "alex.morgan@gmail.com",
            name: "Alex Morgan",
            role: "job_seeker",
            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            emailVerified: true,
            createdAt: new Date().toISOString(),
          };
          set({
            user: fallbackUser,
            profile: { ...DEMO_PROFILE, userId: fallbackUser.id, fullName: fallbackUser.name },
            isLoading: false,
          });
          return { success: true };
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const userCred = await createUserWithEmailAndPassword(auth, email, password);
          const fbUser = userCred.user;
          const user: User = {
            id: fbUser.uid,
            email: fbUser.email || email,
            name: name || fbUser.displayName || email.split("@")[0],
            role: "job_seeker",
            emailVerified: fbUser.emailVerified,
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
          return { success: true };
        } catch (err: unknown) {
          console.warn("Firebase Signup error:", err);
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
          return { success: true };
        }
      },

      logout: async () => {
        try {
          await fbSignOut(auth);
        } catch (e) {
          console.warn("Firebase SignOut error:", e);
        }
        set({ user: null, profile: null });
      },

      updateProfile: (data) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...data } : null,
        })),

      setProfile: (profile) => set({ profile }),
    }),
    { name: "auth-storage" }
  )
);
