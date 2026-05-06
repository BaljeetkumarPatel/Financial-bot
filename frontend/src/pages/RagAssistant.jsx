import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const API = "http://localhost:8001";

const SUGGESTIONS = [
  "What is a mutual fund?",
  "How does compound interest work?",
  "What are the types of insurance?",
  "Explain SIP investment",
  "Difference between stocks and bonds?",
];

const STORAGE_KEY = "rag_chat_sessions";

function loadSessions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveSessions(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
function newSession() {
  return { id: Date.now().toString(), title: "New Chat", messages: [], createdAt: new Date().toISOString() };
}

function MdContent({ text }) {
  return (
    <ReactMarkdown components={{
      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
      ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    }}>
      {text}
    </ReactMarkdown>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-4 px-6 py-5 ${isUser ? "bg-transparent" : "bg-gray-50"}`}>
      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold mt-0.5 ${isUser ? "bg-[#1FA2B6] text-white" : "bg-[#072146] text-white"}`}>
        {isUser ? "U" : "AI"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400 mb-1">{isUser ? "You" : "Finance Assistant"}</p>
        <div className="text-[15px] text-gray-800 leading-relaxed">
          {isUser ? msg.text : <MdContent text={msg.text} />}
        </div>
        <p className="text-xs text-gray-400 mt-2">{msg.time}</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-4 px-6 py-5 bg-gray-50">
      <div className="w-8 h-8 rounded-full bg-[#072146] text-white flex items-center justify-center text-sm font-bold shrink-0">AI</div>
      <div className="flex items-center gap-1 mt-2">
        {[0,1,2].map(i => (
          <span key={i} className="w-2 h-2 bg-[#1FA2B6] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onSuggest }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-4 pb-10">
      <div className="text-center">
        <div className="text-5xl mb-4">📚</div>
        <h2 className="text-2xl font-semibold text-gray-800">Finance Knowledge Assistant</h2>
        <p className="text-gray-500 mt-2 text-sm">Ask anything from your financial documents</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {SUGGESTIONS.map((s, i) => (
          <button key={i} onClick={() => onSuggest(s)}
            className="text-left text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-[#1FA2B6] hover:text-[#1FA2B6] transition shadow-sm">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RagAssistant() {
  const [sessions, setSessions] = useState(loadSessions);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const activeSession = sessions.find(s => s.id === activeId) || null;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeSession?.messages, loading]);
  useEffect(() => { saveSessions(sessions); }, [sessions]);

  const createSession = () => {
    const s = newSession();
    setSessions(prev => [s, ...prev]);
    setActiveId(s.id);
    setInput("");
    inputRef.current?.focus();
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const updateSession = (id, updater) => setSessions(prev => prev.map(s => s.id === id ? updater(s) : s));

  const sendMessage = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");

    let sid = activeId;
    if (!sid) {
      const s = newSession();
      setSessions(prev => [s, ...prev]);
      setActiveId(s.id);
      sid = s.id;
    }

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    updateSession(sid, s => ({
      ...s,
      title: s.messages.length === 0 ? q.slice(0, 40) : s.title,
      messages: [...s.messages, { role: "user", text: q, time }],
    }));

    setLoading(true);
    try {
      const res = await axios.post(`${API}/ask`, { question: q });
      updateSession(sid, s => ({
        ...s,
        messages: [...s.messages, {
          role: "ai",
          text: res.data.answer,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }],
      }));
    } catch {
      updateSession(sid, s => ({
        ...s,
        messages: [...s.messages, { role: "ai", text: "⚠️ Backend not reachable. Make sure the RAG server is running on port 8001.", time }],
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans pt-[64px]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0"} shrink-0 bg-[#0f1117] text-white flex flex-col transition-all duration-200 overflow-hidden`}>
        <div className="p-3 border-b border-white/10">
          <button onClick={createSession} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10 text-sm font-medium transition">
            <span className="text-lg">✏️</span> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {sessions.length === 0 && <p className="text-xs text-gray-500 text-center mt-6 px-3">No chats yet</p>}
          {sessions.map(s => (
            <div key={s.id} onClick={() => setActiveId(s.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm transition ${s.id === activeId ? "bg-white/15 text-white" : "text-gray-300 hover:bg-white/10"}`}>
              <span className="truncate flex-1">💬 {s.title}</span>
              <button onClick={(e) => deleteSession(s.id, e)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 ml-2 text-xs transition">✕</button>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-white/10 text-xs text-gray-500 text-center">Finance RAG · Powered by Groq</div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-4 py-3 border-b bg-white shrink-0">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-500 hover:text-gray-800 transition p-1 rounded" title="Toggle sidebar">☰</button>
          <h1 className="text-base font-semibold text-gray-800">
            {activeSession ? activeSession.title : "Finance Knowledge Assistant"}
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          {!activeSession || activeSession.messages.length === 0
            ? <EmptyState onSuggest={sendMessage} />
            : (
              <div className="max-w-3xl mx-auto w-full divide-y divide-gray-100">
                {activeSession.messages.map((m, i) => <Message key={i} msg={m} />)}
                {loading && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>
            )}
        </div>

        {/* Input */}
        <div className="border-t bg-white px-4 py-4 shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-sm focus-within:border-[#1FA2B6] focus-within:ring-1 focus-within:ring-[#1FA2B6] transition">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
                }}
                onKeyDown={handleKey}
                placeholder="Ask anything about your financial documents..."
                className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent max-h-40"
                style={{ height: "24px" }}
              />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition ${loading || !input.trim() ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#1FA2B6] text-white hover:bg-[#148a9c]"}`}>
                ↑
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Answers are grounded in your uploaded financial documents only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
