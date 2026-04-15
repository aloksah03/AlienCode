import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ParticleBackground from "@/components/features/ParticleBackground";
import { COURSES } from "@/constants/courses";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import heroBg from "@/assets/hero-bg.jpg";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, loginAsGuest } = useAuth();
  const { getCourseProgress } = useProgress();
  const [typedText, setTypedText] = useState("");
  const fullText = "LEARN TO CODE FROM THE FUTURE";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const handleGuestEnter = () => {
    loginAsGuest();
    navigate("/courses");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      {/* Hero background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,247,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,247,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Badge */}
        <div className="mb-8 px-4 py-2 glass-panel rounded-full border border-cyan-500/30 flex items-center gap-2 hologram">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-orbitron tracking-[0.2em] text-cyan-400">
            AI-POWERED LEARNING PLATFORM
          </span>
        </div>

        {/* Title */}
        <h1 className="font-orbitron text-center mb-4">
          <span
            className="block text-5xl sm:text-7xl lg:text-8xl font-black tracking-wider"
            style={{
              background: "linear-gradient(135deg, #00fff7 0%, #7c3aed 50%, #00fff7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(0,255,247,0.5))",
            }}
          >
            ALIEN CODE
          </span>
          <span className="block text-sm sm:text-base lg:text-lg text-cyan-400/80 tracking-[0.3em] mt-2">
            {typedText}<span className="animate-pulse">_</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-center max-w-2xl mt-6 mb-10 text-base sm:text-lg leading-relaxed">
          Master <span className="text-yellow-400 font-semibold">Python</span>,{" "}
          <span className="text-yellow-300 font-semibold">JavaScript</span>,{" "}
          <span className="text-orange-400 font-semibold">HTML</span>, and{" "}
          <span className="text-blue-400 font-semibold">C</span> with AI-powered lessons, interactive IDE, and your personal AI tutor —{" "}
          <span className="text-purple-400 font-semibold">ΠTimes</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          {user ? (
            <Link to="/courses" className="cyber-button-primary cyber-button px-10 py-4 rounded-2xl text-sm tracking-wider font-orbitron">
              🚀 CONTINUE LEARNING
            </Link>
          ) : (
            <>
              <Link to="/auth" className="cyber-button-primary cyber-button px-10 py-4 rounded-2xl text-sm tracking-wider font-orbitron">
                🚀 SIGN IN / REGISTER
              </Link>
              <button onClick={handleGuestEnter} className="cyber-button px-10 py-4 rounded-2xl text-sm tracking-wider font-orbitron">
                👽 ENTER AS GUEST
              </button>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16 w-full max-w-3xl">
          {[
            { label: "LANGUAGES", value: "4" },
            { label: "TOTAL LESSONS", value: "144+" },
            { label: "AI TUTOR", value: "ΠTimes" },
            { label: "SKILL LEVELS", value: "36 EACH" },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-xl p-4 text-center border border-cyan-500/10">
              <div className="font-orbitron text-2xl font-black text-cyan-400 glow-text">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1 tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Course grid */}
        <div className="w-full max-w-5xl mb-20">
          <h2 className="font-orbitron text-center text-xl text-gray-400 tracking-widest mb-8">
            — CHOOSE YOUR MISSION —
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {COURSES.map((course) => {
              const prog = user ? getCourseProgress(course.id, course.totalLessons) : 0;
              return (
                <Link
                  key={course.id}
                  to={user ? `/lesson/${course.id}/1` : "/auth"}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 text-center border border-white/5 transition-all hover:scale-105 group"
                >
                  <div className="text-4xl mb-3">{course.icon}</div>
                  <h3 className="font-orbitron text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {course.language}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{course.totalLessons} lessons</p>
                  {prog > 0 && (
                    <div className="progress-bar mt-3">
                      <div className="progress-fill" style={{ width: `${prog}%` }} />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ──────────────────────────────────────────── */}
        {/* ΠTimes AI Section */}
        {/* ──────────────────────────────────────────── */}
        <div className="w-full max-w-5xl mb-12">
          <div
            className="relative rounded-3xl overflow-hidden border border-purple-500/30 p-8 sm:p-12"
            style={{
              background: "linear-gradient(135deg, hsl(270 80% 8% / 0.95), hsl(270 60% 5% / 0.9))",
              boxShadow: "0 0 60px hsl(270 80% 50% / 0.15), inset 0 0 60px hsl(270 80% 20% / 0.05)",
            }}
          >
            {/* Decorative glows */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(270 80% 50% / 0.15) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(185 100% 50% / 0.1) 0%, transparent 70%)" }} />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              {/* Left: info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-xs font-orbitron tracking-widest text-purple-300">AI COMPANION</span>
                </div>

                <h2
                  className="font-orbitron text-4xl sm:text-5xl font-black mb-4"
                  style={{ background: "linear-gradient(135deg, #c084fc, #a855f7, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                >
                  ΠTimes
                </h2>

                <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-lg">
                  Your hyper-intelligent AI tutor. ΠTimes answers any question — coding, math, science, history, philosophy.
                  Explains with visual diagrams, writes and debugs code, and remembers every conversation in history.
                </p>

                <ul className="space-y-2 mb-8 text-sm text-gray-400">
                  {[
                    "💻  Write & debug code in any language",
                    "🧠  Explain any concept from basics to PhD level",
                    "📐  Create ASCII diagrams for visual learning",
                    "📚  Chat history saved — review any time",
                    "🌌  Science, math, history, philosophy & more",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/pitimes"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-orbitron text-sm tracking-wider font-bold transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                    color: "white",
                    boxShadow: "0 0 25px hsl(270 80% 50% / 0.4)",
                  }}
                >
                  OPEN ΠTimes →
                </Link>
              </div>

              {/* Right: chat preview mockup */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <div
                  className="rounded-2xl border border-purple-500/20 overflow-hidden"
                  style={{ background: "hsl(270 60% 4% / 0.9)" }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-purple-500/10">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-xs font-black font-orbitron text-white">Π</div>
                    <span className="text-purple-300 font-orbitron text-xs font-bold">ΠTimes</span>
                    <div className="ml-auto flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-gray-600 text-xs">Online</span>
                    </div>
                  </div>
                  {/* Messages */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-end">
                      <div className="bg-cyan-500/15 border border-cyan-500/20 rounded-xl px-3 py-2 text-xs text-gray-300 max-w-[80%]">
                        Explain recursion with examples
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-2 text-xs text-gray-400 max-w-[90%] leading-relaxed">
                        Recursion is when a function calls <span className="text-purple-300">itself</span>. Base case stops it, recursive case continues...
                        <span className="block mt-1 text-cyan-400 font-mono text-xs">def fact(n):<br/>  if n≤1: return 1<br/>  return n * fact(n-1)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────── */}
        {/* LAB Section */}
        {/* ──────────────────────────────────────────── */}
        <div className="w-full max-w-5xl mb-20">
          <div
            className="relative rounded-3xl overflow-hidden border border-cyan-500/30 p-8 sm:p-12"
            style={{
              background: "linear-gradient(135deg, hsl(185 100% 5% / 0.95), hsl(220 80% 5% / 0.9))",
              boxShadow: "0 0 60px hsl(185 100% 50% / 0.1), inset 0 0 60px hsl(185 100% 20% / 0.05)",
            }}
          >
            <div className="absolute top-0 left-0 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(185 100% 50% / 0.12) 0%, transparent 70%)" }} />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              {/* Left: IDE preview mockup */}
              <div className="w-full lg:w-96 flex-shrink-0">
                <div
                  className="rounded-2xl border border-cyan-500/20 overflow-hidden font-mono text-xs"
                  style={{ background: "hsl(220 80% 4% / 0.95)" }}
                >
                  {/* IDE title bar */}
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cyan-500/10 bg-black/20">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-gray-500 text-xs ml-2 font-orbitron">ALIEN LAB — Python</span>
                  </div>
                  {/* Code */}
                  <div className="p-4 leading-relaxed">
                    <div className="text-gray-600"><span className="text-yellow-500">def</span> <span className="text-cyan-400">fibonacci</span>(n):</div>
                    <div className="text-gray-600 ml-4"><span className="text-purple-400">if</span> n &lt;= 1:</div>
                    <div className="text-gray-600 ml-8"><span className="text-purple-400">return</span> n</div>
                    <div className="text-gray-600 ml-4"><span className="text-purple-400">return</span> fibonacci(n<span className="text-cyan-400">-</span>1) <span className="text-cyan-400">+</span> fibonacci(n<span className="text-cyan-400">-</span>2)</div>
                    <div className="text-gray-700 mt-2"></div>
                    <div><span className="text-yellow-500">print</span>([fibonacci(i) <span className="text-purple-400">for</span> i <span className="text-purple-400">in</span> range(10)])</div>
                  </div>
                  {/* Output */}
                  <div className="border-t border-cyan-500/10 px-4 py-3 bg-black/30">
                    <div className="text-gray-500 text-xs mb-1 font-orbitron">OUTPUT</div>
                    <div className="text-green-400">[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]</div>
                  </div>
                </div>
              </div>

              {/* Right: info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-orbitron tracking-widest text-cyan-300">INTERACTIVE IDE</span>
                </div>

                <h2
                  className="font-orbitron text-4xl sm:text-5xl font-black mb-4"
                  style={{ background: "linear-gradient(135deg, #00fff7, #06b6d4, #0284c7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                >
                  ALIEN LAB
                </h2>

                <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-lg">
                  Four built-in IDEs — one for each language. Write and execute code directly in the browser.
                  Errors are explained with location, type, and smart fix suggestions.
                </p>

                <ul className="space-y-2 mb-8 text-sm text-gray-400">
                  {[
                    "⚡  Real-time code execution in browser",
                    "🐍  Python, JavaScript, HTML & C support",
                    "🔍  Smart error detection & fix suggestions",
                    "💾  Save your code and review it later",
                    "🎨  Syntax highlighting for all 4 languages",
                  ].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <Link
                  to="/lab"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-orbitron text-sm tracking-wider font-bold transition-all hover:scale-105 cyber-button-primary cyber-button"
                >
                  OPEN LAB →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────── */}
        {/* GAMES Section */}
        {/* ──────────────────────────────────────────── */}
        <div className="w-full max-w-5xl mb-12">
          <div
            className="relative rounded-3xl overflow-hidden border border-pink-500/30 p-8 sm:p-12"
            style={{
              background: "linear-gradient(135deg, hsl(300 80% 5% / 0.95), hsl(270 60% 5% / 0.9))",
              boxShadow: "0 0 60px hsl(300 80% 50% / 0.1), inset 0 0 60px hsl(300 80% 20% / 0.05)",
            }}
          >
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(300 80% 50% / 0.12) 0%, transparent 70%)" }} />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/40 bg-pink-500/10 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                <span className="text-xs font-orbitron tracking-widest text-pink-300">GAME ZONE</span>
              </div>
              <h2
                className="font-orbitron text-4xl sm:text-5xl font-black mb-4"
                style={{ background: "linear-gradient(135deg, #f9a8d4, #ec4899, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
              >
                CODE GAMES
              </h2>
              <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl">
                Learn programming through play. Solve maze puzzles with code, hunt bugs under the clock, and build daily coding streaks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: "🧩", title: "Puzzle Game", desc: "Guide a robot with code commands through maze levels", route: "/games/puzzle" },
                  { icon: "🐛", title: "Fix the Code", desc: "Debug broken code challenges and earn XP", route: "/games/fix" },
                  { icon: "🌍", title: "Daily Challenges", desc: "One coding challenge per day — build your streak", route: "/games/daily" },
                ].map((g) => (
                  <Link
                    key={g.title}
                    to={g.route}
                    className="p-4 rounded-2xl border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 transition-all hover:scale-105 group"
                  >
                    <div className="text-3xl mb-2">{g.icon}</div>
                    <div className="font-orbitron text-sm font-bold text-pink-300 group-hover:text-pink-200 mb-1">{g.title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{g.desc}</div>
                  </Link>
                ))}
              </div>
              <Link
                to="/games"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-orbitron text-sm tracking-wider font-bold transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #a855f7)",
                  color: "white",
                  boxShadow: "0 0 25px hsl(300 80% 50% / 0.4)",
                }}
              >
                ENTER GAME ZONE →
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Dashboard Banner */}
        <div className="w-full max-w-5xl mb-12">
          <Link
            to="/dashboard"
            className="flex items-center gap-5 glass-panel rounded-2xl p-6 border border-green-500/30 hover:scale-[1.02] transition-all group"
            style={{ boxShadow: "0 0 30px hsl(140 80% 50% / 0.08)" }}
          >
            <div className="text-4xl">📊</div>
            <div className="flex-1">
              <h3 className="font-orbitron text-base font-bold text-green-300 group-hover:text-green-200 mb-1">MISSION DASHBOARD</h3>
              <p className="text-gray-500 text-sm">Track your lessons, quiz scores, game XP, streaks, and achievement badges in one place.</p>
            </div>
            <span className="font-orbitron text-sm text-green-400 group-hover:translate-x-1 transition-transform">OPEN →</span>
          </Link>
        </div>

        {/* Features strip */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          {[
            { icon: "🎓", title: "STRUCTURED LEARNING", desc: "36+ lessons per language, from zero to pro. Each lesson includes content, code examples, and a quiz." },
            { icon: "🤖", title: "ΠTimes AI TUTOR",    desc: "Your hyper-intelligent AI companion. Explains any concept, debugs code, creates diagrams, answers anything." },
            { icon: "🎙️", title: "TEXT TO SPEECH",      desc: "Every lesson has a built-in TTS assistant. Tap the speaker icon to have the lesson read aloud to you." },
          ].map((f) => (
            <div key={f.title} className="glass-panel rounded-2xl p-6 border border-white/5">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-orbitron text-sm font-bold text-cyan-300 mb-2 tracking-wider">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs font-orbitron tracking-widest pb-24">
          © 2025 ALIEN CODE — TRANSMITTING KNOWLEDGE FROM THE COSMOS
        </div>
      </div>
    </div>
  );
}
