"use client";
import { useState, useMemo } from "react";
import { Search, Filter, Bookmark, Star, MapPin, Briefcase, DollarSign, Clock, X, ChevronDown } from "lucide-react";
import { JOBS } from "@/lib/data";
import { Job } from "@/types";
import { timeAgo, formatSalary } from "@/lib/utils";
import { useAppStore } from "@/lib/store/app";
import toast from "react-hot-toast";

const SENIORITY_OPTIONS = ["All", "entry", "mid", "senior", "lead"];
const TYPE_OPTIONS = ["All", "remote", "hybrid", "onsite"];
const INDUSTRY_OPTIONS = ["All", "AI/ML", "FinTech", "Technology", "Media/Tech", "Data/Tech", "SaaS/Productivity", "Finance/Quant"];

function JobCard({ job, onBookmark, isBookmarked }: { job: Job; onBookmark: () => void; isBookmarked: boolean }) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/5 card-hover group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold truncate">{job.title}</h3>
            {job.matchScore && job.matchScore >= 80 && (
              <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Top Match</span>
            )}
          </div>
          <div className="text-sm text-gray-400">{job.company} · {job.industry}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {job.matchScore && (
            <div className="flex items-center gap-1 text-sm font-bold" style={{ color: job.matchScore >= 80 ? "#10b981" : job.matchScore >= 60 ? "#f59e0b" : "#9ca3af" }}>
              <Star className="w-3.5 h-3.5 fill-current" />
              {job.matchScore}%
            </div>
          )}
          <button onClick={onBookmark} className={`p-1.5 rounded-lg transition-all ${isBookmarked ? "text-violet-400 bg-violet-500/15" : "text-gray-600 hover:text-gray-300"}`}>
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-400">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
        <span className="flex items-center gap-1 capitalize"><Briefcase className="w-3 h-3" />{job.type}</span>
        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatSalary(job.salaryMin)}–{formatSalary(job.salaryMax)}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(job.postedAt)}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {job.skills.slice(0, 5).map((s) => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/15">{s}</span>
        ))}
        {job.skills.length > 5 && <span className="text-xs text-gray-500">+{job.skills.length - 5}</span>}
      </div>

      <p className="text-xs text-gray-500 line-clamp-2">{job.description}</p>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${job.seniority === "senior" ? "bg-blue-500/15 text-blue-400" : job.seniority === "entry" ? "bg-emerald-500/15 text-emerald-400" : "bg-violet-500/15 text-violet-400"}`}>
          {job.seniority} level
        </span>
        <span className="text-xs text-gray-600">{job.companySize} employees</span>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [seniority, setSeniority] = useState("All");
  const [type, setType] = useState("All");
  const [industry, setIndustry] = useState("All");
  const [salaryMin, setSalaryMin] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const { addBookmark, removeBookmark, isBookmarked } = useAppStore();

  const filtered = useMemo(() => {
    return JOBS.filter((j) => {
      const q = query.toLowerCase();
      const matchesQuery = !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.skills.some(s => s.toLowerCase().includes(q)) || j.description.toLowerCase().includes(q);
      const matchesSeniority = seniority === "All" || j.seniority === seniority;
      const matchesType = type === "All" || j.type === type;
      const matchesIndustry = industry === "All" || j.industry === industry;
      const matchesSalary = j.salaryMin >= salaryMin;
      return matchesQuery && matchesSeniority && matchesType && matchesIndustry && matchesSalary;
    }).sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  }, [query, seniority, type, industry, salaryMin]);

  const handleBookmark = (job: Job) => {
    if (isBookmarked(job.id)) {
      const bookmarks_list = useAppStore.getState().bookmarks;
      const bm = bookmarks_list.find(b => b.entityId === job.id);
      if (bm) removeBookmark(bm.id);
      toast.success("Removed from bookmarks");
    } else {
      addBookmark({ entityType: "job", entityId: job.id, entityTitle: job.title, entityMeta: { company: job.company, salary: `${formatSalary(job.salaryMin)}-${formatSalary(job.salaryMax)}` }, collection: "Jobs" });
      toast.success("Bookmarked!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            className="input pl-10"
            placeholder="Search jobs, companies, skills... (e.g. 'ML Engineer remote')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`btn btn-ghost gap-2 ${showFilters ? "border-violet-500 text-violet-400" : ""}`}>
          <Filter className="w-4 h-4" /> Filters
          <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="glass rounded-2xl p-4 border border-white/8 animate-slide-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-medium">Seniority</label>
              <div className="flex flex-wrap gap-1.5">
                {SENIORITY_OPTIONS.map(o => (
                  <button key={o} onClick={() => setSeniority(o)} className={`text-xs px-2.5 py-1 rounded-full border transition-all capitalize ${seniority === o ? "border-violet-500 bg-violet-500/15 text-violet-300" : "border-white/10 text-gray-500 hover:text-gray-300"}`}>{o}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-medium">Work Type</label>
              <div className="flex flex-wrap gap-1.5">
                {TYPE_OPTIONS.map(o => (
                  <button key={o} onClick={() => setType(o)} className={`text-xs px-2.5 py-1 rounded-full border transition-all capitalize ${type === o ? "border-blue-500 bg-blue-500/15 text-blue-300" : "border-white/10 text-gray-500 hover:text-gray-300"}`}>{o}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-medium">Industry</label>
              <select className="input text-xs py-1.5" value={industry} onChange={e => setIndustry(e.target.value)}>
                {INDUSTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-medium">Min. Salary: {formatSalary(salaryMin)}</label>
              <input type="range" min="0" max="150000" step="10000" value={salaryMin} onChange={e => setSalaryMin(+e.target.value)}
                className="w-full accent-violet-500" />
            </div>
          </div>
        </div>
      )}

      {/* Results header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          <span className="text-white font-bold">{filtered.length}</span> jobs found
          {query && <span> for &ldquo;<span className="text-violet-400">{query}</span>&rdquo;</span>}
        </div>
        <div className="text-xs text-gray-500">Sorted by match score</div>
      </div>

      {/* Results grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} onBookmark={() => handleBookmark(job)} isBookmarked={isBookmarked(job.id)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-12 h-12 text-gray-700 mb-4" />
          <h3 className="font-bold text-lg mb-2">No jobs found</h3>
          <p className="text-gray-500 text-sm">Try different keywords or clear filters</p>
          <button onClick={() => { setQuery(""); setSeniority("All"); setType("All"); setIndustry("All"); setSalaryMin(0); }} className="btn btn-ghost mt-4 text-sm">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
