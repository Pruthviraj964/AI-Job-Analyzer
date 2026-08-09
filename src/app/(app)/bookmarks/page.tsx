"use client";
import { Bookmark, Trash2, ExternalLink, Briefcase, FileBarChart } from "lucide-react";
import { useAppStore } from "@/lib/store/app";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useAppStore();

  const jobBookmarks = bookmarks.filter(b => b.entityType === "job");
  const reportBookmarks = bookmarks.filter(b => b.entityType === "report");
  const otherBookmarks = bookmarks.filter(b => b.entityType === "view");

  const handleRemove = (id: string) => {
    removeBookmark(id);
    toast.success("Bookmark removed");
  };

  if (bookmarks.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
            <Bookmark className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">No bookmarks yet</h2>
          <p className="text-gray-400 mb-6">Bookmark jobs, reports, and searches to come back to them later.</p>
          <Link href="/jobs" className="btn btn-primary">Browse Jobs</Link>
        </div>
      </div>
    );
  }

  const BookmarkList = ({ items, title, icon: Icon, emptyMsg, href }: {
    items: typeof bookmarks; title: string; icon: React.ElementType; emptyMsg: string; href: string;
  }) => (
    <div className="glass rounded-2xl border border-white/8 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <h3 className="font-bold flex items-center gap-2">
          <Icon className="w-4 h-4 text-violet-400" /> {title} ({items.length})
        </h3>
        <Link href={href} className="text-xs text-violet-400 hover:text-violet-300">Browse more →</Link>
      </div>
      {items.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-gray-500">{emptyMsg}</div>
      ) : (
        <div className="divide-y divide-white/5">
          {items.map(bm => (
            <div key={bm.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{bm.entityTitle}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {Object.entries(bm.entityMeta).map(([k, v]) => `${v}`).join(" · ")}
                  {" · "}{timeAgo(bm.createdAt)}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <Link href={bm.entityType === "job" ? `/jobs` : bm.entityType === "report" ? "/reports" : "/"} className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button onClick={() => handleRemove(bm.id)} className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold">Your Bookmarks</h2>
        <p className="text-sm text-gray-400 mt-1">{bookmarks.length} saved items across {new Set(bookmarks.map(b => b.collection)).size} collections</p>
      </div>

      <BookmarkList items={jobBookmarks} title="Saved Jobs" icon={Briefcase} emptyMsg="No jobs bookmarked yet. Browse jobs and hit the bookmark icon." href="/jobs" />
      <BookmarkList items={reportBookmarks} title="Saved Reports" icon={FileBarChart} emptyMsg="No reports bookmarked." href="/reports" />
      {otherBookmarks.length > 0 && (
        <BookmarkList items={otherBookmarks} title="Other Saves" icon={Bookmark} emptyMsg="" href="/" />
      )}
    </div>
  );
}
