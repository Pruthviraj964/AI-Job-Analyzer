// ============================================================
// GLOBAL TYPES
// ============================================================

export type UserRole = "job_seeker" | "recruiter" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface Profile {
  userId: string;
  fullName: string;
  currentRole: string;
  targetRole: string;
  experienceYears: number;
  location: string;
  skills: string[];
  preferences: {
    remoteOnly: boolean;
    industry: string;
    seniority: string;
  };
  completionScore: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: "remote" | "hybrid" | "onsite";
  seniority: "entry" | "mid" | "senior" | "lead";
  salaryMin: number;
  salaryMax: number;
  salaryPredicted?: number;
  skills: string[];
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedAt: string;
  status: "active" | "archived";
  matchScore?: number;
  industry: string;
  companySize: string;
}

export interface SkillTrend {
  skill: string;
  category: string;
  trend: { month: string; count: number }[];
  totalMentions: number;
  growthRate: number;
  avgSalaryImpact: number;
}

export interface SkillGapReport {
  id: string;
  targetRole: string;
  marketReadiness: number;
  missingSkills: {
    skill: string;
    priority: "critical" | "high" | "medium" | "low";
    demandScore: number;
    salaryImpact: number;
    timeToLearn: string;
  }[];
  matchedSkills: { skill: string; strength: "strong" | "moderate" }[];
  createdAt: string;
}

export interface ATSReport {
  id: string;
  resumeId: string;
  overallScore: number;
  scores: {
    formatting: number;
    keywords: number;
    sections: number;
    readability: number;
  };
  remediations: {
    priority: "critical" | "high" | "medium" | "low";
    category: string;
    issue: string;
    fix: string;
  }[];
  createdAt: string;
}

export interface SalaryPrediction {
  role: string;
  seniority: string;
  location: string;
  skills: string[];
  low: number;
  median: number;
  high: number;
  confidence: number;
  factors: { factor: string; impact: number; direction: "positive" | "negative" }[];
}

export interface CareerRecommendation {
  role: string;
  feasibilityScore: number;
  rationale: string;
  salaryRange: { min: number; max: number };
  demandTrend: "rising" | "stable" | "declining";
  skillGapCount: number;
  transitionTime: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  skills: {
    skill: string;
    resourceType: "course" | "project" | "certification" | "article";
    estimatedHours: number;
    priority: "critical" | "high" | "medium";
    resources: { title: string; url: string; platform: string }[];
    completed?: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: { source: string; count: number }[];
}

export interface Notification {
  id: string;
  type: "report_ready" | "new_match" | "security" | "tip" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  entityType: "job" | "report" | "view";
  entityId: string;
  entityTitle: string;
  entityMeta: Record<string, unknown>;
  collection: string;
  createdAt: string;
}

export interface Report {
  id: string;
  type: "skill_gap" | "ats_score" | "salary_prediction" | "roadmap";
  title: string;
  summary: string;
  score?: number;
  payload: Record<string, unknown>;
  createdAt: string;
}
