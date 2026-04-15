import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { COURSES } from "@/constants/courses";
import ParticleBackground from "@/components/features/ParticleBackground";

// ── Load game data from localStorage ──
function loadPuzzleProgress(): Record<number, { stars: number; completed: boolean }> {
  try { return JSON.parse(localStorage.getItem("aliencode_puzzle_progress") || "{}"); }
  catch { return {}; }
}
function loadFixProgress(): Record<number, { solved: boolean; xp: number }> {
  try { return JSON.parse(localStorage.getItem("aliencode_fix_progress") || "{}"); }
  catch { return {}; }
}
function loadDailyProgress(): Record<number, { xp: number; date: string }> {
  try { return JSON.parse(localStorage.getItem("aliencode_daily_progress") || "{}"); }
  catch { return {}; }
}
function loadStreakData(): { count: number; longestStreak: number } {
  try { return JSON.parse(localStorage.getItem("aliencode_daily_streak") || '{"count":0,"longestStreak":0}'); }
  catch { return { count: 0, longestStreak: 0 }; }
}

// ── Radar chart (pure SVG) ──
function RadarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const N = data.length;
  const cx = 110;
  const cy = 110;
  const R = 90;
  const levels = 5;

  const angle = (i: number) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });

  const webPoints = (level: number) =>
    data.map((_, i) => pt(i, (R * level) / levels))
      .map((p) => `${p.x},${p.y}`)
      .join(" ");

  const dataPoints = data
    .map((d, i) => pt(i, (R * d.value) / 100))
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[240px] mx-auto">
      {/* Grid webs */}
      {Array.from({ length: levels }).map((_, l) => (
        <polygon
          key={l}
          points={webPoints(l + 1)}
          fill="none"
          stroke="hsl(185 100% 50% / 0.12)"
          strokeWidth="1"
        />
      ))}

      {/* Spokes */}
      {data.map((_, i) => {
        const outer = pt(i, R);
        return (
          <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="hsl(185 100% 50% / 0.15)" strokeWidth="1" />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPoints}
        fill="hsl(185 100% 50% / 0.15)"
        stroke="hsl(185 100% 60%)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {data.map((d, i) => {
        const p = pt(i, (R * d.value) / 100);
        return (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill={d.color} stroke="hsl(220 60% 10%)" strokeWidth="1.5" />
        );
      })}

      {/* Labels */}
      {data.map((d, i) => {
        const p = pt(i, R + 16);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="hsl(185 100% 70%)" fontSize="10" fontFamily="Orbitron, monospace" fontWeight="600">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

// ── Achievement Badge ──
interface Badge {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  color: string;
}

function AchievementBadge({ badge }: { badge: Badge }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
        badge.unlocked
          ? "border-yellow-500/40 bg-yellow-500/5"
          : "border-white/5 bg-white/2 opacity-40"
      }`}
      title={badge.description}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          badge.unlocked ? "" : "grayscale"
        }`}
        style={badge.unlocked ? { boxShadow: `0 0 16px ${badge.color}40` } : {}}
      >
        {badge.icon}
      </div>
      <p className={`font-orbitron text-xs text-center font-bold ${badge.unlocked ? "text-yellow-300" : "text-gray-600"}`}>
        {badge.title}
      </p>
      {badge.unlocked && (
        <div className="w-2 h-2 rounded-full bg-green-400" />
      )}
    </div>
  );
}

// ── Circular Progress ──
function CircularProgress({ percent, color, size = 80 }: { percent: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(220 60% 10%)" strokeWidth="6" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize="13" fontFamily="Orbitron, monospace" fontWeight="700">
        {percent}%
      </text>
    </svg>
  );
}

export default function ProgressDashboard() {
  const { user } = useAuth();
  const { progress } = useProgress();

  const puzzleProgress = useMemo(loadPuzzleProgress, []);
  const fixProgress = useMemo(loadFixProgress, []);
  const dailyProgress = useMemo(loadDailyProgress, []);
  const streakData = useMemo(loadStreakData, []);

  // ── Lesson stats ──
  const lessonStats = useMemo(() => {
    return COURSES.map((course) => {
      const cp = progress[course.id];
      const completed = cp?.completedLessons?.length || 0;
      const quizScores = cp?.quizScores || {};
      const totalQuizzes = Object.keys(quizScores).length;
      const correctQuizzes = Object.values(quizScores).filter(Boolean).length;
      const accuracy = totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0;
      const percent = Math.round((completed / course.totalLessons) * 100);
      return { course, completed, total: course.totalLessons, percent, accuracy, totalQuizzes, correctQuizzes };
    });
  }, [progress]);

  // ── Game stats ──
  const puzzleSolved = Object.values(puzzleProgress).filter((v) => v.completed).length;
  const puzzleStars = Object.values(puzzleProgress).reduce((s, v) => s + (v.stars || 0), 0);
  const fixSolved = Object.values(fixProgress).filter((v) => v.solved).length;
  const fixXP = Object.values(fixProgress).reduce((s, v) => s + (v.xp || 0), 0);
  const dailySolved = Object.keys(dailyProgress).length;
  const dailyXP = Object.values(dailyProgress).reduce((s, v) => s + (v.xp || 0), 0);
  const totalGameXP = fixXP + dailyXP + puzzleStars * 10;

  // ── Radar data (skill per language) ──
  const radarData = useMemo(() => {
    return lessonStats.map((s) => ({
      label: s.course.language,
      value: Math.round((s.percent * 0.6 + s.accuracy * 0.4)),
      color: s.course.color,
    }));
  }, [lessonStats]);

  // ── Total XP ──
  const lessonXP = lessonStats.reduce((sum, s) => sum + s.completed * 10, 0);
  const quizXP = lessonStats.reduce((sum, s) => sum + s.correctQuizzes * 15, 0);
  const totalXP = lessonXP + quizXP + totalGameXP;

  // ── Achievement Badges ──
  const totalLessonsCompleted = lessonStats.reduce((s, l) => s + l.completed, 0);
  const totalCoursesDone = lessonStats.filter((l) => l.percent === 100).length;
  const avgAccuracy = lessonStats.reduce((s, l) => s + l.accuracy, 0) / 4;

  const badges: Badge[] = [
    {
      id: "first-lesson",
      icon: "🚀",
      title: "FIRST STEP",
      description: "Complete your first lesson",
      unlocked: totalLessonsCompleted >= 1,
      color: "#06b6d4",
    },
    {
      id: "10-lessons",
      icon: "📚",
      title: "SCHOLAR",
      description: "Complete 10 lessons",
      unlocked: totalLessonsCompleted >= 10,
      color: "#a855f7",
    },
    {
      id: "50-lessons",
      icon: "🧙",
      title: "WIZARD",
      description: "Complete 50 lessons",
      unlocked: totalLessonsCompleted >= 50,
      color: "#f59e0b",
    },
    {
      id: "course-complete",
      icon: "🏆",
      title: "GRADUATE",
      description: "Complete a full course",
      unlocked: totalCoursesDone >= 1,
      color: "#ef4444",
    },
    {
      id: "all-courses",
      icon: "🌌",
      title: "ALIEN MASTER",
      description: "Complete all 4 courses",
      unlocked: totalCoursesDone >= 4,
      color: "#10b981",
    },
    {
      id: "quiz-ace",
      icon: "🎯",
      title: "QUIZ ACE",
      description: "90%+ quiz accuracy overall",
      unlocked: avgAccuracy >= 90,
      color: "#f59e0b",
    },
    {
      id: "first-game",
      icon: "🎮",
      title: "GAMER",
      description: "Solve your first game challenge",
      unlocked: puzzleSolved + fixSolved + dailySolved >= 1,
      color: "#ec4899",
    },
    {
      id: "game-xp",
      icon: "⚡",
      title: "XP HUNTER",
      description: "Earn 500 game XP",
      unlocked: totalGameXP >= 500,
      color: "#06b6d4",
    },
    {
      id: "streak-3",
      icon: "🔥",
      title: "ON FIRE",
      description: "3-day daily challenge streak",
      unlocked: streakData.count >= 3,
      color: "#ef4444",
    },
    {
      id: "streak-7",
      icon: "💎",
      title: "UNSTOPPABLE",
      description: "7-day daily challenge streak",
      unlocked: streakData.longestStreak >= 7,
      color: "#a855f7",
    },
    {
      id: "puzzle-master",
      icon: "🧩",
      title: "MAZE MASTER",
      description: "Complete all puzzle levels",
      unlocked: puzzleSolved >= 6,
      color: "#06b6d4",
    },
    {
      id: "debugger",
      icon: "🐛",
      title: "DEBUGGER",
      description: "Fix 6 code bugs",
      unlocked: fixSolved >= 6,
      color: "#f59e0b",
    },
    {
      id: "total-xp-1k",
      icon: "🌟",
      title: "RISING STAR",
      description: "Earn 1000 total XP",
      unlocked: totalXP >= 1000,
      color: "#f59e0b",
    },
    {
      id: "total-xp-5k",
      icon: "🛸",
      title: "ALIEN LEGEND",
      description: "Earn 5000 total XP",
      unlocked: totalXP >= 5000,
      color: "#00fff7",
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="relative min-h-screen pt-20 px-4 pb-16">
      <ParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 mb-5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-orbitron text-xs tracking-widest">MISSION CONTROL</span>
          </div>
          <h1
            className="font-orbitron text-4xl sm:text-5xl font-black mb-2"
            style={{
              background: "linear-gradient(135deg, #00fff7, #7c3aed, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PROGRESS DASHBOARD
          </h1>
          <p className="text-gray-500 text-sm">
            {user ? (
              <>Commander <span className="text-cyan-400 font-orbitron">{user.username.toUpperCase()}</span></>
            ) : "GUEST COMMANDER"} · Total XP:{" "}
            <span className="text-yellow-400 font-orbitron font-bold">{totalXP}</span>
          </p>
        </div>

        {/* ── Top Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "TOTAL XP", value: totalXP, icon: "⚡", color: "text-yellow-400", border: "border-yellow-500/20" },
            { label: "LESSONS DONE", value: totalLessonsCompleted, icon: "📖", color: "text-cyan-400", border: "border-cyan-500/20" },
            { label: "DAILY STREAK 🔥", value: `${streakData.count}d`, icon: "", color: "text-red-400", border: "border-red-500/20" },
            { label: "BADGES", value: `${unlockedCount}/${badges.length}`, icon: "🏅", color: "text-purple-400", border: "border-purple-500/20" },
          ].map((stat) => (
            <div key={stat.label} className={`glass-panel rounded-2xl p-4 text-center border ${stat.border}`}>
              <div className={`font-orbitron text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1 tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* ── Skill Radar Chart ── */}
          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 flex flex-col items-center">
            <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-4 self-start">SKILL RADAR</div>
            <RadarChart data={radarData} />
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
              {lessonStats.map((s) => (
                <div key={s.course.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.course.color }} />
                  <span className="text-xs text-gray-400 truncate">{s.course.language}</span>
                  <span className="text-xs font-orbitron ml-auto" style={{ color: s.course.color }}>
                    {Math.round((s.percent * 0.6 + s.accuracy * 0.4))}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Course Progress ── */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-purple-500/20">
            <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-5">COURSE PROGRESS</div>
            <div className="space-y-5">
              {lessonStats.map((s) => (
                <div key={s.course.id}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{s.course.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-orbitron text-sm font-bold text-white">{s.course.language}</span>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{s.completed}/{s.total} lessons</span>
                          {s.totalQuizzes > 0 && (
                            <span className={s.accuracy >= 80 ? "text-green-400" : s.accuracy >= 60 ? "text-yellow-400" : "text-red-400"}>
                              Quiz: {s.accuracy}%
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="relative h-2.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                          style={{
                            width: `${s.percent}%`,
                            background: `linear-gradient(90deg, ${s.course.color}, ${s.course.color}99)`,
                            boxShadow: `0 0 8px ${s.course.color}60`,
                          }}
                        />
                      </div>
                    </div>
                    <CircularProgress percent={s.percent} color={s.course.color} size={52} />
                  </div>
                  {/* Quiz accuracy bar */}
                  {s.totalQuizzes > 0 && (
                    <div className="flex items-center gap-2 ml-9 mt-1">
                      <span className="text-xs text-gray-600 w-20">Quiz accuracy</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.accuracy}%`,
                            background: s.accuracy >= 80 ? "#10b981" : s.accuracy >= 60 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{s.correctQuizzes}/{s.totalQuizzes}</span>
                    </div>
                  )}
                  {/* Resume link */}
                  <div className="ml-9 mt-1">
                    <Link
                      to={s.completed > 0 ? `/lesson/${s.course.id}/${Math.min((progress[s.course.id]?.lastLesson || 1) + 1, s.total)}` : `/lesson/${s.course.id}/1`}
                      className="text-xs font-orbitron transition-colors hover:opacity-80"
                      style={{ color: s.course.color }}
                    >
                      {s.percent === 100 ? "✓ COMPLETE" : s.completed === 0 ? "START →" : "CONTINUE →"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Games Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Puzzle */}
          <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🧩</span>
              <span className="font-orbitron text-xs text-gray-500 tracking-widest">PUZZLE GAME</span>
            </div>
            <div className="text-3xl font-orbitron font-black text-cyan-400 mb-1">{puzzleSolved}/6</div>
            <p className="text-xs text-gray-500 mb-3">Levels completed</p>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(puzzleStars)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-sm">★</span>
              ))}
              {[...Array(18 - puzzleStars)].map((_, i) => (
                <span key={i} className="text-gray-700 text-sm">★</span>
              ))}
            </div>
            <Link to="/games/puzzle" className="text-xs font-orbitron text-cyan-400 hover:text-cyan-300 transition-colors">
              PLAY →
            </Link>
          </div>

          {/* Fix the Code */}
          <div className="glass-panel rounded-2xl p-5 border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🐛</span>
              <span className="font-orbitron text-xs text-gray-500 tracking-widest">FIX THE CODE</span>
            </div>
            <div className="text-3xl font-orbitron font-black text-yellow-400 mb-1">{fixSolved}/12</div>
            <p className="text-xs text-gray-500 mb-3">Bugs squashed</p>
            <div className="text-2xl font-orbitron font-bold text-yellow-300 mb-4">{fixXP} <span className="text-sm text-gray-500">XP earned</span></div>
            <Link to="/games/fix" className="text-xs font-orbitron text-yellow-400 hover:text-yellow-300 transition-colors">
              DEBUG →
            </Link>
          </div>

          {/* Daily Challenges */}
          <div className="glass-panel rounded-2xl p-5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌍</span>
              <span className="font-orbitron text-xs text-gray-500 tracking-widest">DAILY CHALLENGES</span>
            </div>
            <div className="text-3xl font-orbitron font-black text-green-400 mb-1">{dailySolved}/12</div>
            <p className="text-xs text-gray-500 mb-2">Challenges solved</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">🔥</span>
              <span className="font-orbitron text-sm text-red-400 font-bold">{streakData.count} day streak</span>
            </div>
            <div className="text-sm text-green-300 font-orbitron mb-3">{dailyXP} XP</div>
            <Link to="/games/daily" className="text-xs font-orbitron text-green-400 hover:text-green-300 transition-colors">
              CHALLENGE →
            </Link>
          </div>
        </div>

        {/* ── XP Breakdown ── */}
        <div className="glass-panel rounded-2xl p-6 border border-yellow-500/10 mb-8">
          <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-5">XP BREAKDOWN</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Lesson XP", value: lessonXP, color: "#06b6d4", desc: `${totalLessonsCompleted} lessons × 10` },
              { label: "Quiz XP",   value: quizXP,   color: "#a855f7", desc: `${lessonStats.reduce((s,l)=>s+l.correctQuizzes,0)} correct × 15` },
              { label: "Game XP",   value: totalGameXP, color: "#f59e0b", desc: "Fix + Daily + Puzzle stars" },
              { label: "TOTAL",     value: totalXP,  color: "#00fff7", desc: "Grand total" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-orbitron text-2xl font-black" style={{ color: item.color }}>{item.value}</div>
                <div className="text-xs text-gray-400 font-orbitron mt-0.5">{item.label}</div>
                <div className="text-xs text-gray-600 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Achievement Badges ── */}
        <div className="glass-panel rounded-2xl p-6 border border-yellow-500/20 mb-8">
          <div className="flex items-center justify-between mb-5">
            <div className="font-orbitron text-xs text-gray-500 tracking-widest">ACHIEVEMENT BADGES</div>
            <div className="text-xs font-orbitron text-yellow-400">{unlockedCount}/{badges.length} UNLOCKED</div>
          </div>
          {/* Progress */}
          <div className="progress-bar mb-5">
            <div
              className="progress-fill"
              style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-3">
            {badges.map((badge) => (
              <AchievementBadge key={badge.id} badge={badge} />
            ))}
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { to: "/courses", label: "COURSES", icon: "📚", color: "border-cyan-500/30 text-cyan-400" },
            { to: "/lab", label: "LAB", icon: "⚗️", color: "border-cyan-500/30 text-cyan-400" },
            { to: "/pitimes", label: "ΠTimes AI", icon: "🤖", color: "border-purple-500/30 text-purple-400" },
            { to: "/games", label: "GAMES", icon: "🎮", color: "border-pink-500/30 text-pink-400" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`glass-panel rounded-xl p-4 text-center border ${link.color} hover:scale-105 transition-all group`}
            >
              <div className="text-2xl mb-1">{link.icon}</div>
              <div className={`font-orbitron text-xs font-bold ${link.color.split(" ")[1]}`}>{link.label}</div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
