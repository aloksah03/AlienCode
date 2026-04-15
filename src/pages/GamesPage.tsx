import { Link } from "react-router-dom";
import ParticleBackground from "@/components/features/ParticleBackground";

const GAMES = [
  {
    id: "puzzle",
    route: "/games/puzzle",
    icon: "🧩",
    title: "PUZZLE GAME",
    subtitle: "Code the Robot",
    description: "Guide a robot through maze levels by writing real code commands. Earn stars for efficient solutions.",
    tags: ["Sequencing", "Functions", "Logic"],
    color: "hsl(185 100% 50%)",
    glow: "hsl(185 100% 50% / 0.15)",
    border: "border-cyan-500/30",
    badge: "FEATURED",
    badgeColor: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
    levels: "6 Levels",
  },
  {
    id: "fix",
    route: "/games/fix",
    icon: "🐛",
    title: "FIX THE CODE",
    subtitle: "Debug Challenges",
    description: "Find and fix bugs in broken code. Race against the clock for bonus XP. 12 challenges across JS, Python & C.",
    tags: ["Debugging", "Syntax", "Logic"],
    color: "hsl(50 100% 55%)",
    glow: "hsl(50 100% 55% / 0.12)",
    border: "border-yellow-500/30",
    badge: "XP REWARDS",
    badgeColor: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
    levels: "12 Challenges",
  },
  {
    id: "daily",
    route: "/games/daily",
    icon: "🌍",
    title: "DAILY CHALLENGES",
    subtitle: "Code Every Day",
    description: "One new challenge every day. Build your streak, earn XP, and track your consistency with a visual heatmap.",
    tags: ["Consistency", "Problem Solving", "Streaks"],
    color: "hsl(140 80% 50%)",
    glow: "hsl(140 80% 50% / 0.12)",
    border: "border-green-500/30",
    badge: "NEW DAILY",
    badgeColor: "text-green-400 border-green-500/40 bg-green-500/10",
    levels: "12 Challenges",
  },
];

export default function GamesPage() {
  return (
    <div className="relative min-h-screen pt-20 px-4 pb-16">
      <ParticleBackground />
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-400 font-orbitron text-xs tracking-widest">GAME ZONE</span>
          </div>
          <h1
            className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-black mb-4"
            style={{
              background: "linear-gradient(135deg, #00fff7 0%, #a855f7 50%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(0,255,247,0.3))",
            }}
          >
            CODE GAMES
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
            Learn to code through play. Solve puzzles, squash bugs, and build streaks — all while mastering real programming concepts.
          </p>
        </div>

        {/* Game cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {GAMES.map((game) => (
            <Link
              key={game.id}
              to={game.route}
              className={`glass-panel rounded-3xl p-6 border ${game.border} transition-all hover:scale-105 group relative overflow-hidden flex flex-col`}
              style={{ boxShadow: `0 0 40px ${game.glow}` }}
            >
              {/* Glow bg */}
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${game.glow} 0%, transparent 70%)` }}
              />

              {/* Badge */}
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-orbitron tracking-wider mb-5 w-fit ${game.badgeColor}`}>
                {game.badge}
              </div>

              <div className="text-5xl mb-4">{game.icon}</div>

              <h3
                className="font-orbitron text-lg font-black mb-1 group-hover:opacity-90 transition-all"
                style={{ color: game.color }}
              >
                {game.title}
              </h3>
              <p className="text-gray-400 text-xs font-orbitron tracking-wider mb-3">{game.subtitle}</p>

              <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">{game.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {game.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-lg bg-white/5 text-gray-400 text-xs border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-orbitron">{game.levels}</span>
                <span
                  className="font-orbitron text-xs font-bold group-hover:translate-x-1 transition-transform"
                  style={{ color: game.color }}
                >
                  PLAY →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming soon section */}
        <div className="glass-panel rounded-3xl p-8 border border-white/5 text-center">
          <div className="font-orbitron text-xs text-gray-600 tracking-widest mb-4">COMING SOON</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "⚔️", title: "Code vs Enemy", desc: "Strategy battles" },
              { icon: "🕵️", title: "Code Detective", desc: "Story missions" },
              { icon: "🏃", title: "Code Runner", desc: "Endless runner" },
              { icon: "🧮", title: "Algo Battles", desc: "Competitive coding" },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-2xl bg-white/2 border border-white/5 opacity-50">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-orbitron text-xs text-gray-400 mb-1">{item.title}</div>
                <div className="text-xs text-gray-600">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
