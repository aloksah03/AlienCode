import { Course } from "@/types";
import { pythonLessons } from "./pythonCourse";
import { jsLessons } from "./jsCourse";
import { htmlLessons } from "./htmlCourse";
import { cLessons } from "./cCourse";

export const COURSES: Course[] = [
  {
    id: "python",
    language: "Python",
    title: "Complete Python Mastery",
    description: "From beginner to AI developer. Master Python's syntax, OOP, data science, web development, and machine learning.",
    icon: "🐍",
    color: "hsl(45 100% 55%)",
    gradient: "from-yellow-500 to-orange-500",
    totalLessons: pythonLessons.length,
    lessons: pythonLessons,
  },
  {
    id: "javascript",
    language: "JavaScript",
    title: "Complete JavaScript Mastery",
    description: "Master the language of the web — from vanilla JS to React, Node.js, and modern ES2024 features.",
    icon: "⚡",
    color: "hsl(50 100% 55%)",
    gradient: "from-yellow-400 to-yellow-600",
    totalLessons: jsLessons.length,
    lessons: jsLessons,
  },
  {
    id: "html",
    language: "HTML",
    title: "Complete HTML Mastery",
    description: "Build the web's foundation. Learn semantic HTML5, accessibility, forms, APIs, and performance optimization.",
    icon: "🌐",
    color: "hsl(20 100% 55%)",
    gradient: "from-orange-500 to-red-500",
    totalLessons: htmlLessons.length,
    lessons: htmlLessons,
  },
  {
    id: "c",
    language: "C",
    title: "Complete C Mastery",
    description: "The language of systems. Pointers, memory, OS development, data structures, and low-level programming.",
    icon: "⚙️",
    color: "hsl(200 80% 55%)",
    gradient: "from-blue-400 to-cyan-500",
    totalLessons: cLessons.length,
    lessons: cLessons,
  },
];

export const MUSIC_TRACKS = [
  { id: "1", title: "Let the World Burn", artist: "Instrumental", youtubeId: "CqnU_sJ8V-E" },
  { id: "2", title: "Lunar Diamante", artist: "Instrumental", youtubeId: "a5uQMwRMHcs" },
  { id: "3", title: "Six Days", artist: "Instrumental", youtubeId: "1JqH_TaGuCM" },
  { id: "4", title: "Timeless", artist: "Instrumental", youtubeId: "SBjQ9tuuTJQ" },
  { id: "5", title: "I Think They Call This Love", artist: "Instrumental", youtubeId: "LLF3GMfNEZI" },
];
