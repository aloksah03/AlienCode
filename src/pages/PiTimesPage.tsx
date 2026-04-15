import { useState, useRef, useEffect } from "react";
import { usePiTimes } from "@/hooks/usePiTimes";
import ParticleBackground from "@/components/features/ParticleBackground";
import { formatDate } from "@/lib/utils";

// Simple markdown renderer
function renderMarkdown(text: string): string {
  return text
    .replace(/```(\w+)?\n([\s\S]+?)```/g, (_, _lang, code) =>
      `<div class="code-block rounded-xl p-4 my-3 overflow-x-auto"><pre class="text-sm text-cyan-200 font-mono whitespace-pre">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></div>`
    )
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-sm">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/^## (.+)$/gm, '<h3 class="font-orbitron text-base font-bold text-cyan-300 mt-4 mb-2">$1</h3>')
    .replace(/^### (.+)$/gm, '<h4 class="font-orbitron text-sm font-bold text-purple-300 mt-3 mb-1">$1</h4>')
    .replace(/^\| (.+) \|$/gm, (_, row) => {
      const cells = row.split(" | ");
      return `<tr class="border-b border-white/5">${cells.map((c: string) => `<td class="px-3 py-2 text-sm text-gray-300">${c}</td>`).join("")}</tr>`;
    })
    .replace(/^- (.+)$/gm, '<li class="text-gray-300 text-sm ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="text-gray-300 text-sm ml-4 list-decimal">$1</li>')
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, '<br/>');
}

export default function PiTimesPage() {
  const { sessions, currentSession, isTyping, startNewSession, sendMessage, loadSession, deleteSession } =
    usePiTimes();
  const [input, setInput] = useState("");
  // Sidebar HIDDEN by default — user must slide/click to reveal (ChatGPT style)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const msg = input.trim();
    setInput("");
    if (!currentSession) startNewSession();
    await sendMessage(msg);
    inputRef.current?.focus();
  };

  const handleNewChat = () => {
    startNewSession();
    setInput("");
    setSidebarOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Close sidebar on overlay click
  const handleOverlayClick = () => setSidebarOpen(false);

  const SUGGESTIONS = [
    "Explain recursion with visual examples",
    "What is Big O notation?",
    "Difference between Python and JavaScript",
    "How does async/await work?",
    "Explain OOP with code examples",
    "How do pointers work in C?",
    "What is machine learning?",
    "Explain the OSI networking model",
    "How does the internet work?",
    "Teach me data structures",
    "Explain quantum computing simply",
    "What is the derivative in calculus?",
  ];

  return (
    <div className="relative h-screen flex overflow-hidden pt-16">
      <ParticleBackground />

      {/* ── SIDEBAR OVERLAY (click outside to close) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* ── SIDEBAR (slides in from left, over content) ── */}
      <aside
        ref={sidebarRef}
        className={`fixed top-16 left-0 bottom-0 z-40 w-72 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, hsl(220 60% 6% / 0.97), hsl(220 60% 4% / 0.99))",
          borderRight: "1px solid hsl(270 80% 50% / 0.2)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-sm font-black font-orbitron glow-box">
                Π
              </div>
              <div>
                <h2 className="font-orbitron text-sm font-bold text-purple-300">ΠTimes</h2>
                <p className="text-xs text-gray-600">Chat History</p>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="cyber-button w-7 h-7 rounded-lg flex items-center justify-center text-xs text-gray-400 hover:text-gray-200"
              aria-label="Close history"
            >
              ✕
            </button>
          </div>
          <button
            onClick={handleNewChat}
            className="w-full cyber-button py-2.5 rounded-xl font-orbitron text-xs tracking-wider flex items-center justify-center gap-2 border-purple-500/30 text-purple-300 hover:border-purple-400"
          >
            ✦ NEW CHAT
          </button>
        </div>

        {/* History list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-3xl mb-3">💬</div>
              <p className="text-gray-600 text-xs font-orbitron tracking-widest">NO HISTORY YET</p>
              <p className="text-gray-700 text-xs mt-1">Start a chat to see it here</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  currentSession?.id === session.id
                    ? "bg-purple-500/20 border border-purple-500/30"
                    : "hover:bg-white/5 border border-transparent"
                }`}
                onClick={() => {
                  loadSession(session);
                  setSidebarOpen(false);
                }}
              >
                <span className="text-gray-500 text-xs flex-shrink-0">💬</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-300 truncate">{session.title || "New Chat"}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{formatDate(session.updatedAt)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 text-xs transition-all p-1 flex-shrink-0"
                  aria-label="Delete chat"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ── MAIN CHAT AREA ── */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden w-full">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 glass-panel flex-shrink-0">
          {/* History toggle — opens sidebar */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="cyber-button w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
            aria-label="Open history"
            title="View chat history"
          >
            ☰
          </button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center font-orbitron font-black text-sm glow-box flex-shrink-0">
              Π
            </div>
            <div className="min-w-0">
              <h1 className="font-orbitron text-sm font-bold text-purple-300">ΠTimes</h1>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    isTyping ? "bg-yellow-400 animate-pulse" : "bg-green-400"
                  }`}
                />
                <span className="text-xs text-gray-500 truncate">
                  {isTyping ? "Thinking..." : "Online — Ready"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="cyber-button px-3 py-1.5 rounded-lg text-xs font-orbitron tracking-wider flex-shrink-0"
          >
            + NEW
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {!currentSession || currentSession.messages.length === 0 ? (
            /* Welcome screen */
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <div
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center mx-auto mb-4 glow-box font-orbitron font-black text-3xl text-white"
                >
                  Π
                </div>
                <h2 className="font-orbitron text-2xl font-black text-white mb-2">ΠTimes</h2>
                <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                  Your hyper-intelligent AI companion. I can explain any concept, create visual diagrams,
                  write and debug code, answer any question — from coding to quantum physics, math to history.
                </p>
              </div>

              {/* Suggestion grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s);
                      inputRef.current?.focus();
                    }}
                    className="glass-panel glass-panel-hover rounded-xl p-3 text-left text-xs text-gray-400 hover:text-gray-200 border border-white/5 transition-all text-left"
                  >
                    <span className="text-purple-400 mr-2">›</span>
                    {s}
                  </button>
                ))}
              </div>

              <p className="text-center text-gray-700 text-xs mt-8 font-orbitron tracking-widest">
                ← TAP ☰ TO VIEW CHAT HISTORY
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {currentSession.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[88%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-orbitron font-black ${
                        msg.role === "user"
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-purple-500/20 text-purple-400 border border-purple-500/30 glow-box"
                      }`}
                    >
                      {msg.role === "user" ? "U" : "Π"}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user" ? "msg-user text-gray-200" : "msg-ai text-gray-200"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                      <p className="text-gray-600 text-xs mt-2">{formatDate(msg.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-sm font-orbitron font-black glow-box">
                      Π
                    </div>
                    <div className="msg-ai rounded-2xl px-5 py-4 flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="px-4 pb-4 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="glass-panel rounded-2xl border border-purple-500/20 flex items-end gap-3 p-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask ΠTimes anything — coding, math, science, history... (Shift+Enter for new line)"
                rows={1}
                className="flex-1 bg-transparent text-gray-200 placeholder-gray-600 resize-none focus:outline-none text-sm leading-relaxed max-h-32 py-1"
                style={{ minHeight: "24px" }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = "auto";
                  t.style.height = Math.min(t.scrollHeight, 128) + "px";
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="cyber-button py-2 px-4 rounded-xl font-orbitron text-xs tracking-wider border-purple-500/40 text-purple-300 hover:border-purple-400 disabled:opacity-40 flex-shrink-0"
              >
                {isTyping ? "⟳" : "SEND ↵"}
              </button>
            </div>
            <p className="text-center text-gray-700 text-xs mt-2 font-orbitron tracking-widest">
              ΠTIMES — HYPER-INTELLIGENCE AT YOUR SERVICE
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
