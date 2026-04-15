import { Link } from "react-router-dom";
import { Course } from "@/types";

interface Props {
  course: Course;
  progress: number;
  lastLesson?: number;
}

export default function CourseCard({ course, progress, lastLesson = 1 }: Props) {
  const langColors: Record<string, string> = {
    python: "from-yellow-500/20 to-orange-500/10 border-yellow-500/30",
    javascript: "from-yellow-400/20 to-yellow-600/10 border-yellow-400/30",
    html: "from-orange-500/20 to-red-500/10 border-orange-500/30",
    c: "from-blue-400/20 to-cyan-500/10 border-blue-400/30",
  };

  const glowColors: Record<string, string> = {
    python: "hsl(45 100% 55%)",
    javascript: "hsl(50 100% 60%)",
    html: "hsl(20 100% 60%)",
    c: "hsl(200 80% 60%)",
  };

  return (
    <div
      className={`glass-panel glass-panel-hover rounded-2xl p-6 border bg-gradient-to-br ${langColors[course.id] || ""} transition-all duration-300 group hover:scale-[1.02] hover:-translate-y-1`}
      style={{
        boxShadow: `0 0 0 rgba(0,0,0,0), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${glowColors[course.id]}22, 0 0 60px ${glowColors[course.id]}11`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{course.icon}</div>
        <div className="text-right">
          <div className="text-xs font-orbitron text-gray-500 tracking-widest">{course.totalLessons} LESSONS</div>
          {progress > 0 && (
            <div className="text-xs font-orbitron mt-1" style={{ color: glowColors[course.id] }}>
              {progress}% COMPLETE
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-orbitron font-bold text-lg text-white mb-1 group-hover:text-cyan-300 transition-colors">
        {course.language}
      </h3>
      <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">{course.description}</p>

      {/* Progress bar */}
      <div className="progress-bar mb-4">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Link
          to={`/lesson/${course.id}/${progress > 0 ? lastLesson : 1}`}
          className="flex-1 cyber-button-primary cyber-button px-4 py-2.5 rounded-xl text-center"
        >
          {progress === 0 ? "START" : progress === 100 ? "REVIEW" : "CONTINUE"}
        </Link>
        <Link
          to={`/courses/${course.id}`}
          className="cyber-button px-4 py-2.5 rounded-xl text-center"
        >
          SYLLABUS
        </Link>
      </div>
    </div>
  );
}
