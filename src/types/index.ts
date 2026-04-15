export interface User {
  id: string;
  username: string;
  email?: string;
  isGuest: boolean;
  avatar?: string;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  codeExample?: string;
  quiz: Quiz;
  duration: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Course {
  id: string;
  language: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  totalLessons: number;
  lessons: Lesson[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  [courseId: string]: {
    completedLessons: number[];
    quizScores: { [lessonId: number]: boolean };
    lastLesson: number;
  };
}

export interface SavedCode {
  id: string;
  lang: string;
  title: string;
  code: string;
  savedAt: Date;
}
