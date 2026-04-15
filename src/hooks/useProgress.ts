import { useState } from "react";
import { UserProgress } from "@/types";

const STORAGE_KEY = "aliencode_progress";

function loadProgress(): UserProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  const markLessonComplete = (courseId: string, lessonId: number) => {
    setProgress((prev) => {
      const course = prev[courseId] || { completedLessons: [], quizScores: {}, lastLesson: 0 };
      if (course.completedLessons.includes(lessonId)) return prev;
      const updated = {
        ...prev,
        [courseId]: {
          ...course,
          completedLessons: [...course.completedLessons, lessonId],
          lastLesson: lessonId,
        },
      };
      saveProgress(updated);
      return updated;
    });
  };

  const recordQuizScore = (courseId: string, lessonId: number, correct: boolean) => {
    setProgress((prev) => {
      const course = prev[courseId] || { completedLessons: [], quizScores: {}, lastLesson: 0 };
      const updated = {
        ...prev,
        [courseId]: {
          ...course,
          quizScores: { ...course.quizScores, [lessonId]: correct },
        },
      };
      saveProgress(updated);
      return updated;
    });
  };

  const getCourseProgress = (courseId: string, totalLessons: number) => {
    const course = progress[courseId];
    if (!course) return 0;
    return Math.round((course.completedLessons.length / totalLessons) * 100);
  };

  const isLessonComplete = (courseId: string, lessonId: number) => {
    return progress[courseId]?.completedLessons.includes(lessonId) ?? false;
  };

  const getLastLesson = (courseId: string) => {
    return progress[courseId]?.lastLesson ?? 1;
  };

  return { progress, markLessonComplete, recordQuizScore, getCourseProgress, isLessonComplete, getLastLesson };
}
