import { Routes, Route } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import RegisterPage from '@/pages/RegisterPage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import MateriasPage from "@/pages/MateriasPage.jsx";
import MateriaDetalhePage from "@/pages/MateriaDetalhePage.jsx";
import StickyNotesPage from "@/pages/StickyNotesPage.jsx";
import TarefasPage from "@/pages/TarefasPage.jsx";
import AdminPage from "@/pages/AdminPage.jsx"
import MetodosPage from "@/pages/MetodosPage.jsx";
import PomodoroPage from "@/pages/PomodoroPage.jsx";
import FlashcardsPage from "@/pages/FlashcardsPage.jsx";
import { PomodoroProvider } from "@/contexts/PomodoroContext.jsx";
import PomodoroWidget from "@/components/pomodoro/PomodoroWidget.jsx";

export default function App() {
    return (
        <PomodoroProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/materias" element={<MateriasPage />} />
                <Route path="/materias/:materiaId" element={<MateriaDetalhePage />} />
                <Route path="/sticky-notes" element={<StickyNotesPage />} />
                <Route path="/tarefas" element={<TarefasPage />} />
                <Route path="/metodos" element={<MetodosPage />} />
                <Route path="/metodos/pomodoro" element={<PomodoroPage />} />
                <Route path="/metodos/flashcards" element={<FlashcardsPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
            <PomodoroWidget />
        </PomodoroProvider>
    )
}