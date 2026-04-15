import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import MusicPlayer from "@/components/layout/MusicPlayer";
import HomePage from "@/pages/HomePage";
import AuthPage from "@/pages/AuthPage";
import CoursesPage from "@/pages/CoursesPage";
import LessonPage from "@/pages/LessonPage";
import LabPage from "@/pages/LabPage";
import PiTimesPage from "@/pages/PiTimesPage";
import GamesPage from "@/pages/GamesPage";
import PuzzleGame from "@/pages/games/PuzzleGame";
import FixTheCode from "@/pages/games/FixTheCode";
import DailyChallengesPage from "@/pages/games/DailyChallenge";
import ProgressDashboard from "@/pages/ProgressDashboard";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:lang" element={<CoursesPage />} />
          <Route path="/lesson/:lang/:lessonId" element={<LessonPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/lab/:lang" element={<LabPage />} />
          <Route path="/pitimes" element={<PiTimesPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/puzzle" element={<PuzzleGame />} />
          <Route path="/games/fix" element={<FixTheCode />} />
          <Route path="/games/daily" element={<DailyChallengesPage />} />
          <Route path="/dashboard" element={<ProgressDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <MusicPlayer />
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "hsl(220 60% 6%)",
              border: "1px solid hsl(185 100% 50% / 0.3)",
              color: "hsl(185 100% 80%)",
              fontFamily: "Exo 2, sans-serif",
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
