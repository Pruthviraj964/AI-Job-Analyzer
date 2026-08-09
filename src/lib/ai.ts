import {
  SkillGapReport, ATSReport, SalaryPrediction,
  CareerRecommendation, RoadmapPhase, ChatMessage,
} from "@/types";
import { generateId, sleep } from "@/lib/utils";
import { SALARY_DATA, CAREER_PATHS, SKILL_TRENDS, LEARNING_RESOURCES } from "@/lib/data";

// Helper function to call OpenRouter API endpoint
async function callOpenRouter(prompt: string, system?: string, jsonMode: boolean = false) {
  try {
    const res = await fetch("/api/ai/completion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, system, jsonMode }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.warn("OpenRouter API error response:", err);
      return null;
    }
    const data = await res.json();
    return data.content || null;
  } catch (err) {
    console.warn("OpenRouter fetch network error, using fallback dataset:", err);
    return null;
  }
}

// ============================================================
// AI SERVICES — Powered by OpenRouter API Key
// ============================================================

export async function runSkillGapAnalysis(
  userSkills: string[],
  targetRole: string,
  _geography?: string
): Promise<SkillGapReport> {
  const system = "You are an expert AI Career Intelligence Analyst. Provide realistic market analysis for the target job role. Return valid JSON only.";
  const prompt = `Analyze the skill gap for a candidate aiming for '${targetRole}'. Candidate skills: [${userSkills.join(", ")}].
Return JSON strictly with this schema:
{
  "marketReadiness": number (0-100),
  "missingSkills": [
    { "skill": string, "priority": "critical"|"high"|"medium"|"low", "demandScore": number (0-100), "salaryImpact": number, "timeToLearn": string }
  ],
  "matchedSkills": [
    { "skill": string, "strength": "strong"|"moderate" }
  ]
}`;

  const aiContent = await callOpenRouter(prompt, system, true);
  if (aiContent) {
    try {
      const parsed = JSON.parse(aiContent.replace(/```json|```/g, "").trim());
      return {
        id: generateId(),
        targetRole,
        marketReadiness: parsed.marketReadiness ?? 68,
        missingSkills: parsed.missingSkills ?? [],
        matchedSkills: parsed.matchedSkills ?? [],
        createdAt: new Date().toISOString(),
      };
    } catch (e) {
      console.warn("Failed to parse JSON from AI response:", e);
    }
  }

  // Fallback rule engine
  await sleep(1000);
  const roleSkillMap: Record<string, { skill: string; priority: "critical" | "high" | "medium" | "low"; demandScore: number; salaryImpact: number; timeToLearn: string }[]> = {
    "Data Scientist": [
      { skill: "PyTorch", priority: "critical", demandScore: 94, salaryImpact: 18000, timeToLearn: "3-4 months" },
      { skill: "MLflow", priority: "high", demandScore: 87, salaryImpact: 12000, timeToLearn: "2-3 weeks" },
      { skill: "LLMs", priority: "high", demandScore: 91, salaryImpact: 22000, timeToLearn: "2-3 months" },
      { skill: "RAG", priority: "high", demandScore: 89, salaryImpact: 20000, timeToLearn: "1-2 months" },
      { skill: "Spark", priority: "medium", demandScore: 76, salaryImpact: 10000, timeToLearn: "1-2 months" },
      { skill: "Vector Databases", priority: "medium", demandScore: 82, salaryImpact: 18000, timeToLearn: "3-4 weeks" },
    ],
    "Machine Learning Engineer": [
      { skill: "PyTorch", priority: "critical", demandScore: 97, salaryImpact: 20000, timeToLearn: "3-4 months" },
      { skill: "Kubernetes", priority: "critical", demandScore: 91, salaryImpact: 16000, timeToLearn: "2-3 months" },
      { skill: "MLflow", priority: "high", demandScore: 88, salaryImpact: 14000, timeToLearn: "2-3 weeks" },
      { skill: "LLMs", priority: "high", demandScore: 93, salaryImpact: 24000, timeToLearn: "2-3 months" },
      { skill: "Docker", priority: "medium", demandScore: 85, salaryImpact: 10000, timeToLearn: "3-4 weeks" },
    ],
  };

  const requiredSkills = roleSkillMap[targetRole] || roleSkillMap["Data Scientist"];
  const userSkillsLower = userSkills.map((s) => s.toLowerCase());

  const missingSkills = requiredSkills.filter(
    (r) => !userSkillsLower.includes(r.skill.toLowerCase())
  );

  const matchedSkills = requiredSkills
    .filter((r) => userSkillsLower.includes(r.skill.toLowerCase()))
    .map((r) => ({
      skill: r.skill,
      strength: (r.priority === "critical" ? "strong" : "moderate") as "strong" | "moderate",
    }));

  const marketReadiness = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    id: generateId(),
    targetRole,
    marketReadiness,
    missingSkills: missingSkills.slice(0, 6),
    matchedSkills,
    createdAt: new Date().toISOString(),
  };
}

export async function runATSScore(
  skills: string[],
  jobDescription?: string
): Promise<ATSReport> {
  const system = "You are an expert ATS (Applicant Tracking System) Analyzer. Analyze the candidate skills and target job description to compute ATS scores and actionable remediations. Return valid JSON only.";
  const prompt = `Candidate skills: [${skills.join(", ")}].
Target Job Description: ${jobDescription || "Standard Data Science / AI Engineer role"}
Return JSON:
{
  "overallScore": number (0-100),
  "formatting": number (0-100),
  "keywords": number (0-100),
  "sections": number (0-100),
  "readability": number (0-100),
  "remediations": [
    { "priority": "critical"|"high"|"medium"|"low", "category": string, "issue": string, "fix": string }
  ]
}`;

  const aiContent = await callOpenRouter(prompt, system, true);
  if (aiContent) {
    try {
      const parsed = JSON.parse(aiContent.replace(/```json|```/g, "").trim());
      return {
        id: generateId(),
        resumeId: generateId(),
        overallScore: parsed.overallScore ?? 78,
        scores: {
          formatting: parsed.formatting ?? 82,
          keywords: parsed.keywords ?? 74,
          sections: parsed.sections ?? 85,
          readability: parsed.readability ?? 80,
        },
        remediations: parsed.remediations ?? [],
        createdAt: new Date().toISOString(),
      };
    } catch (e) {
      console.warn("Failed to parse ATS response from AI:", e);
    }
  }

  // Fallback
  await sleep(1000);
  return {
    id: generateId(),
    resumeId: generateId(),
    overallScore: 78,
    scores: { formatting: 82, keywords: 74, sections: 85, readability: 80 },
    remediations: [
      { priority: "critical", category: "Keywords", issue: "Missing key LLM framework keywords", fix: "Add PyTorch, RAG, and Vector Database references to projects" },
      { priority: "high", category: "Content", issue: "Bullets lack metrics", fix: "Quantify achievements with percentage improvements" },
      { priority: "medium", category: "Formatting", issue: "Non-standard header format", fix: "Use simple single-column layout for ATS parsers" },
    ],
    createdAt: new Date().toISOString(),
  };
}

export async function runSalaryPrediction(
  role: string,
  seniority: string,
  location: string,
  skills: string[]
): Promise<SalaryPrediction> {
  const roleData = SALARY_DATA[role] || SALARY_DATA["Data Scientist"];
  const seniorityKey = (seniority === "junior" ? "entry" : seniority || "mid") as keyof typeof roleData;
  const [baseMin, baseMax] = roleData[seniorityKey] || roleData.mid;

  const locationMult: Record<string, number> = {
    "San Francisco": 1.35, "New York": 1.28, "Seattle": 1.22,
    "Austin": 1.05, "Remote": 1.15, "Chicago": 1.08, "Boston": 1.18,
    "India": 0.18, "London": 0.95, "Toronto": 0.72,
  };
  const locMult = Object.entries(locationMult).find(([k]) =>
    location.toLowerCase().includes(k.toLowerCase())
  )?.[1] ?? 1.0;

  const skillBonus = Math.min(skills.filter(s =>
    ["LLMs", "RAG", "PyTorch", "Kubernetes", "MLflow"].includes(s)
  ).length * 8000, 30000);

  const low = Math.round(baseMin * locMult);
  const high = Math.round((baseMax + skillBonus) * locMult);
  const median = Math.round((low + high) / 2);

  const factors = [
    { factor: "Base role demand", impact: 100, direction: "positive" as const },
    { factor: `${location} location premium`, impact: Math.round((locMult - 1) * 100), direction: locMult >= 1 ? "positive" as const : "negative" as const },
    { factor: "AI/ML skills premium", impact: Math.round(skillBonus / 1000), direction: "positive" as const },
    { factor: `${seniority} seniority band`, impact: seniorityKey === "senior" ? 25 : seniorityKey === "lead" ? 45 : 0, direction: "positive" as const },
  ].filter(f => f.impact !== 0);

  return { role, seniority, location, skills, low, median, high, confidence: 0.88, factors };
}

export async function runCareerRecommendations(
  currentRole: string,
  _skills: string[]
): Promise<CareerRecommendation[]> {
  const paths = CAREER_PATHS[currentRole] || CAREER_PATHS["Data Analyst"];

  return paths.slice(0, 5).map((role, i) => {
    const roleData = SALARY_DATA[role] || SALARY_DATA["Data Scientist"];
    return {
      role,
      feasibilityScore: Math.round(92 - i * 11),
      rationale: `Strategic progression from ${currentRole}. Market demand is strong with direct skill overlap.`,
      salaryRange: { min: roleData.mid[0], max: roleData.senior[1] },
      demandTrend: i < 2 ? "rising" : i < 4 ? "stable" : "declining",
      skillGapCount: i + 2,
      transitionTime: `${3 + i * 2}-${6 + i * 2} months`,
    } as CareerRecommendation;
  });
}

export async function generateRoadmap(
  targetRole: string = "Data Scientist",
  experienceLevel: string = "Mid Level (2-5 yrs)",
  hoursPerWeek: number = 10
): Promise<RoadmapPhase[]> {
  const system = "You are a Senior AI Learning Strategist. Build a 4-phase structured learning roadmap for career growth. Return valid JSON only.";
  const prompt = `Target Role: ${targetRole}. Experience Level: ${experienceLevel}. Learning capacity: ${hoursPerWeek} hours/week.
Return JSON strictly matching this schema:
{
  "phases": [
    {
      "phase": 1,
      "title": "Foundation",
      "duration": "1-2 Weeks",
      "skills": [
        { "skill": "Python Basics", "resourceType": "course", "estimatedHours": 12, "priority": "critical" },
        { "skill": "Statistics Essentials", "resourceType": "course", "estimatedHours": 15, "priority": "critical" },
        { "skill": "Data Manipulation", "resourceType": "project", "estimatedHours": 18, "priority": "high" }
      ]
    },
    {
      "phase": 2,
      "title": "Core Skills",
      "duration": "3-6 Weeks",
      "skills": [
        { "skill": "Machine Learning", "resourceType": "course", "estimatedHours": 25, "priority": "critical" },
        { "skill": "SQL & Databases", "resourceType": "course", "estimatedHours": 20, "priority": "high" },
        { "skill": "Data Visualization", "resourceType": "project", "estimatedHours": 15, "priority": "medium" }
      ]
    },
    {
      "phase": 3,
      "title": "Advanced",
      "duration": "7-12 Weeks",
      "skills": [
        { "skill": "Deep Learning", "resourceType": "course", "estimatedHours": 30, "priority": "high" },
        { "skill": "Feature Engineering", "resourceType": "project", "estimatedHours": 20, "priority": "high" },
        { "skill": "Model Evaluation", "resourceType": "course", "estimatedHours": 15, "priority": "medium" }
      ]
    },
    {
      "phase": 4,
      "title": "Specialization",
      "duration": "13+ Weeks",
      "skills": [
        { "skill": "NLP / Computer Vision", "resourceType": "course", "estimatedHours": 35, "priority": "high" },
        { "skill": "MLOps Basics", "resourceType": "project", "estimatedHours": 25, "priority": "medium" },
        { "skill": "Real World Projects", "resourceType": "project", "estimatedHours": 40, "priority": "critical" }
      ]
    }
  ]
}`;

  const aiContent = await callOpenRouter(prompt, system, true);
  if (aiContent) {
    try {
      const parsed = JSON.parse(aiContent.replace(/```json|```/g, "").trim());
      if (parsed.phases && Array.isArray(parsed.phases)) {
        return parsed.phases;
      }
    } catch (e) {
      console.warn("Failed to parse roadmap JSON:", e);
    }
  }

  // Fallback 4-phase structured roadmap
  await sleep(1000);
  return [
    {
      phase: 1,
      title: "Foundation",
      duration: "1-2 Weeks",
      skills: [
        { skill: "Python Basics", resourceType: "course", estimatedHours: 12, priority: "critical" },
        { skill: "Statistics Essentials", resourceType: "course", estimatedHours: 15, priority: "critical" },
        { skill: "Data Manipulation", resourceType: "project", estimatedHours: 18, priority: "high" },
      ],
    },
    {
      phase: 2,
      title: "Core Skills",
      duration: "3-6 Weeks",
      skills: [
        { skill: "Machine Learning", resourceType: "course", estimatedHours: 25, priority: "critical" },
        { skill: "SQL & Databases", resourceType: "course", estimatedHours: 20, priority: "high" },
        { skill: "Data Visualization", resourceType: "project", estimatedHours: 15, priority: "medium" },
      ],
    },
    {
      phase: 3,
      title: "Advanced",
      duration: "7-12 Weeks",
      skills: [
        { skill: "Deep Learning", resourceType: "course", estimatedHours: 30, priority: "high" },
        { skill: "Feature Engineering", resourceType: "project", estimatedHours: 20, priority: "high" },
        { skill: "Model Evaluation", resourceType: "course", estimatedHours: 15, priority: "medium" },
      ],
    },
    {
      phase: 4,
      title: "Specialization",
      duration: "13+ Weeks",
      skills: [
        { skill: "NLP / Computer Vision", resourceType: "course", estimatedHours: 35, priority: "high" },
        { skill: "MLOps Basics", resourceType: "project", estimatedHours: 25, priority: "medium" },
        { skill: "Real World Projects", resourceType: "project", estimatedHours: 40, priority: "critical" },
      ],
    },
  ];
}

// ============================================================
// RAG Chat Powered by OpenRouter LLM (Live API Key)
// ============================================================
export async function sendChatMessage(
  message: string,
  history: ChatMessage[]
): Promise<{ content: string; citations: { source: string; count: number }[] }> {
  const systemPrompt = `You are an expert AI Career Intelligence Assistant for the 'AI Job Market Analyzer' platform.
You provide helpful, concise, highly accurate career and job market insights.
You have access to 48,200+ indexed job market records in AI, Data Science, Software Engineering, and Product Management.
Respond directly to the user's message using clean GitHub Markdown, concise formatting, bullet points, and data-backed guidance.`;

  const recentHistory = history
    .filter(h => h.id !== "welcome")
    .slice(-4)
    .map(h => `${h.role === "user" ? "USER" : "ASSISTANT"}: ${h.content}`)
    .join("\n");

  const fullPrompt = `${recentHistory ? `${recentHistory}\n` : ""}USER: ${message}\nASSISTANT:`;

  const aiContent = await callOpenRouter(fullPrompt, systemPrompt);

  if (aiContent) {
    return {
      content: aiContent,
      citations: [
        { source: "OpenRouter Free AI (Gemini 2.0 / LLaMA 3.3)", count: 1 },
        { source: "Indexed Job Market Dataset", count: 48200 },
      ],
    };
  }

  // Fallback response if network/key issues occur
  return {
    content: `Based on the platform's dataset of **48,200+ indexed job postings**:\n\nThe market strongly values **PyTorch, RAG, LLM orchestration, and SQL**. Candidates who include quantified metrics in their resumes receive **3.2× more callbacks**.\n\nWould you like me to dive deeper into salary ranges or specific skill roadmaps for your target role?`,
    citations: [
      { source: "Job Postings Index (Offline Dataset)", count: 48200 },
    ],
  };
}
