"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2, CheckCircle, Edit3, X, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store/app";
import { sleep } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

const DEMO_PARSED = {
  name: "Priya Sharma",
  skills: ["Python", "SQL", "Tableau", "Statistics", "A/B Testing", "Machine Learning", "scikit-learn", "pandas", "numpy", "Looker"],
  experience: [
    { company: "Spotify", title: "Data Analyst", duration: "2024 – Present" },
    { company: "Accenture", title: "Business Analyst", duration: "2022 – 2024" },
  ],
  education: [
    { institution: "IIT Bombay", degree: "B.Tech in Data Science", year: "2022" },
  ],
  certifications: ["Google Data Analytics Certificate", "AWS Cloud Practitioner"],
};

export default function ResumePage() {
  const { setResumeData, resumeUploaded, resumeData } = useAppStore();
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(resumeData);
  const [editingSkills, setEditingSkills] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    setParsing(true);
    await sleep(3000); // Simulate parsing
    const data = { ...DEMO_PARSED, name: file.name.replace(/\.(pdf|docx)$/i, "").replace(/[-_]/g, " ") };
    setParsed(data);
    setResumeData(data);
    setParsing(false);
    toast.success("Resume parsed successfully!");
  }, [setResumeData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
    maxFiles: 1,
  });

  const removeSkill = (skill: string) => {
    if (!parsed) return;
    const updated = { ...parsed, skills: parsed.skills.filter(s => s !== skill) };
    setParsed(updated);
    setResumeData(updated);
  };

  const addSkill = () => {
    if (!newSkill.trim() || !parsed) return;
    const updated = { ...parsed, skills: [...parsed.skills, newSkill.trim()] };
    setParsed(updated);
    setResumeData(updated);
    setNewSkill("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Resume Parser</h2>
        <p className="text-sm text-gray-400">Upload your PDF or DOCX resume. Our NLP pipeline extracts structured data in seconds.</p>
      </div>

      {/* Drop zone */}
      {!parsed && (
        <div
          {...getRootProps()}
          className={`glass rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${isDragActive ? "border-violet-500 bg-violet-500/10" : "border-white/15 hover:border-violet-500/50 hover:bg-white/2"}`}
        >
          <input {...getInputProps()} />
          {parsing ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              </div>
              <div className="font-bold">Parsing your resume...</div>
              <div className="text-sm text-gray-400">Running NLP entity extraction and skill normalization</div>
              <div className="flex gap-2 justify-center mt-4 text-xs text-gray-500">
                {["Extracting text", "Detecting sections", "Extracting skills", "Normalizing taxonomy"].map((step, i) => (
                  <span key={step} className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> {step}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-violet-400" />
              </div>
              <div className="font-bold text-lg mb-2">{isDragActive ? "Drop your resume here" : "Drag & drop your resume"}</div>
              <div className="text-gray-400 text-sm mb-4">or click to select a file</div>
              <div className="text-xs text-gray-600">Supports PDF and DOCX · Max 5MB</div>
            </>
          )}
        </div>
      )}

      {/* Parsed preview */}
      {parsed && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-bold">Resume parsed successfully</span>
            </div>
            <button onClick={() => { setParsed(null); setResumeData(null); }} className="btn btn-ghost text-xs py-1.5">
              <Upload className="w-3.5 h-3.5" /> Upload new
            </button>
          </div>

          {/* Name & Confidence */}
          <div className="glass rounded-2xl p-5 border border-white/8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-lg">{parsed.name}</div>
                <div className="text-sm text-gray-400">Parsed resume • Active version</div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                94% confidence
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Extracted Skills ({parsed.skills.length})</label>
                <button onClick={() => setEditingSkills(!editingSkills)} className="text-xs text-violet-400 flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> {editingSkills ? "Done" : "Edit"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {parsed.skills.map(s => (
                  <span key={s} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20">
                    {s}
                    {editingSkills && <button onClick={() => removeSkill(s)} className="ml-1 hover:text-red-400"><X className="w-3 h-3" /></button>}
                  </span>
                ))}
                {editingSkills && (
                  <div className="flex gap-2 w-full mt-2">
                    <input className="input text-xs py-1.5 flex-1" placeholder="Add skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} />
                    <button onClick={addSkill} className="btn btn-primary text-xs py-1.5 px-3">Add</button>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Work Experience</label>
              <div className="space-y-2">
                {parsed.experience.map((e, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                    <div>
                      <span className="font-medium">{e.title}</span>
                      <span className="text-gray-400"> at {e.company}</span>
                    </div>
                    <span className="text-xs text-gray-500">{e.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Education</label>
              {parsed.education.map((e, i) => (
                <div key={i} className="text-sm text-gray-400">
                  <span className="text-white font-medium">{e.degree}</span> · {e.institution} · {e.year}
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Certifications</label>
              <div className="flex flex-wrap gap-2">
                {parsed.certifications.map(c => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/ats" className="btn btn-primary justify-center py-3">
              <Zap className="w-4 h-4" /> Check ATS Score
            </Link>
            <Link href="/skill-gap" className="btn btn-secondary justify-center py-3">
              <FileText className="w-4 h-4" /> Run Skill Gap Analysis
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
