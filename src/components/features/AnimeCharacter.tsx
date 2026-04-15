import { useEffect, useRef, useState } from "react";
import animeChar from "@/assets/anime-character.png";

export default function AnimeCharacter() {
  const charRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 100, y: 300 });
  const vel = useRef({ x: 1.8, y: 0.9 });
  const animRef = useRef<number>(0);
  const [flipped, setFlipped] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    const SIZE = 120;
    let lastBounce = 0;

    const animate = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      let didBounce = false;

      if (pos.current.x <= 0) {
        pos.current.x = 0;
        vel.current.x = Math.abs(vel.current.x);
        setFlipped(false);
        didBounce = true;
      } else if (pos.current.x >= w - SIZE) {
        pos.current.x = w - SIZE;
        vel.current.x = -Math.abs(vel.current.x);
        setFlipped(true);
        didBounce = true;
      }

      if (pos.current.y <= 60) {
        pos.current.y = 60;
        vel.current.y = Math.abs(vel.current.y);
        didBounce = true;
      } else if (pos.current.y >= h - SIZE - 60) {
        pos.current.y = h - SIZE - 60;
        vel.current.y = -Math.abs(vel.current.y);
        didBounce = true;
      }

      if (didBounce && time - lastBounce > 200) {
        setBouncing(true);
        setTimeout(() => setBouncing(false), 300);
        lastBounce = time;
      }

      if (charRef.current) {
        charRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) scaleX(${flipped ? -1 : 1})`;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [flipped]);

  return (
    <div
      ref={charRef}
      className="fixed z-10 pointer-events-none will-change-transform"
      style={{
        width: 120,
        height: 160,
        top: 0,
        left: 0,
        filter: bouncing
          ? "drop-shadow(0 0 20px hsl(185 100% 60%)) drop-shadow(0 0 40px hsl(270 80% 60%))"
          : "drop-shadow(0 0 8px hsl(185 100% 50%))",
        transition: "filter 0.2s ease",
      }}
    >
      <img
        src={animeChar}
        alt="Alien mascot"
        className="w-full h-full object-contain"
        style={{
          animation: "hologram-flicker 8s ease-in-out infinite",
        }}
      />
      {bouncing && (
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-cyan-400 text-xs font-orbitron animate-bounce whitespace-nowrap"
          style={{ textShadow: "0 0 10px cyan" }}
        >
          ✦ ALIEN ✦
        </div>
      )}
    </div>
  );
}
