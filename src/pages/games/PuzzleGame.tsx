import { useState, useEffect, useRef, useCallback } from "react";
import { PUZZLE_LEVELS, PuzzleLevel, CellType, Direction } from "@/constants/gameData";
import ParticleBackground from "@/components/features/ParticleBackground";

type RobotState = {
  row: number;
  col: number;
  dir: Direction;
  hasKey: boolean;
  doorUnlocked: boolean;
};

const DIR_DELTAS: Record<Direction, [number, number]> = {
  up:    [-1, 0],
  down:  [1, 0],
  left:  [0, -1],
  right: [0, 1],
};

const TURN_LEFT: Record<Direction, Direction> = {
  up: "left", left: "down", down: "right", right: "up",
};
const TURN_RIGHT: Record<Direction, Direction> = {
  up: "right", right: "down", down: "left", left: "up",
};

const DIR_EMOJI: Record<Direction, string> = {
  up: "⬆", down: "⬇", left: "⬅", right: "➡",
};

const CELL_COLORS: Record<CellType, string> = {
  0: "hsl(220 60% 8%)",    // path
  1: "hsl(220 60% 14%)",   // wall
  2: "hsl(0 80% 25%)",     // trap
  3: "hsl(50 100% 25%)",   // key
  4: "hsl(270 80% 25%)",   // door
  5: "hsl(140 80% 20%)",   // goal
};

function parseSolution(code: string): string[] {
  const cmds: string[] = [];

  // Flatten multi-line into single string for easier parsing
  const text = code.replace(/\/\/[^\n]*/g, ""); // strip comments
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip function/class definitions and closing braces
    if (line.startsWith("function ") || line === "}") { i++; continue; }

    // moveForward()
    if (/^moveForward\(\);?$/.test(line)) { cmds.push("moveForward"); i++; continue; }

    // turnLeft()
    if (/^turnLeft\(\);?$/.test(line)) { cmds.push("turnLeft"); i++; continue; }

    // turnRight()
    if (/^turnRight\(\);?$/.test(line)) { cmds.push("turnRight"); i++; continue; }

    // repeat(n) { ... } — inline: repeat(3) { moveForward(); }
    const inlineRepeat = line.match(/^repeat\s*\(\s*(\d+)\s*\)\s*\{([^}]+)\}/);
    if (inlineRepeat) {
      const count = parseInt(inlineRepeat[1]);
      const innerCmds = inlineRepeat[2].split(";").map((s) => s.trim()).filter(Boolean);
      for (let r = 0; r < count; r++) {
        for (const cmd of innerCmds) {
          if (/^moveForward\(\)/.test(cmd)) cmds.push("moveForward");
          else if (/^turnLeft\(\)/.test(cmd)) cmds.push("turnLeft");
          else if (/^turnRight\(\)/.test(cmd)) cmds.push("turnRight");
        }
      }
      i++; continue;
    }

    // repeat(n) { — multi-line block
    const multiRepeat = line.match(/^repeat\s*\(\s*(\d+)\s*\)\s*\{\s*$/);
    if (multiRepeat) {
      const count = parseInt(multiRepeat[1]);
      const blockCmds: string[] = [];
      i++;
      while (i < lines.length && lines[i] !== "}") {
        const bl = lines[i].trim();
        if (/^moveForward\(\);?$/.test(bl)) blockCmds.push("moveForward");
        else if (/^turnLeft\(\);?$/.test(bl)) blockCmds.push("turnLeft");
        else if (/^turnRight\(\);?$/.test(bl)) blockCmds.push("turnRight");
        i++;
      }
      i++; // skip closing }
      for (let r = 0; r < count; r++) cmds.push(...blockCmds);
      continue;
    }

    // Named function call (e.g., goForward3())
    const funcCall = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\(\);?$/);
    if (funcCall) {
      const fname = funcCall[1];
      // Find function definition and inline it (up to 30 cmds for safety)
      const funcDefStart = lines.findIndex((l) => l.startsWith(`function ${fname}`));
      if (funcDefStart !== -1) {
        let j = funcDefStart + 1;
        let depth = 1;
        while (j < lines.length && depth > 0) {
          const fl = lines[j].trim();
          if (fl === "}") { depth--; if (depth === 0) break; }
          else if (fl.includes("{")) depth++;
          else {
            if (/^moveForward\(\);?$/.test(fl)) cmds.push("moveForward");
            else if (/^turnLeft\(\);?$/.test(fl)) cmds.push("turnLeft");
            else if (/^turnRight\(\);?$/.test(fl)) cmds.push("turnRight");
          }
          j++;
        }
      }
      i++; continue;
    }

    i++;
  }

  return cmds;
}

function executeCommands(
  commands: string[],
  level: PuzzleLevel
): { states: RobotState[]; success: boolean; failReason?: string } {
  const states: RobotState[] = [];
  let state: RobotState = {
    row: level.startPos[0],
    col: level.startPos[1],
    dir: level.startDir,
    hasKey: false,
    doorUnlocked: false,
  };
  states.push({ ...state });

  for (const cmd of commands) {
    if (cmd === "turnLeft") {
      state = { ...state, dir: TURN_LEFT[state.dir] };
      states.push({ ...state });
    } else if (cmd === "turnRight") {
      state = { ...state, dir: TURN_RIGHT[state.dir] };
      states.push({ ...state });
    } else if (cmd === "moveForward") {
      const [dr, dc] = DIR_DELTAS[state.dir];
      const nr = state.row + dr;
      const nc = state.col + dc;

      if (nr < 0 || nr >= level.grid.length || nc < 0 || nc >= level.grid[0].length) {
        return { states, success: false, failReason: "Robot hit the boundary!" };
      }

      const cell = level.grid[nr][nc] as CellType;

      if (cell === 1) return { states, success: false, failReason: "Robot hit a wall!" };
      if (cell === 2) return { states, success: false, failReason: "Robot hit a trap! ⚡" };
      if (cell === 4 && !state.hasKey) {
        return { states, success: false, failReason: "Door is locked! Collect the key first. 🔑" };
      }

      const hasKey = state.hasKey || cell === 3;
      const doorUnlocked = state.doorUnlocked || (cell === 3);

      state = { ...state, row: nr, col: nc, hasKey, doorUnlocked };
      states.push({ ...state });

      if (nr === level.goalPos[0] && nc === level.goalPos[1]) {
        return { states, success: true };
      }
    }
  }

  // Check if we reached the goal
  if (state.row === level.goalPos[0] && state.col === level.goalPos[1]) {
    return { states, success: true };
  }

  return { states, success: false, failReason: "Robot didn't reach the goal." };
}

function getStars(cmdCount: number, thresholds: [number, number, number]): number {
  if (cmdCount <= thresholds[0]) return 3;
  if (cmdCount <= thresholds[1]) return 2;
  if (cmdCount <= thresholds[2]) return 1;
  return 0;
}

const STORAGE_KEY = "aliencode_puzzle_progress";

function loadProgress(): Record<number, { stars: number; completed: boolean }> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch { return {}; }
}

function saveProgress(data: Record<number, { stars: number; completed: boolean }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function PuzzleGame() {
  const [selectedLevel, setSelectedLevel] = useState<PuzzleLevel | null>(null);
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [states, setStates] = useState<RobotState[]>([]);
  const [result, setResult] = useState<{ success: boolean; failReason?: string; stars?: number } | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(loadProgress());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetRun = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setStepIndex(0);
    setStates([]);
    setResult(null);
    setLog([]);
  }, []);

  const selectLevel = (level: PuzzleLevel) => {
    setSelectedLevel(level);
    setCode(getStarterCode(level));
    resetRun();
  };

  const getStarterCode = (level: PuzzleLevel) => {
    if (level.id === 1) return `// Guide the robot to the goal!\nmoveForward();\n`;
    if (level.id === 4) return `function goForward3() {\n  moveForward();\n  moveForward();\n  moveForward();\n}\n\ngoForward3();\n`;
    if (level.id === 6) return `repeat(3) { moveForward(); }\nturnLeft();\nrepeat(3) { moveForward(); }\n`;
    return `// Write your solution here\nmoveForward();\n`;
  };

  const handleRun = () => {
    if (!selectedLevel) return;
    resetRun();

    const commands = parseSolution(code);
    const { states: newStates, success, failReason } = executeCommands(commands, selectedLevel);

    const logLines = commands.map((c, i) => `${i + 1}. ${c}()`);
    setLog(logLines);
    setStates(newStates);
    setStepIndex(0);
    setRunning(true);

    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx++;
      setStepIndex(idx);
      if (idx >= newStates.length - 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
        const stars = success ? getStars(commands.length, selectedLevel.starThresholds) : 0;
        setResult({ success, failReason, stars });

        if (success) {
          const updated = { ...progress, [selectedLevel.id]: { stars: Math.max(progress[selectedLevel.id]?.stars || 0, stars), completed: true } };
          setProgress(updated);
          saveProgress(updated);
        }
      }
    }, 350);
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const currentRobot = states[Math.min(stepIndex, states.length - 1)];
  const displayGrid = selectedLevel?.grid;

  // ── Level Select View ──
  if (!selectedLevel) {
    return (
      <div className="relative min-h-screen pt-20 px-4 pb-12">
        <ParticleBackground />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 mb-6">
              <span className="text-cyan-400 font-orbitron text-xs tracking-widest">🧩 PUZZLE GAME</span>
            </div>
            <h1 className="font-orbitron text-3xl sm:text-4xl font-black text-white mb-3">
              CODE THE ROBOT
            </h1>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Guide the robot to the goal by writing code. Use <code className="text-cyan-400">moveForward()</code>, <code className="text-cyan-400">turnLeft()</code>, and <code className="text-cyan-400">turnRight()</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PUZZLE_LEVELS.map((level) => {
              const prog = progress[level.id];
              return (
                <button
                  key={level.id}
                  onClick={() => selectLevel(level)}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 text-left border border-cyan-500/10 transition-all hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-orbitron text-xs text-gray-500 tracking-widest">LEVEL {level.id}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map((s) => (
                        <span key={s} className={`text-sm ${prog?.stars >= s ? "text-yellow-400" : "text-gray-700"}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-orbitron text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {level.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{level.description}</p>
                  {prog?.completed && (
                    <div className="mt-3 text-xs text-green-400 font-orbitron">✓ COMPLETED</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Game View ──
  const cellSize = 46;

  return (
    <div className="relative min-h-screen pt-20 px-4 pb-12">
      <ParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedLevel(null)}
            className="cyber-button px-3 py-2 rounded-xl text-xs font-orbitron"
          >
            ← LEVELS
          </button>
          <div>
            <h2 className="font-orbitron text-lg font-bold text-white">
              Level {selectedLevel.id}: {selectedLevel.title}
            </h2>
            <p className="text-gray-500 text-xs">{selectedLevel.description}</p>
          </div>
          <div className="ml-auto flex gap-0.5">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`text-xl ${(result?.stars || 0) >= s ? "text-yellow-400" : "text-gray-700"}`}>★</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Grid */}
          <div className="flex flex-col gap-4">
            <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20">
              <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-3">MAZE</div>

              {/* Grid */}
              <div className="flex justify-center overflow-x-auto">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${displayGrid![0].length}, ${cellSize}px)`,
                    gap: "2px",
                  }}
                >
                  {displayGrid!.map((row, r) =>
                    row.map((cell, c) => {
                      const isRobot = currentRobot && currentRobot.row === r && currentRobot.col === c;
                      const isGoal = r === selectedLevel.goalPos[0] && c === selectedLevel.goalPos[1];
                      return (
                        <div
                          key={`${r}-${c}`}
                          style={{
                            width: cellSize,
                            height: cellSize,
                            background: isRobot ? "hsl(185 100% 30% / 0.6)" : CELL_COLORS[cell as CellType],
                            border: isRobot ? "2px solid hsl(185 100% 60%)" : "1px solid hsl(220 60% 20%)",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            transition: "all 0.25s",
                            boxShadow: isRobot ? "0 0 12px hsl(185 100% 50% / 0.6)" : undefined,
                          }}
                        >
                          {isRobot ? (
                            <span style={{ filter: "drop-shadow(0 0 6px cyan)", fontSize: 20 }}>
                              {DIR_EMOJI[currentRobot.dir]}
                            </span>
                          ) : cell === 1 ? "" :
                            cell === 2 ? "⚡" :
                            cell === 3 ? (currentRobot?.hasKey ? "" : "🔑") :
                            cell === 4 ? (currentRobot?.hasKey ? "🚪" : "🔒") :
                            isGoal ? "🎯" : ""}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
                {[
                  { icon: DIR_EMOJI["right"], label: "Robot" },
                  { icon: "⚡", label: "Trap" },
                  { icon: "🔑", label: "Key" },
                  { icon: "🔒", label: "Door" },
                  { icon: "🎯", label: "Goal" },
                ].map(({ icon, label }) => (
                  <span key={label} className="flex items-center gap-1">
                    {icon} {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Available commands */}
            <div className="glass-panel rounded-2xl p-4 border border-purple-500/20">
              <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-3">AVAILABLE COMMANDS</div>
              <div className="flex flex-wrap gap-2">
                {selectedLevel.availableCommands.map((cmd) => (
                  <span
                    key={cmd}
                    onClick={() => setCode((c) => c + "\n" + cmd + (cmd.includes("{") ? "" : ";"))}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs cursor-pointer hover:bg-cyan-500/20 transition-all select-none"
                  >
                    {cmd}
                  </span>
                ))}
              </div>
              {selectedLevel.tutorial && (
                <p className="text-gray-600 text-xs mt-3 leading-relaxed">💡 {selectedLevel.tutorial}</p>
              )}
            </div>

            {/* Result */}
            {result && (
              <div
                className={`glass-panel rounded-2xl p-4 border ${
                  result.success ? "border-green-500/40 bg-green-500/5" : "border-red-500/40 bg-red-500/5"
                }`}
              >
                {result.success ? (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">🎉</span>
                      <span className="font-orbitron text-sm font-bold text-green-300">MISSION COMPLETE!</span>
                      <div className="flex gap-0.5 ml-auto">
                        {[1, 2, 3].map((s) => (
                          <span key={s} className={`text-lg ${(result.stars || 0) >= s ? "text-yellow-400" : "text-gray-700"}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs">
                      Used {parseSolution(code).length} commands. 
                      {result.stars === 3 ? " Perfect solution! 🌟" : result.stars === 2 ? " Great job!" : " Try fewer commands for more stars."}
                    </p>
                    {selectedLevel.id < PUZZLE_LEVELS.length && (
                      <button
                        onClick={() => selectLevel(PUZZLE_LEVELS[selectedLevel.id])}
                        className="mt-3 cyber-button-primary cyber-button px-4 py-2 rounded-xl text-xs font-orbitron"
                      >
                        NEXT LEVEL →
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💥</span>
                      <span className="font-orbitron text-sm font-bold text-red-300">MISSION FAILED</span>
                    </div>
                    <p className="text-red-400 text-xs">{result.failReason}</p>
                    <p className="text-gray-600 text-xs mt-1">💡 Hint: {selectedLevel.hint}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Code Editor */}
          <div className="flex flex-col gap-4">
            <div className="glass-panel rounded-2xl overflow-hidden border border-cyan-500/20 flex-1 flex flex-col">
              {/* Editor header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="font-orbitron text-xs text-gray-500 ml-2">CODE EDITOR</span>
                <button
                  onClick={resetRun}
                  className="ml-auto text-gray-600 hover:text-gray-300 text-xs font-orbitron"
                  title="Reset"
                >
                  ↺ RESET
                </button>
              </div>

              {/* Textarea */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-transparent text-cyan-200 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed min-h-48"
                placeholder="// Write your solution here"
                spellCheck={false}
              />

              {/* Run button */}
              <div className="px-4 py-3 border-t border-white/5 flex items-center gap-3">
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="cyber-button-primary cyber-button px-6 py-2.5 rounded-xl font-orbitron text-xs tracking-wider disabled:opacity-40"
                >
                  {running ? "⟳ RUNNING..." : "▶ RUN CODE"}
                </button>
                <span className="text-gray-600 text-xs font-mono">
                  {parseSolution(code).length} commands
                </span>
                <span className="text-gray-600 text-xs ml-auto">
                  ★★★ ≤ {selectedLevel.starThresholds[0]} cmds
                </span>
              </div>
            </div>

            {/* Log */}
            {log.length > 0 && (
              <div className="glass-panel rounded-2xl p-4 border border-cyan-500/10">
                <div className="font-orbitron text-xs text-gray-500 tracking-widest mb-3">EXECUTION LOG</div>
                <div className="space-y-1 max-h-40 overflow-y-auto font-mono text-xs">
                  {log.map((line, i) => (
                    <div
                      key={i}
                      className={`px-2 py-1 rounded transition-all ${
                        i < stepIndex ? "text-green-400" : "text-gray-600"
                      }`}
                    >
                      {i < stepIndex ? "✓" : "○"} {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
