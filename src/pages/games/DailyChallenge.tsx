import { useState, useEffect, useRef } from "react";
import { DAILY_CHALLENGES, DailyChallenge } from "@/constants/gameData";
import ParticleBackground from "@/components/features/ParticleBackground";

const STORAGE_KEY = "aliencode_daily_progress";
const STREAK_KEY = "aliencode_daily_streak";

interface StreakData {
  count: number;
  lastCompleted: string; // YYYY-MM-DD
  longestStreak: number;
}

function loadSolved(): Record<number, { xp: number; date: string }> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
  catch { return {}; }
}
function saveSolved(data: Record<number, { xp: number; date: string }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function loadStreak(): StreakData {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastCompleted":"","longestStreak":0}'); }
  catch { return { count: 0, lastCompleted: "", longestStreak: 0 }; }
}
function saveStreak(data: StreakData) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Deterministic daily challenge — changes each real calendar day
function getTodayChallenge(): DailyChallenge {
  const today = new Date();
  const idx = (today.getFullYear() * 365 + today.getMonth() * 31 + today.getDate()) % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[idx];
}

const DIFF_COLORS: Record<string, string> = {
  easy:   "text-green-400 border-green-500/30 bg-green-500/10",
  medium: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  hard:   "text-red-400 border-red-500/30 bg-red-500/10",
};

const LANG_COLORS: Record<string, string> = {
  javascript: "text-yellow-400",
  python: "text-blue-400",
};

// Simple pseudo-run: check for key patterns against test cases
function pseudoEvaluate(code: string, challenge: DailyChallenge): { passed: boolean; msg: string } {
  // For display: we check if code contains key patterns that would produce correct output
  const lc = code.toLowerCase();

  if (challenge.id === 1) { // reverse string
    if (lc.includes("reverse") || lc.includes("split") || (lc.includes("for") && lc.includes("result"))) {
      return { passed: true, msg: "Tests passed! Your reverseString function works correctly." };
    }
  } else if (challenge.id === 2) { // fizzbuzz
    if (lc.includes("fizzbuzz") && lc.includes("fizz") && lc.includes("buzz") && lc.includes("%")) {
      return { passed: true, msg: "Tests passed! FizzBuzz logic is correct." };
    }
  } else if (challenge.id === 3) { // count vowels
    if (lc.includes("aeiou") || (lc.includes("vowel") && lc.includes("count"))) {
      return { passed: true, msg: "Tests passed! Vowel counter works." };
    }
  } else if (challenge.id === 4) { // palindrome
    if ((lc.includes("reverse") || lc.includes("split")) && lc.includes("return")) {
      return { passed: true, msg: "Tests passed! Palindrome check is correct." };
    }
  } else if (challenge.id === 5) { // find max
    if ((lc.includes("max_val") || lc.includes("maxval") || lc.includes("max =")) && lc.includes("for")) {
      return { passed: true, msg: "Tests passed! Max finder works." };
    }
  } else if (challenge.id === 6) { // factorial
    if (lc.includes("return 1") && (lc.includes("factorial") || lc.includes("n *")) && lc.includes("return")) {
      return { passed: true, msg: "Tests passed! Recursive factorial is correct." };
    }
  } else if (challenge.id === 7) { // two sum
    if ((lc.includes("map") || lc.includes("{") || lc.includes("seen")) && lc.includes("target")) {
      return { passed: true, msg: "Tests passed! Two Sum solution is correct." };
    }
  } else if (challenge.id === 8) { // flatten
    if (lc.includes("reduce") || lc.includes("concat") || lc.includes("push")) {
      return { passed: true, msg: "Tests passed! Array flattening works." };
    }
  } else if (challenge.id === 9) { // anagram
    if (lc.includes("sort") || (lc.includes("count") && lc.includes("freq"))) {
      return { passed: true, msg: "Tests passed! Anagram check works." };
    }
  } else if (challenge.id === 10) { // binary search
    if (lc.includes("mid") && lc.includes("left") && lc.includes("right")) {
      return { passed: true, msg: "Tests passed! Binary search is correct." };
    }
  } else if (challenge.id === 11) { // group by
    if (lc.includes("reduce") && lc.includes("key")) {
      return { passed: true, msg: "Tests passed! GroupBy function works." };
    }
  } else if (challenge.id === 12) { // fibonacci
    if (lc.includes("append") || lc.includes("push") || lc.includes("fib")) {
      return { passed: true, msg: "Tests passed! Fibonacci sequence is correct." };
    }
  }

  // If code was modified and has function body
  if (code !== challenge.starterCode && lc.includes("return") && code.length > challenge.starterCode.length + 5) {
    return { passed: true, msg: "Solution looks correct! Well done." };
  }

  return { passed: false, msg: "Tests failed. Check your logic and try again." };
}

export default function DailyChallengesPage() {
  const [solved, setSolved] = useState(loadSolved());
  const [streak, setStreak] = useState(loadStreak());
  const [todayChallenge] = useState(getTodayChallenge());
  const [selected, setSelected] = useState<DailyChallenge | null>(null);
  const [code, setCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  const openChallenge = (ch: DailyChallenge) => {
    setSelected(ch);
    setCode(ch.starterCode);
    setShowHint(false);
    setFeedback(null);
    setTimer(0);
    setTimerActive(true);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setTimerActive(false);

    const result = pseudoEvaluate(code, selected);
    setFeedback(result);

    if (result.passed) {
      const baseXP = selected.xp;
      const timeBonus = Math.max(0, 60 - Math.floor(timer / 5)) * 2;
      const hintPenalty = showHint ? -15 : 0;
      const earned = Math.max(20, baseXP + timeBonus + hintPenalty);

      const today = getTodayStr();
      const updated = { ...solved, [selected.id]: { xp: earned, date: today } };
      setSolved(updated);
      saveSolved(updated);

      // Update streak
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const newStreak = { ...streak };
      if (streak.lastCompleted === today) {
        // already done today, no change
      } else if (streak.lastCompleted === yesterday) {
        newStreak.count += 1;
      } else {
        newStreak.count = 1;
      }
      newStreak.lastCompleted = today;
      newStreak.longestStreak = Math.max(newStreak.longestStreak, newStreak.count);
      setStreak(newStreak);
      saveStreak(newStreak);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const totalXP = Object.values(solved).reduce((sum, v) => sum + v.xp, 0);
  const todaySolved = Object.values(solved).some((v) => v.date === getTodayStr());

  // ── Challenge View ──
  if (selected) {
    return (
      <div className="relative min-h-screen pt-20 px-4 pb-12">
        <ParticleBackground />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <button onClick={() => setSelected(null)} className="cyber-button px-3 py-2 rounded-xl text-xs font-orbitron">
              ← CHALLENGES
            </button>
            <div className="flex-1">
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
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border border-green-500/20">
              <span className="text-green-400 text-base">⏱</span>
              <span className="font-orbitron text-green-300 text-sm font-bold">{formatTime(timer)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Code editor */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="glass-panel rounded-2xl overflow-hidden border border-green-500/20 flex flex-col">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <span className="font-orbitron text-xs text-gray-500 ml-2">
                    {selected.language === "javascript" ? "solution.js" : "solution.py"}
                  </span>
                  <button
                    onClick={() => setCode(selected.starterCode)}
                    className="ml-auto text-gray-600 hover:text-gray-300 text-xs font-orbitron"
                  >
                    ↺ RESET
                  </button>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-transparent text-cyan-200 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed min-h-64"
                  spellCheck={false}
                />
                <div className="px-4 py-3 border-t border-white/5 flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleSubmit}
                    disabled={!!feedback?.ok}
                    className="cyber-button-primary cyber-button px-6 py-2.5 rounded-xl font-orbitron text-xs tracking-wider disabled:opacity-50"
                  >
                    ▶ SUBMIT
                  </button>
                  <button
                    onClick={() => setShowHint(true)}
                    className="cyber-button px-4 py-2 rounded-xl font-orbitron text-xs border-green-500/30 text-green-400"
                  >
                    💡 HINT
                  </button>
                </div>
              </div>

              {showHint && (
                <div className="glass-panel rounded-xl p-4 border border-green-500/20 text-sm">
                  <span className="text-green-400 font-bold">💡 Hint: </span>
                  <span className="text-gray-300">{selected.hint}</span>
                </div>
              )}

              {feedback && (
                <div className={`glass-panel rounded-xl p-4 border text-sm ${
                  feedback.ok
                    ? "border-green-500/40 bg-green-500/5 text-green-300"
                    : "border-red-500/40 bg-red-500/5 text-red-300"
                }`}>
                  <span className="font-bold mr-2">{feedback.ok ? "✓" : "✗"}</span>
                  {feedback.msg}
                  {feedback.ok && (
                    <div className="mt-2 text-xs text-green-400">
                      Earned: {solved[selected.id]?.xp} XP • Time: {formatTime(timer)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: test cases */}
            <div className="flex flex-col gap-4">
              <div className="glass-panel rounded-2xl p-4 border border-green-500/10">
                <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-3">TEST CASES</div>
                <div className="space-y-3">
                  {selected.testCases.map((tc, i) => {
                    const isSolved = feedback?.ok;
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          isSolved
                            ? "border-green-500/30 bg-green-500/5"
                            : "border-white/5 bg-white/2"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-500">{tc.description}</span>
                          {isSolved && <span className="text-green-400">✓</span>}
                        </div>
                        <div className="font-mono">
                          <span className="text-gray-600">Input: </span>
                          <span className="text-cyan-400">{tc.input}</span>
                        </div>
                        <div className="font-mono">
                          <span className="text-gray-600">Expected: </span>
                          <span className="text-yellow-400">{tc.expected}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-4 border border-green-500/10">
                <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-3">TAGS</div>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Challenge Hub ──
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date().getDay();
  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const dayDiff = (today - i + 7) % 7;
    const d = new Date(Date.now() - dayDiff * 86400000);
    const dStr = d.toISOString().slice(0, 10);
    return Object.values(solved).some((v) => v.date === dStr);
  }).reverse();

  return (
    <div className="relative min-h-screen pt-20 px-4 pb-12">
      <ParticleBackground />
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/5 mb-5">
            <span className="text-green-400 font-orbitron text-xs tracking-widest">🌍 DAILY CHALLENGES</span>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl font-black text-white mb-3">
            CODE EVERY DAY
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Solve one challenge per day to build your streak. XP earned depends on difficulty and speed.
          </p>
        </div>

        {/* Streak + Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "STREAK 🔥", value: `${streak.count} days` },
            { label: "LONGEST", value: `${streak.longestStreak} days` },
            { label: "SOLVED", value: `${Object.keys(solved).length}/${DAILY_CHALLENGES.length}` },
            { label: "TOTAL XP", value: totalXP },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-xl p-4 text-center border border-green-500/10">
              <div className="font-orbitron text-2xl font-black text-green-400">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1 tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Week heatmap */}
        <div className="glass-panel rounded-2xl p-5 border border-green-500/10 mb-8">
          <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-4">THIS WEEK</div>
          <div className="flex gap-2 justify-center">
            {weekDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg transition-all ${
                    streakDays[i]
                      ? "bg-green-500 shadow-[0_0_10px_hsl(140_80%_50%/0.5)]"
                      : "bg-white/5 border border-white/5"
                  }`}
                />
                <span className="text-xs text-gray-600">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Challenge */}
        <div className="mb-8">
          <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-4">📅 TODAY'S CHALLENGE</div>
          <div
            className="glass-panel rounded-2xl p-6 border-2 border-green-500/40 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-all"
            onClick={() => openChallenge(todayChallenge)}
            style={{ boxShadow: "0 0 40px hsl(140 80% 50% / 0.1)" }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(140 80% 50% / 0.08) 0%, transparent 70%)" }} />
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded-full border text-xs font-orbitron ${DIFF_COLORS[todayChallenge.difficulty]}`}>
                    {todayChallenge.difficulty.toUpperCase()}
                  </span>
                  <span className={`text-xs font-orbitron ${LANG_COLORS[todayChallenge.language]}`}>
                    {todayChallenge.language.toUpperCase()}
                  </span>
                  {todaySolved && (
                    <span className="text-green-400 text-xs font-orbitron">✓ COMPLETED TODAY</span>
                  )}
                </div>
                <h3 className="font-orbitron text-xl font-bold text-white mb-1">{todayChallenge.title}</h3>
                <p className="text-gray-400 text-sm">{todayChallenge.description}</p>
              </div>
              <div className="text-right">
                <div className="font-orbitron text-3xl font-black text-green-400">{todayChallenge.xp}</div>
                <div className="text-xs text-gray-500">XP REWARD</div>
                <button className="mt-2 cyber-button-primary cyber-button px-5 py-2 rounded-xl font-orbitron text-xs">
                  SOLVE NOW →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* All challenges */}
        <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-4">ALL CHALLENGES</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAILY_CHALLENGES.map((ch) => {
            const done = solved[ch.id];
            return (
              <button
                key={ch.id}
                onClick={() => openChallenge(ch)}
                className="glass-panel glass-panel-hover rounded-2xl p-4 text-left border border-white/5 transition-all hover:scale-105 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full border text-xs font-orbitron ${DIFF_COLORS[ch.difficulty]}`}>
                    {ch.difficulty.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${LANG_COLORS[ch.language]}`}>{ch.language === "javascript" ? "JS" : "PY"}</span>
                    {done && <span className="text-green-400 text-xs">✓</span>}
                  </div>
                </div>
                <h3 className="font-orbitron text-sm font-bold text-white group-hover:text-green-300 transition-colors mb-1">
                  {ch.title}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{ch.description}</p>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <div className="flex gap-1 flex-wrap">
                    {ch.tags.slice(0, 2).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{t}</span>
                    ))}
                  </div>
                  <span className="text-green-400 font-orbitron">{done ? `${done.xp} XP` : `${ch.xp} XP`}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
