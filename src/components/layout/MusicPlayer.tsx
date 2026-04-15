
import { useState, useRef, useEffect, useCallback } from "react";

const TRACKS = [
  { id: 1, title: "Let the World Burn", artist: "Cinematic • Instrumental", color: "#ef4444", bpm: 95 },
  { id: 2, title: "Lunar Diamante",     artist: "Ambient • Instrumental",   color: "#a855f7", bpm: 70 },
  { id: 3, title: "Six Days",           artist: "Electronic • Instrumental", color: "#06b6d4", bpm: 110 },
  { id: 4, title: "Timeless",           artist: "Orchestral • Instrumental", color: "#f59e0b", bpm: 80 },
  { id: 5, title: "I Think They Call This Love", artist: "Chillout • Instrumental", color: "#10b981", bpm: 75 },
];

// Pentatonic scale frequencies per track (A minor pentatonic variants)
const TRACK_SCALES = [
  [110, 130.81, 164.81, 196, 220, 261.63, 329.63],   // Track 1: A2 pentatonic
  [82.41, 98, 123.47, 146.83, 196, 246.94, 293.66],   // Track 2: E2 pentatonic (dark)
  [146.83, 174.61, 220, 261.63, 293.66, 349.23, 440], // Track 3: D3 pentatonic (bright)
  [98, 130.81, 146.83, 196, 220, 261.63, 293.66],      // Track 4: G2 pentatonic
  [110, 146.83, 164.81, 220, 246.94, 293.66, 329.63],  // Track 5: A2 maj pentatonic
];

function buildTrack(ctx: AudioContext, trackIdx: number, vol: number) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.connect(ctx.destination);
  const allNodes: AudioNode[] = [master];

  const scale = TRACK_SCALES[trackIdx];
  const bpm = TRACKS[trackIdx].bpm;
  const beat = 60 / bpm;
  const now = ctx.currentTime;

  // ── Reverb ──
  const revLen = ctx.sampleRate * 3;
  const revBuf = ctx.createBuffer(2, revLen, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = revBuf.getChannelData(ch);
    for (let i = 0; i < revLen; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, 3);
    }
  }
  const reverb = ctx.createConvolver();
  reverb.buffer = revBuf;
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.25;
  reverb.connect(reverbGain);
  reverbGain.connect(master);
  allNodes.push(reverb, reverbGain);

  // ── Low-pass filter ──
  const lpf = ctx.createBiquadFilter();
  lpf.type = "lowpass";
  lpf.frequency.value = 1800;
  lpf.Q.value = 0.7;
  lpf.connect(master);
  lpf.connect(reverb);
  allNodes.push(lpf);

  // ── Pad (sustained chords) ──
  const chordFreqs = [scale[0], scale[2], scale[4], scale[6]];
  chordFreqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.value = freq;

    // Slight detune for richness
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = freq * 1.005;

    const g = ctx.createGain();
    g.gain.value = 0.03;

    osc.connect(g);
    osc2.connect(g);
    g.connect(lpf);

    osc.start(now);
    osc2.start(now);
    allNodes.push(osc, osc2, g);
  });

  // ── Arpeggio melody (scheduled notes) ──
  const melodyGain = ctx.createGain();
  melodyGain.gain.value = 0.055;
  melodyGain.connect(lpf);
  allNodes.push(melodyGain);

  const patterns = [
    [0, 2, 4, 5, 4, 2, 0, 2],  // Track 1
    [0, 1, 3, 4, 6, 4, 3, 1],  // Track 2
    [0, 2, 4, 6, 4, 2, 5, 3],  // Track 3
    [0, 3, 2, 4, 1, 4, 2, 0],  // Track 4
    [0, 2, 3, 5, 3, 2, 4, 6],  // Track 5
  ];
  const pattern = patterns[trackIdx];
  const noteDuration = beat * 0.5;

  for (let bar = 0; bar < 64; bar++) {
    for (let n = 0; n < pattern.length; n++) {
      const t = now + bar * beat * pattern.length * 0.5 + n * noteDuration;
      if (t > now + 300) break;

      const noteOsc = ctx.createOscillator();
      noteOsc.type = "triangle";
      const noteFreq = scale[pattern[n]] * (bar % 4 === 3 ? 2 : 1); // occasional octave jump
      noteOsc.frequency.setValueAtTime(noteFreq, t);

      const noteEnv = ctx.createGain();
      noteEnv.gain.setValueAtTime(0, t);
      noteEnv.gain.linearRampToValueAtTime(1, t + 0.02);
      noteEnv.gain.setValueAtTime(1, t + noteDuration * 0.6);
      noteEnv.gain.linearRampToValueAtTime(0, t + noteDuration * 0.95);

      noteOsc.connect(noteEnv);
      noteEnv.connect(melodyGain);
      noteOsc.start(t);
      noteOsc.stop(t + noteDuration);
      allNodes.push(noteOsc, noteEnv);
    }
  }

  // ── Bass pulse ──
  const bassGain = ctx.createGain();
  bassGain.gain.value = 0.07;
  bassGain.connect(master);
  allNodes.push(bassGain);

  const bassPatterns = [
    [0, 0, 4, 0], [0, 3, 0, 4], [0, 0, 2, 4],
    [0, 4, 0, 2], [0, 2, 4, 0],
  ];
  const bassPat = bassPatterns[trackIdx];

  for (let bar = 0; bar < 32; bar++) {
    for (let n = 0; n < bassPat.length; n++) {
      const t = now + bar * beat * bassPat.length + n * beat;
      if (t > now + 300) break;

      const bassOsc = ctx.createOscillator();
      bassOsc.type = "sine";
      bassOsc.frequency.value = scale[bassPat[n]] * 0.5; // one octave down

      const bassEnv = ctx.createGain();
      bassEnv.gain.setValueAtTime(0, t);
      bassEnv.gain.linearRampToValueAtTime(1, t + 0.01);
      bassEnv.gain.exponentialRampToValueAtTime(0.001, t + beat * 0.8);

      bassOsc.connect(bassEnv);
      bassEnv.connect(bassGain);
      bassOsc.start(t);
      bassOsc.stop(t + beat);
      allNodes.push(bassOsc, bassEnv);
    }
  }

  // Fade in
  master.gain.linearRampToValueAtTime(vol, now + 2);

  return { master, allNodes };
}

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [expanded, setExpanded] = useState(false);
  const [vizBars, setVizBars] = useState<number[]>(Array(16).fill(2));

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const vizRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const teardown = useCallback(() => {
    nodesRef.current.forEach((n) => {
      try { (n as OscillatorNode).stop?.(); } catch (_) {}
    });
    nodesRef.current = [];
    masterRef.current = null;
  }, []);

  const play = useCallback((trackIdx: number, vol: number) => {
    teardown();
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const { master, allNodes } = buildTrack(ctx, trackIdx, vol);
    masterRef.current = master;
    nodesRef.current = allNodes;
  }, [teardown]);

  useEffect(() => {
    if (isPlaying) {
      play(currentTrack, volume);
    } else {
      if (masterRef.current && ctxRef.current) {
        const ctx = ctxRef.current;
        masterRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        setTimeout(teardown, 700);
      }
    }
  }, [isPlaying, currentTrack, volume, play, teardown]); // Added volume, play, and teardown to deps

  useEffect(() => {
    if (masterRef.current && ctxRef.current && isPlaying) {
      masterRef.current.gain.linearRampToValueAtTime(volume, ctxRef.current.currentTime + 0.15);
    }
  }, [volume, isPlaying]); // Added isPlaying to deps

  useEffect(() => {
    if (isPlaying) {
      vizRef.current = setInterval(() => {
        setVizBars(Array.from({ length: 16 }, (_, i) =>
          Math.max(2, Math.sin(Date.now() / 280 + i * 0.9) * 13 + 14 + Math.random() * 7)
        ));
      }, 75);
    } else {
      if (vizRef.current) clearInterval(vizRef.current);
      setVizBars(Array(16).fill(2));
    }
    return () => { if (vizRef.current) clearInterval(vizRef.current); };
  }, [isPlaying]);

  useEffect(() => () => { teardown(); ctxRef.current?.close(); }, [teardown]);

  const track = TRACKS[currentTrack];

  const handlePlayPause = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    setIsPlaying((p) => !p);
  };

  const switchTrack = (idx: number) => {
    setCurrentTrack(idx);
    if (!isPlaying) setIsPlaying(true);
    else {
      // Restart with new track
      teardown();
      setTimeout(() => {
        if (ctxRef.current) {
          const { master, allNodes } = buildTrack(ctxRef.current, idx, volume);
          masterRef.current = master;
          nodesRef.current = allNodes;
        }
      }, 50);
    }
  };

  const prev = () => switchTrack((currentTrack - 1 + TRACKS.length) % TRACKS.length);
  const next = () => switchTrack((currentTrack + 1) % TRACKS.length);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {expanded && (
        <div
          className="glass-panel rounded-2xl p-4 mb-3 w-72 border border-cyan-500/20 shadow-2xl slide-up"
          style={{ backdropFilter: "blur(24px)" }}
        >
          {/* Track info */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-cyan-400 animate-pulse" : "bg-gray-500"}`} />
              <span className="text-xs text-cyan-400 font-orbitron tracking-widest">
                {isPlaying ? "NOW PLAYING" : "PAUSED"}
              </span>
            </div>
            <p className="text-white font-semibold text-sm truncate">{track.title}</p>
            <p className="text-gray-500 text-xs">{track.artist}</p>

            {/* Visualizer */}
            <div className="flex items-end gap-0.5 h-8 mt-3">
              {vizBars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all duration-75"
                  style={{
                    height: `${h}px`,
                    background: isPlaying ? `hsl(${185 + i * 5} 100% 55%)` : "hsl(220 40% 20%)",
                    opacity: isPlaying ? 0.9 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Track list */}
          <div className="space-y-1 mb-4 max-h-36 overflow-y-auto pr-1">
            {TRACKS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => switchTrack(i)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                  i === currentTrack
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent"
                }`}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: t.color, boxShadow: i === currentTrack && isPlaying ? `0 0 6px ${t.color}` : "none" }}
                />
                <span className="truncate">{t.title}</span>
                {i === currentTrack && isPlaying && (
                  <span className="ml-auto text-cyan-400 text-xs animate-pulse">♪</span>
                )}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prev} className="cyber-button w-9 h-9 rounded-xl flex items-center justify-center text-base">⏮</button>
            <button
              onClick={handlePlayPause}
              className="cyber-button-primary cyber-button w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button onClick={next} className="cyber-button w-9 h-9 rounded-xl flex items-center justify-center text-base">⏭</button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">🔈</span>
            <input
              type="range" min="0" max="1" step="0.01" value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 accent-cyan-400 cursor-pointer"
            />
            <span className="text-gray-500 text-sm">🔊</span>
          </div>

          <p className="text-gray-700 text-xs text-center mt-2 font-orbitron tracking-wider">
            ALIEN CODE SOUNDTRACK
          </p>
          <p className="text-gray-800 text-xs text-center mt-1">
            Click ▶ then adjust volume
          </p>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => {
          setExpanded(!expanded);
          if (!expanded && !isPlaying) {
            // Auto-show hint to click play
          }
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isPlaying ? "bg-gradient-to-br from-cyan-500 to-cyan-700 glow-box" : "glass-panel border border-cyan-500/30"
        }`}
        aria-label="Music Player"
      >
        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 rounded-sm bg-black animate-bounce"
                style={{ height: `${10 + i * 2}px`, animationDelay: `${i * 100}ms`, animationDuration: "0.5s" }}
              />
            ))}
          </div>
        ) : (
          <span className="text-2xl">🎶</span>
        )}
      </button>
    </div>
  );
}
