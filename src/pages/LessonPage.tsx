import { useParams, useNavigate, Link } from "react-router-dom";
import { COURSES } from "@/constants/courses";
import LessonViewer from "@/components/features/LessonViewer";
import ParticleBackground from "@/components/features/ParticleBackground";
import { useProgress } from "@/hooks/useProgress";

export default function LessonPage() {
  const { lang, lessonId } = useParams();
  const navigate = useNavigate();
  const { markLessonComplete, recordQuizScore, isLessonComplete, getCourseProgress } = useProgress();

  const course = COURSES.find((c) => c.id === lang);
  const lesson = course?.lessons.find((l) => l.id === Number(lessonId));

  if (!course || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">👽</div>
          <h2 className="font-orbitron text-xl text-red-400 mb-4">LESSON NOT FOUND</h2>
          <Link to="/courses" className="cyber-button px-6 py-3 rounded-xl font-orbitron text-sm">
            BACK TO COURSES
          </Link>
        </div>
      </div>
    );
  }

  const progress = getCourseProgress(course.id, course.totalLessons);

  return (
    <div className="relative min-h-screen pt-20 pb-8 px-4">
      <ParticleBackground />

      <div className="relative z-10 max-w-6xl mx-auto flex gap-6 h-full">
        {/* Sidebar — lesson list */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="glass-panel rounded-2xl p-4 border border-cyan-500/10 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
            {/* Course info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
              <span className="text-2xl">{course.icon}</span>
              <div>
                <h3 className="font-orbitron text-sm font-bold text-white">{course.language}</h3>
                <p className="text-xs text-gray-500">{progress}% complete</p>
              </div>
            </div>
            <div className="progress-bar mb-4">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Lesson list */}
            <div className="space-y-1">
              {course.lessons.map((l) => {
                const done = isLessonComplete(course.id, l.id);
                const isCurrent = l.id === lesson.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => navigate(`/lesson/${course.id}/${l.id}`)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 text-xs transition-all ${
                      isCurrent
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : done
                        ? "text-green-400/70 hover:bg-white/5"
                        : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      done ? "bg-green-500/20 text-green-400" : isCurrent ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5"
                    }`}>
                      {done ? "✓" : l.id}
                    </span>
                    <span className="truncate">{l.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-5rem)]">
          {/* Mobile breadcrumb */}
          <div className="flex items-center gap-2 mb-4 lg:hidden">
            <Link to={`/courses/${course.id}`} className="cyber-button px-3 py-1.5 rounded-lg text-xs font-orbitron">
              ← {course.language}
            </Link>
            <span className="text-gray-600 text-xs font-orbitron">
              {lesson.id}/{course.totalLessons}
            </span>
          </div>

          <LessonViewer
            lesson={lesson}
            courseId={course.id}
            totalLessons={course.totalLessons}
            isCompleted={isLessonComplete(course.id, lesson.id)}
            onComplete={() => markLessonComplete(course.id, lesson.id)}
            onRecordQuiz={(correct) => recordQuizScore(course.id, lesson.id, correct)}
          />
        </main>
      </div>
    </div>
  );
}
