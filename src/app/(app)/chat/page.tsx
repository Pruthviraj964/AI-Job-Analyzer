"use client";
import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, Sparkles, Trash2, ExternalLink } from "lucide-react";
import { ChatMessage } from "@/types";
import { sendChatMessage } from "@/lib/ai";
import { generateId, timeAgo } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

const STARTERS = [
  "What are the hottest skills in AI right now?",
  "What salary can I expect as a Data Scientist in NYC?",
  "PyTorch or TensorFlow — which should I learn?",
  "How do I optimize my resume for ATS?",
  "What's the fastest path from Data Analyst to ML Engineer?",
  "What LLM skills are in highest demand?",
];

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 msg-enter ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold ${isUser ? "bg-violet-500" : "bg-gradient-to-br from-violet-600 to-blue-600"}`}>
        {isUser ? "Y" : <Sparkles className="w-4 h-4 text-white" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? "bg-violet-600 text-white rounded-tr-sm" : "bg-[#1f2937] border border-white/8 rounded-tl-sm"}`}>
          {isUser ? (
            <span>{msg.content}</span>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">{children}</a>,
                  code: ({ children }) => <code className="bg-white/10 px-1 rounded text-xs">{children}</code>,
                  table: ({ children }) => <table className="text-xs border-collapse w-full mt-2">{children}</table>,
                  th: ({ children }) => <th className="border border-white/15 px-2 py-1 bg-white/5">{children}</th>,
                  td: ({ children }) => <td className="border border-white/10 px-2 py-1">{children}</td>,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {msg.citations && msg.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {msg.citations.map((c, i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                <ExternalLink className="w-2.5 h-2.5" />
                {c.source} · {c.count.toLocaleString()} records
              </span>
            ))}
          </div>
        )}
        <span className="text-xs text-gray-600 mt-1">{timeAgo(msg.timestamp)}</span>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm your **AI Career Intelligence Assistant**.\n\nI have real-time access to **48,200+ job postings**, skill demand trends, and salary data. Ask me anything about:\n\n- 📊 Skill demand & trends\n- 💰 Salary benchmarks by role and location\n- 🎯 Resume & ATS optimization tips\n- 🗺️ Career transition strategies\n- 🤖 AI/ML skill requirements\n\nWhat would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { content: aiContent, citations } = await sendChatMessage(content, messages);
      const aiMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date().toISOString(),
        citations,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold">AI Career Intelligence Chat</h2>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RAG-powered · 48,200+ job postings indexed
            </div>
          </div>
        </div>
        <button onClick={() => setMessages(messages.slice(0, 1))} className="btn btn-ghost text-xs py-1.5">
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl shrink-0 bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="px-4 py-3 bg-[#1f2937] border border-white/8 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center py-1">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Starter chips */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3 shrink-0">
          {STARTERS.map((s) => (
            <button key={s} onClick={() => sendMessage(s)} className="text-xs px-3 py-1.5 rounded-full border border-violet-500/25 text-violet-400 hover:bg-violet-500/10 transition-all truncate max-w-xs">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 shrink-0 mt-2">
        <div className="flex-1 relative">
          <input
            className="input pr-12"
            placeholder="Ask about skills, salaries, career paths..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center disabled:opacity-40 hover:bg-violet-500 transition-colors"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Send className="w-3.5 h-3.5 text-white" />}
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-600 text-center mt-2">
        Answers grounded in real market data via RAG · Not a substitute for professional career advice
      </div>
    </div>
  );
}
