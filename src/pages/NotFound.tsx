import { Link } from "react-router-dom";
import ParticleBackground from "@/components/features/ParticleBackground";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <ParticleBackground />
      <div className="relative z-10 text-center">
        <div className="text-8xl mb-6">👽</div>
        <h1 className="font-orbitron text-6xl font-black text-cyan-400 glow-text mb-4">404</h1>
        <p className="font-orbitron text-xl text-gray-400 mb-2 tracking-widest">SIGNAL LOST</p>
        <p className="text-gray-500 mb-8 text-sm">This page has drifted into deep space.</p>
        <Link to="/" className="cyber-button-primary cyber-button px-8 py-3.5 rounded-2xl font-orbitron text-sm tracking-wider">
          ← RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}
