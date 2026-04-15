import { useState, useRef, useEffect } from "react";
import { FIX_CHALLENGES, FixChallenge } from "@/constants/gameData";
import ParticleBackground from "@/components/features/ParticleBackground";

const STORAGE_KEY = "aliencode_fix_progress";

function loadProgress(): Record<number, { solved: boolean; xp: number }> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}
function saveProgress(data: Record<number, { solved: boolean; xp: number }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const DIFF_COLORS: Record<string, string> = {
  easy:   "text-green-400 border-green-500/30 bg-green-500/10",
  medium: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  hard:   "text-red-400 border-red-500/30 bg-red-500/10",
};

const LANG_COLORS: Record<string, string> = {
  javascript: "text-yellow-400",
  python: "text-blue-400",
  c: "text-cyan-400",
};

// Syntax-highlight basic code for display
function highlightCode(code: string, lang: string): string {
  const esc = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (lang === "javascript" || lang === "c") {
    return esc
      .replace(/(\/\/[^\n]*)/g, '<span style="color:hsl(220 10% 50%)">$1</span>')
      .replace(/\b(function|const|let|var|if|else|for|while|return|async|await|typeof|new|class|int|float|char|void|include|printf|malloc|free|NULL)\b/g,
        '<span style="color:hsl(270 80% 70%)">$1</span>')
      .replace(/"([^"]*)"/g, '<span style="color:hsl(140 60% 60%)">"$1"</span>')
      .replace(/\b(\d+)\b/g, '<span style="color:hsl(30 100% 70%)">$1</span>');
  } else {
    return esc
      .replace(/(#[^\n]*)/g, '<span style="color:hsl(220 10% 50%)">$1</span>')
      .replace(/\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|with|in|not|and|or|True|False|None|pass|yield)\b/g,
        '<span style="color:hsl(270 80% 70%)">$1</span>')
      .replace(/"([^"]*)"|'([^']*)'/g, '<span style="color:hsl(140 60% 60%)">$&</span>')
      .replace(/\b(\d+)\b/g, '<span style="color:hsl(30 100% 70%)">$1</span>');
  }
}

// Compute a simple diff between two code strings
function computeDiff(broken: string, fixed: string) {
  const brokenLines = broken.split("\n");
  const fixedLines = fixed.split("\n");
  const maxLen = Math.max(brokenLines.length, fixedLines.length);
  const diff: { broken: string; fixed: string; changed: boolean }[] = [];
  for (let i = 0; i < maxLen; i++) {
    const b = brokenLines[i] ?? "";
    const f = fixedLines[i] ?? "";
    diff.push({ broken: b, fixed: f, changed: b !== f });
  }
  return diff;
}

export default function FixTheCode() {
  const [progress, setProgress] = useState(loadProgress());
  const [selected, setSelected] = useState<FixChallenge | null>(null);
  const [userCode, setUserCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [filter, setFilter] = useState<"all" | "easy" | "medium" | "hard">("all");

  useEffect(() => {
    const xp = Object.values(progress).reduce((sum, v) => sum + (v.xp || 0), 0);
    setTotalXP(xp);
  }, [progress]);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const selectChallenge = (ch: FixChallenge) => {
    setSelected(ch);
    setUserCode(ch.brokenCode);
    setShowHint(false);
    setShowSolution(false);
    setFeedback(null);
    setTimer(0);
    setTimerActive(true);
  };

  const handleCheck = () => {
    if (!selected) return;
    setTimerActive(false);

    // Normalize and compare: trim whitespace and collapse spaces for fuzzy match
    const normalize = (s: string) =>
      s.split("\n").map((l) => l.trim()).filter(Boolean).join("|");

    const userNorm = normalize(userCode);
    const fixNorm = normalize(selected.fixedCode);

    // Check if key differences are fixed
    const changedLines = computeDiff(selected.brokenCode, selected.fixedCode)
      .filter((d) => d.changed)
      .map((d) => d.fixed.trim());

    const allFixed = changedLines.every((line) => {
      if (line === "") return true;
      return userCode.includes(line.replace(/\s+/g, " ").trim());
    });

    if (allFixed || userNorm === fixNorm) {
      const baseXP = selected.xp;
      const timeBonus = Math.max(0, 30 - Math.floor(timer / 10)) * 5;
      const hintPenalty = showHint ? -20 : 0;
      const earned = Math.max(10, baseXP + timeBonus + hintPenalty);

      setFeedback({
        ok: true,
        msg: `Bug fixed! +${earned} XP ${timeBonus > 0 ? `(speed bonus +${timeBonus})` : ""} ${hintPenalty < 0 ? `(hint penalty ${hintPenalty})` : ""}`,
      });

      const updated = {
        ...progress,
        [selected.id]: { solved: true, xp: Math.max(progress[selected.id]?.xp || 0, earned) },
      };
      setProgress(updated);
      saveProgress(updated);
    } else {
      setFeedback({ ok: false, msg: "Not quite right — the bug isn't fully fixed yet. Try again!" });
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const filtered = FIX_CHALLENGES.filter((c) => filter === "all" || c.difficulty === filter);
  const solvedCount = Object.values(progress).filter((v) => v.solved).length;

  if (!selected) {
    return (
      <div className="relative min-h-screen pt-20 px-4 pb-12">
        <ParticleBackground />
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 mb-5">
              <span className="text-yellow-400 font-orbitron text-xs tracking-widest">🐛 FIX THE CODE</span>
            </div>
            <h1 className="font-orbitron text-3xl sm:text-4xl font-black text-white mb-3">
              DEBUG CHALLENGES
            </h1>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Find and fix the bugs in broken code. Earn XP based on speed, difficulty, and whether you used hints.
            </p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "SOLVED", value: `${solvedCount}/${FIX_CHALLENGES.length}` },
              { label: "TOTAL XP", value: totalXP },
              { label: "PROGRESS", value: `${Math.round((solvedCount / FIX_CHALLENGES.length) * 100)}%` },
            ].map((stat) => (
              <div key={stat.label} className="glass-panel rounded-xl p-4 text-center border border-yellow-500/10">
                <div className="font-orbitron text-2xl font-black text-yellow-400">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1 tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {(["all", "easy", "medium", "hard"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-orbitron text-xs tracking-wider transition-all ${
                  filter === f
                    ? "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300"
                    : "cyber-button"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Challenge grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((ch) => {
              const done = progress[ch.id]?.solved;
              return (
                <button
                  key={ch.id}
                  onClick={() => selectChallenge(ch)}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 text-left border border-white/5 transition-all hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-orbitron ${DIFF_COLORS[ch.difficulty]}`}>
                      {ch.difficulty.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-orbitron ${LANG_COLORS[ch.language]}`}>
                        {ch.language.toUpperCase()}
                      </span>
                      {done && <span className="text-green-400 text-xs">✓</span>}
                    </div>
                  </div>
                  <h3 className="font-orbitron text-sm font-bold text-white group-hover:text-yellow-300 transition-colors mb-1">
                    {ch.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">{ch.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">🐛 {ch.bugType}</span>
                    <span className="text-yellow-400 font-orbitron">{ch.xp} XP</span>
                  </div>
                  {done && (
                    <div className="mt-2 text-xs text-green-400 font-orbitron">
                      Best: {progress[ch.id]?.xp} XP
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const diff = computeDiff(selected.brokenCode, selected.fixedCode);

  return (
    <div className="relative min-h-screen pt-20 px-4 pb-12">
      <ParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <button onClick={() => setSelected(null)} className="cyber-button px-3 py-2 rounded-xl text-xs font-orbitron">
            ← CHALLENGES
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-orbitron text-lg font-bold text-white">{selected.title}</h2>
              <span className={`px-2 py-0.5 rounded-full border text-xs font-orbitron ${DIFF_COLORS[selected.difficulty]}`}>
                {selected.difficulty.toUpperCase()}
              </span>
              <span className={`text-xs font-orbitron ${LANG_COLORS[selected.language]}`}>
                {selected.language.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">{selected.description}</p>
          </div>
          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border border-yellow-500/20">
            <span className="text-yellow-400 text-base">⏱</span>
            <span className="font-orbitron text-yellow-300 text-sm font-bold">{formatTime(timer)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: code editor */}
          <div className="flex flex-col gap-4">
            <div className="glass-panel rounded-2xl overflow-hidden border border-yellow-500/20 flex flex-col">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="font-orbitron text-xs text-gray-500 ml-2">FIX THE BUG</span>
                <span className="ml-auto text-xs text-red-400 font-orbitron">🐛 {selected.bugType}</span>
              </div>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="bg-transparent text-cyan-200 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed min-h-56"
                spellCheck={false}
              />
              <div className="px-4 py-3 border-t border-white/5 flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleCheck}
                  disabled={!!feedback?.ok}
                  className="cyber-button-primary cyber-button px-6 py-2.5 rounded-xl font-orbitron text-xs tracking-wider disabled:opacity-50"
                >
                  ✓ CHECK FIX
                </button>
                <button
                  onClick={() => { setShowHint(true); }}
                  className="cyber-button px-4 py-2 rounded-xl font-orbitron text-xs border-yellow-500/30 text-yellow-400 hover:border-yellow-400"
                >
                  💡 HINT {showHint ? "" : "(-20 XP)"}
                </button>
                <button
                  onClick={() => { setShowSolution(true); setTimerActive(false); }}
                  className="cyber-button px-4 py-2 rounded-xl font-orbitron text-xs border-gray-500/30 text-gray-400"
                >
                  👁 SOLUTION
                </button>
              </div>
            </div>

            {/* Hint */}
            {showHint && (
              <div className="glass-panel rounded-xl p-4 border border-yellow-500/20 text-sm">
                <span className="text-yellow-400 font-bold">💡 Hint: </span>
                <span className="text-gray-300">{selected.hint}</span>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className={`glass-panel rounded-xl p-4 border text-sm ${
                feedback.ok
                  ? "border-green-500/40 bg-green-500/5 text-green-300"
                  : "border-red-500/40 bg-red-500/5 text-red-300"
              }`}>
                <span className="font-bold mr-2">{feedback.ok ? "✓" : "✗"}</span>
                {feedback.msg}
              </div>
            )}
          </div>

          {/* Right: diff view */}
          <div className="flex flex-col gap-4">
            {/* Bug location */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-red-500/20">
              <div className="px-4 py-3 border-b border-white/5 bg-black/20">
                <span className="font-orbitron text-xs text-gray-500">DIFF VIEW — Changes needed</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-3 py-2 text-left text-red-400 font-orbitron text-xs w-1/2">🐛 BROKEN</th>
                      <th className="px-3 py-2 text-left text-green-400 font-orbitron text-xs w-1/2">✓ FIXED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diff.map((line, i) => (
                      <tr
                        key={i}
                        className={line.changed ? "bg-yellow-500/5" : ""}
                      >
                        <td
                          className={`px-3 py-1 text-xs border-r border-white/5 ${
                            line.changed ? "text-red-400 bg-red-500/10" : "text-gray-600"
                          }`}
                        >
                          <span dangerouslySetInnerHTML={{ __html: highlightCode(line.broken, selected.language) }} />
                          {line.changed && line.broken && <span className="text-red-500 ml-1">← bug</span>}
                        </td>
                        <td
                          className={`px-3 py-1 text-xs ${
                            showSolution
                              ? line.changed ? "text-green-300 bg-green-500/10" : "text-gray-600"
                              : line.changed ? "blur-sm select-none text-gray-700" : "text-gray-600"
                          }`}
                        >
                          {showSolution ? (
                            <span dangerouslySetInnerHTML={{ __html: highlightCode(line.fixed, selected.language) }} />
                          ) : (
                            line.changed ? "████████████" : <span dangerouslySetInnerHTML={{ __html: highlightCode(line.fixed, selected.language) }} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!showSolution && (
                <div className="px-4 py-3 border-t border-white/5 text-xs text-gray-600 font-orbitron">
                  ← Fixed lines are hidden. Click SOLUTION to reveal.
                </div>
              )}
            </div>

            {/* XP breakdown */}
            <div className="glass-panel rounded-2xl p-4 border border-yellow-500/10">
              <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-3">XP BREAKDOWN</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Base XP</span>
                  <span className="text-yellow-400">{selected.xp}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Speed Bonus (fast solve)</span>
                  <span className="text-green-400">up to +150</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Hint Penalty</span>
                  <span className="text-red-400">-20</span>
                </div>
                {progress[selected.id]?.solved && (
                  <div className="flex justify-between font-bold border-t border-white/5 pt-2">
                    <span className="text-white">Best Score</span>
                    <span className="text-yellow-300">{progress[selected.id].xp} XP</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
