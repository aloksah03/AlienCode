import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { path: "/", label: "HOME" },
  { path: "/courses", label: "COURSES" },
  { path: "/lab", label: "LAB" },
  { path: "/pitimes", label: "ΠTimes" },
  { path: "/games", label: "GAMES" },
  { path: "/dashboard", label: "PROGRESS" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-panel border-b border-cyan-500/20 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-black font-orbitron font-black text-sm glow-box">
            AC
          </div>
          <span className="font-orbitron font-bold text-lg tracking-widest text-cyan-400 glow-text hidden sm:block">
            ALIEN CODE
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-lg font-orbitron text-xs tracking-widest transition-all duration-200 ${
                location.pathname === path || (path !== "/" && location.pathname.startsWith(path))
                  ? "text-cyan-300 bg-cyan-500/10 border border-cyan-500/30"
                  : "text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/5"
              } ${label === "ΠTimes" ? "text-purple-300 hover:text-purple-200" : ""} ${label === "GAMES" ? "!text-pink-300 hover:!text-pink-200" : ""} ${label === "PROGRESS" ? "!text-green-300 hover:!text-green-200" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-orbitron text-cyan-300 tracking-wider">
                  {user.isGuest ? "GUEST" : user.username.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="cyber-button px-4 py-2 rounded-lg text-xs tracking-wider"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="cyber-button-primary cyber-button px-5 py-2 rounded-lg"
            >
              ENTER
            </Link>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden cyber-button px-3 py-2 rounded-lg"
          >
            <div className="flex flex-col gap-1">
              <span className={`block w-5 h-0.5 bg-cyan-400 transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-5 h-0.5 bg-cyan-400 transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-cyan-400 transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-panel mt-2 mx-4 rounded-xl p-4 border border-cyan-500/20">
          {NAV_ITEMS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-orbitron text-sm tracking-widest mb-1 ${
                location.pathname === path
                  ? "text-cyan-300 bg-cyan-500/10"
                  : "text-gray-400"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
