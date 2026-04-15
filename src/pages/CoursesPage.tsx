import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { COURSES } from "@/constants/courses";
import CourseCard from "@/components/features/CourseCard";
import ParticleBackground from "@/components/features/ParticleBackground";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";

export default function CoursesPage() {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { getCourseProgress, getLastLesson, isLessonComplete } = useProgress();
  const { user } = useAuth();

  const selectedCourse = lang ? COURSES.find((c) => c.id === lang) : null;

  if (selectedCourse) {
    // Show course syllabus
    const progress = getCourseProgress(selectedCourse.id, selectedCourse.totalLessons);

    return (
      <div className="relative min-h-screen pt-24 pb-20 px-4">
        <ParticleBackground />
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate("/courses")}
            className="cyber-button px-4 py-2 rounded-xl text-xs font-orbitron tracking-wider mb-6 flex items-center gap-2"
          >
            ← BACK TO COURSES
          </button>

          {/* Course header */}
          <div className="glass-panel rounded-3xl p-8 border border-cyan-500/20 mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-6xl">{selectedCourse.icon}</div>
              <div>
                <h1 className="font-orbitron text-3xl font-black text-white mb-2">{selectedCourse.title}</h1>
                <p className="text-gray-400 leading-relaxed">{selectedCourse.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-orbitron text-gray-500">{selectedCourse.totalLessons} LESSONS</span>
              <span className="text-xs font-orbitron text-cyan-400">{progress}% COMPLETE</span>
            </div>
            <div className="progress-bar mb-4">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <Link
              to={`/lesson/${selectedCourse.id}/${getLastLesson(selectedCourse.id)}`}
              className="cyber-button-primary cyber-button px-8 py-3 rounded-xl font-orbitron text-sm tracking-wider inline-block"
            >
              {progress === 0 ? "START COURSE" : "CONTINUE"}
            </Link>
          </div>

          {/* Lessons list */}
          <div className="space-y-2">
            <h2 className="font-orbitron text-lg text-gray-400 tracking-widest mb-4">CURRICULUM</h2>
            {selectedCourse.lessons.map((lesson) => {
              const done = isLessonComplete(selectedCourse.id, lesson.id);
              return (
                <Link
                  key={lesson.id}
                  to={`/lesson/${selectedCourse.id}/${lesson.id}`}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${
                    done
                      ? "border-green-500/20 bg-green-500/5"
                      : "glass-panel glass-panel-hover border-white/5"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono ${
                    done ? "bg-green-500/20 text-green-400" : "bg-white/5 text-gray-500"
                  }`}>
                    {done ? "✓" : lesson.id}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${done ? "text-green-300" : "text-gray-200"}`}>
                      {lesson.title}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600">{lesson.duration}</span>
                  <span className="text-gray-600">›</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Course list
  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4">
      <ParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 glass-panel rounded-full border border-cyan-500/20">
            <span className="text-xs font-orbitron text-cyan-400 tracking-widest">MISSION SELECT</span>
          </div>
          <h1 className="font-orbitron text-4xl font-black text-white mb-3">
            CHOOSE YOUR PATH
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Four languages. 144+ lessons. One goal: transform you from a beginner into a professional coder.
          </p>
        </div>

        {/* If not logged in */}
        {!user && (
          <div className="glass-panel rounded-2xl p-5 border border-yellow-500/20 mb-8 flex items-center gap-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <p className="text-yellow-300 font-semibold text-sm">Guest Mode Active</p>
              <p className="text-gray-400 text-xs mt-0.5">
                Your progress won't be saved.{" "}
                <Link to="/auth" className="text-cyan-400 hover:underline">Sign in</Link>{" "}
                to track your learning journey.
              </p>
            </div>
          </div>
        )}

        {/* Course cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {COURSES.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              progress={getCourseProgress(course.id, course.totalLessons)}
              lastLesson={getLastLesson(course.id)}
            />
          ))}
        </div>

        {/* Quick access tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/lab"
            className="glass-panel glass-panel-hover rounded-2xl p-6 border border-cyan-500/10 flex items-center gap-4 group transition-all hover:scale-[1.02]"
          >
            <div className="text-4xl">⚗️</div>
            <div>
              <h3 className="font-orbitron text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                CODE LAB
              </h3>
              <p className="text-gray-500 text-xs mt-1">Python, JS, HTML, C — live execution</p>
            </div>
            <span className="ml-auto text-gray-600 group-hover:text-cyan-400 transition-colors">→</span>
          </Link>
          <Link
            to="/pitimes"
            className="glass-panel glass-panel-hover rounded-2xl p-6 border border-purple-500/10 flex items-center gap-4 group transition-all hover:scale-[1.02]"
          >
            <div className="text-4xl">🤖</div>
            <div>
              <h3 className="font-orbitron text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                ΠTimes AI
              </h3>
              <p className="text-gray-500 text-xs mt-1">Your hyper-intelligent AI tutor</p>
            </div>
            <span className="ml-auto text-gray-600 group-hover:text-purple-400 transition-colors">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
