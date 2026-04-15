
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Lesson } from "@/types";

interface Props {
  lesson: Lesson;
  courseId: string;
  totalLessons: number;
  isCompleted: boolean;
  onComplete: () => void;
  onRecordQuiz: (correct: boolean) => void;
}

// Strip HTML tags for TTS
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Text-to-Speech Assistant ───
function TTSAssistant({ text, lessonTitle }: { text: string; lessonTitle: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [rate, setRate] = useState(1.0);
  const [showPanel, setShowPanel] = useState(false);
  const [progress, setProgress] = useState(0);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const v = speechSynthesis.getVoices().filter(
        (voice) => voice.lang.startsWith("en")
      );
      setVoices(v);
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => { speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Stop when lesson changes
  useEffect(() => {
    stop();
    setProgress(0);
  }, [lessonTitle]); // Removed eslint-disable-next-line as the dependency is correct now

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    utterRef.current = null;
  }, []);

  const speak = useCallback(() => {
    stop();
    const fullText = `Lesson: ${lessonTitle}. ${stripHtml(text)}`;
    const utter = new SpeechSynthesisUtterance(fullText);
    utter.rate = rate;
    utter.pitch = 1;
    if (voices[selectedVoice]) utter.voice = voices[selectedVoice];

    let charIndex = 0;
    utter.onboundary = (e) => {
      charIndex = e.charIndex;
      setProgress(Math.round((charIndex / fullText.length) * 100));
    };

    utter.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    utter.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterRef.current = utter;
    speechSynthesis.speak(utter);
    setIsPlaying(true);
    setIsPaused(false);
  }, [text, lessonTitle, rate, voices, selectedVoice, stop]);

  const pause = useCallback(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  }, []);

  const isSpeechSupported = "speechSynthesis" in window;
  if (!isSpeechSupported) return null;

  return (
    <div className="relative">
      {/* TTS toggle button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-orbitron tracking-wider transition-all ${
          isPlaying
            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 glow-box"
            : isPaused
            ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-300"
            : "cyber-button"
        }`}
        title="Text-to-Speech: Listen to this lesson"
      >
        <span className="text-base">{isPlaying ? "🔊" : isPaused ? "⏸" : "🎙️"}</span>
        <span className="hidden sm:inline">LISTEN</span>
        {(isPlaying || isPaused) && (
          <span className="font-mono text-xs opacity-70">{progress}%</span>
        )}
      </button>

      {/* TTS panel */}
      {showPanel && (
        <div
          className="absolute right-0 top-full mt-2 w-72 glass-panel rounded-2xl p-4 border border-cyan-500/20 z-50 slide-up shadow-2xl"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🎙️</span>
            <div>
              <p className="font-orbitron text-xs font-bold text-cyan-300 tracking-wider">LESSON READER</p>
              <p className="text-gray-600 text-xs">Text-to-Speech Assistant</p>
            </div>
            <button
              onClick={() => setShowPanel(false)}
              className="ml-auto text-gray-600 hover:text-gray-300 text-xs"
            >
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div className="progress-bar mb-4">
            <div
              className="progress-fill transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Play / Pause / Resume */}
            {!isPlaying && !isPaused ? (
              <button
                onClick={speak}
                className="cyber-button-primary cyber-button w-12 h-12 rounded-full flex items-center justify-center text-xl"
                title="Start reading"
              >
                ▶
              </button>
            ) : isPlaying ? (
              <button
                onClick={pause}
                className="cyber-button w-12 h-12 rounded-full flex items-center justify-center text-xl border-yellow-500/40 text-yellow-300"
                title="Pause"
              >
                ⏸
              </button>
            ) : (
              <button
                onClick={resume}
                className="cyber-button w-12 h-12 rounded-full flex items-center justify-center text-xl border-green-500/40 text-green-300"
                title="Resume"
              >
                ▶
              </button>
            )}
            <button
              onClick={stop}
              className="cyber-button w-10 h-10 rounded-xl flex items-center justify-center text-base border-red-500/30 text-red-400 hover:border-red-400"
              title="Stop"
            >
              ⏹
            </button>
          </div>

          {/* Speed */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500 font-orbitron">SPEED</span>
              <span className="text-xs text-cyan-400 font-mono">{rate.toFixed(1)}×</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-0.5">
              <span>0.5×</span>
              <span>1×</span>
              <span>2×</span>
            </div>
          </div>

          {/* Voice selector */}
          {voices.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 font-orbitron mb-1.5">VOICE</p>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(Number(e.target.value))}
                className="w-full bg-white/5 border border-cyan-500/20 text-gray-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500/50"
              >
                {voices.map((v, i) => (
                  <option key={i} value={i} className="bg-gray-900">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <p className="text-gray-700 text-xs text-center mt-3">
            Uses your browser's built-in TTS engine
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main LessonViewer ───
export default function LessonViewer({
  lesson,
  courseId,
  totalLessons,
  isCompleted,
  onComplete,
  onRecordQuiz,
}: Props) {
  const navigate = useNavigate();
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [tab, setTab] = useState<"lesson" | "code">("lesson");

  useEffect(() => {
    setQuizAnswered(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTab("lesson");
    // Stop speech when switching lessons
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }, [lesson.id]);

  const handleAnswer = (index: number) => {
    if (quizAnswered) return;
    setSelectedAnswer(index);
    setQuizAnswered(true);
    setShowExplanation(true);
    const correct = index === lesson.quiz.correct;
    onRecordQuiz(correct);
    if (correct) onComplete();
  };

  const getAnswerStyle = (i: number) => {
    if (!quizAnswered) return "cyber-button hover:border-cyan-500/70 hover:text-cyan-200";
    if (i === lesson.quiz.correct) return "border-green-500 bg-green-500/20 text-green-300";
    if (i === selectedAnswer && i !== lesson.quiz.correct) return "border-red-500 bg-red-500/20 text-red-300";
    return "border-gray-700 text-gray-500";
  };

  // Text for TTS: combine lesson content
  const ttsText = lesson.content + (lesson.codeExample ? ` Code example: ${lesson.codeExample}` : "");

  return (
    <div className="flex flex-col h-full">
      {/* Lesson header */}
      <div className="glass-panel rounded-2xl p-5 mb-4 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <span className="text-xs font-orbitron text-gray-500 tracking-widest">
            LESSON {lesson.id} / {totalLessons}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">{lesson.duration}</span>
            {isCompleted && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-orbitron">
                ✓ DONE
              </span>
            )}
            {/* TTS Assistant */}
            <TTSAssistant text={ttsText} lessonTitle={lesson.title} />
          </div>
        </div>
        <h2 className="font-orbitron text-xl font-bold text-white">{lesson.title}</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("lesson")}
          className={`flex-1 py-2 rounded-xl font-orbitron text-xs tracking-widest transition-all ${
            tab === "lesson"
              ? "tab-active bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
              : "cyber-button rounded-xl"
          }`}
        >
          📖 CONTENT
        </button>
        {lesson.codeExample && (
          <button
            onClick={() => setTab("code")}
            className={`flex-1 py-2 rounded-xl font-orbitron text-xs tracking-widest transition-all ${
              tab === "code"
                ? "tab-active bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
                : "cyber-button rounded-xl"
            }`}
          >
            💻 CODE
          </button>
        )}
      </div>

      {/* Content */}
      <div className="glass-panel rounded-2xl p-6 mb-4 border border-cyan-500/10 flex-1 overflow-y-auto">
        {tab === "lesson" ? (
          <div
            className="prose-lesson text-gray-300 leading-relaxed"
            style={{ fontSize: "0.95rem", lineHeight: "1.8" }}
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        ) : (
          <div className="code-block rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm text-cyan-200 font-mono whitespace-pre leading-relaxed">
              <code>{lesson.codeExample}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Quiz */}
      <div className="glass-panel rounded-2xl p-5 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-purple-400">🧠</span>
          <span className="font-orbitron text-sm text-purple-300 tracking-widest">QUIZ</span>
        </div>
        <p className="text-gray-200 mb-4 text-sm leading-relaxed">{lesson.quiz.question}</p>

        <div className="space-y-2">
          {lesson.quiz.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${getAnswerStyle(i)}`}
            >
              <span className="font-mono text-gray-500 mr-3">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div
            className={`mt-4 p-4 rounded-xl border text-sm leading-relaxed ${
              selectedAnswer === lesson.quiz.correct
                ? "bg-green-500/10 border-green-500/30 text-green-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            <span className="font-bold mr-2">
              {selectedAnswer === lesson.quiz.correct ? "✓ Correct!" : "✗ Not quite."}
            </span>
            {lesson.quiz.explanation}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-4">
          {lesson.id > 1 && (
            <button
              onClick={() => navigate(`/lesson/${courseId}/${lesson.id - 1}`)}
              className="cyber-button px-4 py-2.5 rounded-xl text-xs"
            >
              ← PREV
            </button>
          )}
          {lesson.id < totalLessons && (
            <button
              onClick={() => navigate(`/lesson/${courseId}/${lesson.id + 1}`)}
              className="flex-1 cyber-button-primary cyber-button px-4 py-2.5 rounded-xl text-xs"
            >
              NEXT LESSON →
            </button>
          )}
          {lesson.id === totalLessons && (
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="flex-1 cyber-button-primary cyber-button px-4 py-2.5 rounded-xl text-xs"
            >
              🎉 FINISH COURSE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
