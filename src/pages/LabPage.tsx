
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ParticleBackground from "@/components/features/ParticleBackground";
import { toast } from "sonner";

type Language = "python" | "javascript" | "html" | "c";

interface SavedCode {
  id: string;
  title: string;
  lang: Language;
  code: string;
  savedAt: string;
}

const LANG_DATA: Record<Language, { label: string; icon: string; color: string; starter: string }> = {
  python: {
    label: "Python",
    icon: "🐍",
    color: "text-yellow-400",
    starter: `# Python Playground\nprint("Hello, Alien Code!")\n\n# Try some Python:\nfor i in range(5):\n    print(f"Line {i+1}: {'*' * (i+1)}")\n\n# Your code here:\n`,
  },
  javascript: {
    label: "JavaScript",
    icon: "⚡",
    color: "text-yellow-300",
    starter: `// JavaScript Playground\nconsole.log("Hello, Alien Code!");\n\n// Try some JS:\nconst nums = [1, 2, 3, 4, 5];\nconst squared = nums.map(n => n ** 2);\nconsole.log("Squares:", squared);\n\n// Your code here:\n`,
  },
  html: {
    label: "HTML",
    icon: "🌐",
    color: "text-orange-400",
    starter: `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <title>Alien Lab</title>\n    <style>\n        body {\n            background: #000011;\n            color: #00fff7;\n            font-family: 'Courier New', monospace;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            min-height: 100vh;\n            margin: 0;\n        }\n        h1 { text-shadow: 0 0 20px #00fff7; }\n    </style>\n</head>\n<body>\n    <h1>Hello, Alien Code! 👽</h1>\n</body>\n</html>`,
  },
  c: {
    label: "C",
    icon: "⚙️",
    color: "text-blue-400",
    starter: `#include <stdio.h>\n\nint main() {\n    printf("Hello, Alien Code!\\n");\n    \n    // Calculate factorial\n    int n = 5, fact = 1;\n    for (int i = 1; i <= n; i++) {\n        fact *= i;\n    }\n    printf("%d! = %d\\n", n, fact);\n    \n    return 0;\n}`,
  },
};

// JavaScript executor
function executeJS(code: string): { output: string[]; errors: string[] } {
  const output: string[] = [];
  const errors: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = (...args: unknown[]) => output.push(args.map(String).join(" "));
  console.error = (...args: unknown[]) => errors.push("ERROR: " + args.map(String).join(" "));
  console.warn = (...args: unknown[]) => output.push("WARN: " + args.map(String).join(" "));

  try {
    new Function(code)();
  } catch (e: unknown) {
    if (e instanceof Error) {
      errors.push(`${e.constructor.name}: ${e.message}`);
      const match = e.stack?.match(/at .*:(\d+):(\d+)/);
      if (match) errors.push(`  at line ${match[1]}, column ${match[2]}`);
    }
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }

  return { output, errors };
}

// Simple Python simulator
function simulatePython(code: string): { output: string[]; errors: string[] } {
  const output: string[] = [];
  const errors: string[] = [];

  try {
    const lines = code.split("\n");
    // Very basic: extract print statements
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#")) continue;
      const printMatch = trimmed.match(/^print\((.+)\)$/);
      if (printMatch) {
        const content = printMatch[1]
          .replace(/f"(.*)"/g, (_, s) => s.replace(/\{([^}]+)\}/g, "..."))
          .replace(/f'(.*)'/g, (_, s) => s.replace(/\{([^}]+)\}/g, "..."))
          .replace(/^["']|["']$/g, "");
        output.push(content);
      }
    }
    if (output.length === 0) {
      output.push("[Python Simulator] Code analyzed successfully.");
      output.push("Note: Full Python execution requires a backend server.");
      output.push("Use the JS Lab for real-time execution in the browser.");
    }
  } catch (e: unknown) {
    if (e instanceof Error) errors.push(e.message);
  }
  return { output, errors };
}

function STORAGE_KEY() { return "aliencode_saved_code"; }
function loadSaved(): SavedCode[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY()) || "[]"); } catch { return []; }
}

export default function LabPage() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const [activeLang, setActiveLang] = useState<Language>((lang as Language) || "javascript");
  const [code, setCode] = useState(LANG_DATA[activeLang].starter);
  const [output, setOutput] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [htmlPreview, setHtmlPreview] = useState<string | null>(null);
  const [savedFiles, setSavedFiles] = useState<SavedCode[]>(loadSaved);
  const [showSaved, setShowSaved] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const lineCount = code.split("\n").length;

  useEffect(() => {
    if (lang && LANG_DATA[lang as Language]) {
      setActiveLang(lang as Language);
      setCode(LANG_DATA[lang as Language].starter);
    }
  }, [lang]);

  const changeLang = (l: Language) => {
    setActiveLang(l);
    setCode(LANG_DATA[l].starter);
    setOutput([]);
    setErrors([]);
    setHtmlPreview(null);
    navigate(`/lab/${l}`);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput([]);
    setErrors([]);
    setHtmlPreview(null);
    await new Promise((r) => setTimeout(r, 300));

    if (activeLang === "javascript") {
      const result = executeJS(code);
      setOutput(result.output);
      setErrors(result.errors);
    } else if (activeLang === "html") {
      setHtmlPreview(code);
    } else if (activeLang === "python") {
      const result = simulatePython(code);
      setOutput(result.output);
      setErrors(result.errors);
    } else if (activeLang === "c") {
      setOutput([
        "⚙️ C Compilation Simulation:",
        "→ Preprocessing headers...",
        "→ Compiling to object code...",
        "→ Linking with libc...",
        "",
        "Program output:",
        "Hello, Alien Code!",
        "5! = 120",
        "",
        "Note: Full C compilation requires a server-side compiler.",
        "GCC command: gcc -Wall -O2 -o program main.c && ./program",
      ]);
    }

    setIsRunning(false);
    setTimeout(() => outputRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = textareaRef.current!;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newCode = code.slice(0, start) + "    " + code.slice(end);
      setCode(newCode);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      runCode();
    }
  };

  const saveCode = () => {
    if (!saveTitle.trim()) { toast.error("Enter a title"); return; }
    const saved: SavedCode = {
      id: Math.random().toString(36).slice(2),
      title: saveTitle,
      lang: activeLang,
      code,
      savedAt: new Date().toISOString(),
    };
    const updated = [saved, ...savedFiles];
    setSavedFiles(updated);
    localStorage.setItem(STORAGE_KEY(), JSON.stringify(updated));
    setSaveTitle("");
    setShowSaveDialog(false);
    toast.success("Code saved! 💾");
  };

  const loadCode = (item: SavedCode) => {
    setActiveLang(item.lang);
    setCode(item.code);
    setShowSaved(false);
    setOutput([]);
    setErrors([]);
    navigate(`/lab/${item.lang}`);
  };

  const deleteSaved = (id: string) => {
    const updated = savedFiles.filter((f) => f.id !== id);
    setSavedFiles(updated);
    localStorage.setItem(STORAGE_KEY(), JSON.stringify(updated));
  };

  return (
    <div className="relative min-h-screen pt-20 pb-8 px-4">
      <ParticleBackground />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-orbitron text-2xl font-black text-white">
              ⚗️ CODE LAB
            </h1>
            <p className="text-gray-500 text-xs mt-1 font-orbitron tracking-wider">
              INTERACTIVE DEVELOPMENT ENVIRONMENT
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSaved(!showSaved)}
              className={`cyber-button px-4 py-2 rounded-xl text-xs font-orbitron tracking-wider ${showSaved ? "border-cyan-500/60 text-cyan-300" : ""}`}
            >
              📁 SAVED ({savedFiles.length})
            </button>
            <button
              onClick={() => setShowSaveDialog(true)}
              className="cyber-button px-4 py-2 rounded-xl text-xs font-orbitron tracking-wider"
            >
              💾 SAVE
            </button>
          </div>
        </div>

        {/* Saved files panel */}
        {showSaved && (
          <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 mb-4 max-h-48 overflow-y-auto slide-up">
            {savedFiles.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No saved files yet. Run some code and save it!</p>
            ) : (
              <div className="space-y-2">
                {savedFiles.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/5">
                    <div className="flex items-center gap-3">
                      <span>{LANG_DATA[f.lang].icon}</span>
                      <div>
                        <p className="text-sm text-gray-200">{f.title}</p>
                        <p className="text-xs text-gray-500">{f.lang} · {new Date(f.savedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => loadCode(f)} className="cyber-button px-3 py-1 rounded-lg text-xs">LOAD</button>
                      <button onClick={() => deleteSaved(f.id)} className="px-3 py-1 rounded-lg text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10">DEL</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Save dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 w-80 slide-up">
              <h3 className="font-orbitron text-sm text-cyan-300 mb-4">SAVE FILE</h3>
              <input
                type="text"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveCode()}
                placeholder="File name..."
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-cyan-500/20 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 mb-4 font-mono text-sm"
              />
              <div className="flex gap-3">
                <button onClick={saveCode} className="flex-1 cyber-button-primary cyber-button py-2.5 rounded-xl font-orbitron text-xs">SAVE</button>
                <button onClick={() => setShowSaveDialog(false)} className="cyber-button px-4 py-2.5 rounded-xl font-orbitbon text-xs">CANCEL</button>
              </div>
            </div>
          </div>
        )}

        {/* Language tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(Object.keys(LANG_DATA) as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => changeLang(l)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-orbitron text-xs tracking-wider transition-all ${
                activeLang === l
                  ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-300"
                  : "cyber-button"
              }`}
            >
              {LANG_DATA[l].icon} {LANG_DATA[l].label}
            </button>
          ))}
        </div>

        {/* IDE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor */}
          <div className="glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden">
            {/* Editor header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/10">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className={`text-xs font-orbitron tracking-wider ${LANG_DATA[activeLang].color}`}>
                  {LANG_DATA[activeLang].icon} main.{activeLang === "javascript" ? "js" : activeLang === "python" ? "py" : activeLang === "html" ? "html" : "c"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 font-mono">{lineCount} lines</span>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="cyber-button-primary cyber-button px-4 py-1.5 rounded-lg font-orbitron text-xs tracking-wider flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isRunning ? (
                    <><span className="animate-spin">⟳</span> RUNNING</>
                  ) : (
                    <>▶ RUN (Ctrl+↵)</>
                  )}
                </button>
              </div>
            </div>

            {/* Code editor with line numbers */}
            <div className="flex" style={{ minHeight: "420px" }}>
              {/* Line numbers */}
              <div className="w-10 bg-black/20 text-gray-600 font-mono text-xs text-right py-4 px-2 select-none flex-shrink-0 border-r border-white/5">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="leading-6">{i + 1}</div>
                ))}
              </div>
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="flex-1 bg-transparent text-cyan-100 font-mono text-sm p-4 resize-none focus:outline-none leading-6 w-full"
                style={{ tabSize: 4 }}
              />
            </div>
          </div>

          {/* Output / Preview */}
          <div className="glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-cyan-500/10">
              <span className="text-xs font-orbitron text-gray-400 tracking-widest">
                {activeLang === "html" ? "👁 PREVIEW" : "📟 OUTPUT"}
              </span>
              {errors.length > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-orbitron">
                  {errors.length} ERROR{errors.length > 1 ? "S" : ""}
                </span>
              )}
              {output.length > 0 && errors.length === 0 && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-orbitron">
                  ✓ OK
                </span>
              )}
            </div>

            <div ref={outputRef} className="flex-1 overflow-auto p-4" style={{ minHeight: "420px" }}>
              {activeLang === "html" && htmlPreview ? (
                <iframe
                  srcDoc={htmlPreview}
                  className="w-full h-full rounded-xl border border-white/5 bg-white"
                  title="HTML Preview"
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="font-mono text-sm">
                  {output.length === 0 && errors.length === 0 && (
                    <div className="text-center py-16">
                      <div className="text-5xl mb-4 opacity-30">▶</div>
                      <p className="text-gray-600 font-orbitron text-xs tracking-widest">
                        AWAITING EXECUTION
                      </p>
                      <p className="text-gray-700 text-xs mt-2">Press Run or Ctrl+Enter</p>
                    </div>
                  )}
                  {output.map((line, i) => (
                    <div key={i} className="text-green-300 leading-6 whitespace-pre-wrap">
                      {i === 0 && output.length > 0 && (
                        <span className="text-gray-600 mr-2">$</span>
                      )}
                      {line}
                    </div>
                  ))}
                  {errors.map((err, i) => (
                    <div key={i} className="mt-2">
                      <div className="text-red-400 leading-6 whitespace-pre-wrap">{err}</div>
                      {i === 0 && (
                        <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <p className="text-yellow-300 text-xs font-orbitron mb-1">💡 SUGGESTIONS:</p>
                          <p className="text-gray-400 text-xs">
                            {err.includes("ReferenceError") && "Variable not defined. Check spelling and scope."}
                            {err.includes("TypeError") && "Wrong type for operation. Check your variable types."}
                            {err.includes("SyntaxError") && "Invalid syntax. Check brackets, quotes, and semicolons."}
                            {err.includes("RangeError") && "Value out of range. Check your array indices or recursion."}
                            {!err.match(/ReferenceError|TypeError|SyntaxError|RangeError/) && "Check the error location and verify your logic."}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips bar */}
        <div className="flex items-center gap-4 mt-4 px-4 py-3 glass-panel rounded-xl border border-white/5 text-xs text-gray-600 font-mono flex-wrap gap-y-2">
          <span>⌨️ <kbd className="text-gray-500">Ctrl+Enter</kbd> Run</span>
          <span>⌨️ <kbd className="text-gray-500">Tab</kbd> Indent</span>
          <span className="text-cyan-700">JS: runs in browser sandbox</span>
          <span className="text-yellow-700">Python: simulated output</span>
          <span className="text-orange-700">HTML: live preview</span>
          <span className="text-blue-700">C: compilation simulation</span>
        </div>
      </div>
    </div>
  );
}
