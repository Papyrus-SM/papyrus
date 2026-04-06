import { Routes, Route } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import RegisterPage from '@/pages/RegisterPage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import MateriasPage from "@/pages/MateriasPage.jsx";
import MateriaDetalhePage from "@/pages/MateriaDetalhePage.jsx";
import StickyNotesPage from "@/pages/StickyNotesPage.jsx";
import TarefasPage from "@/pages/TarefasPage.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/materias" element={<MateriasPage />} />
            <Route path="/materias/:materiaId" element={<MateriaDetalhePage />} />
            <Route path="/sticky-notes" element={<StickyNotesPage />} />
            <Route path="/tarefas" element={<TarefasPage />} />
        </Routes>
    )
}