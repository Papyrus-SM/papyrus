import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import LandingPage from '@/pages/LandingPage'
import RegisterPage from '@/pages/RegisterPage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'

import MateriasPage from '@/pages/MateriasPage.jsx'
import MateriaDetalhePage from '@/pages/MateriaDetalhePage.jsx'
import StickyNotesPage from '@/pages/StickyNotesPage.jsx'
import TarefasPage from '@/pages/TarefasPage.jsx'
import CalendarioPage from '@/pages/CalendarioPage.jsx'
import AdminPage from '@/pages/AdminPage.jsx'

import CadernosPage from '@/pages/CadernosPage'
import CadernoDetalhePage from '@/pages/CadernoDetalhePage'

import MetodosPage from '@/pages/MetodosPage.jsx'
import PomodoroPage from '@/pages/PomodoroPage.jsx'
import FlashCardsPage from '@/pages/FlashCardsPage.jsx'

import { PomodoroProvider } from '@/contexts/PomodoroContext.jsx'
import PomodoroWidget from '@/components/pomodoro/PomodoroWidget.jsx'

import ChatButton from '@/components/chat/ChatButton'

function getStoredUser() {
    const storedUser = localStorage.getItem('papyrus_user')

    if (!storedUser) return null

    try {
        return JSON.parse(storedUser)
    } catch {
        localStorage.removeItem('papyrus_user')
        return null
    }
}

function StudentRoute({ children }) {
    const user = getStoredUser()

    if (!user) return <Navigate to="/login" replace />
    if (user.papel === 'admin') return <Navigate to="/admin" replace />

    return children
}

function AdminRoute({ children }) {
    const user = getStoredUser()

    if (!user) return <Navigate to="/login" replace />
    if (user.papel !== 'admin') return <Navigate to="/dashboard" replace />

    return children
}

export default function App() {
    const location = useLocation()

    const publicPaths = ['/', '/login', '/register']
    const isPublicPath = publicPaths.includes(location.pathname)
    const isAdminPath = location.pathname.startsWith('/admin')

    const showChat = !isPublicPath && !isAdminPath

    return (
        <PomodoroProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route path="/dashboard" element={<StudentRoute><DashboardPage /></StudentRoute>} />

                <Route path="/materias" element={<StudentRoute><MateriasPage /></StudentRoute>} />
                <Route path="/materias/:materiaId" element={<StudentRoute><MateriaDetalhePage /></StudentRoute>} />

                <Route path="/sticky-notes" element={<StudentRoute><StickyNotesPage /></StudentRoute>} />

                <Route path="/cadernos" element={<StudentRoute><CadernosPage /></StudentRoute>} />
                <Route path="/cadernos/:cadernoId" element={<StudentRoute><CadernoDetalhePage /></StudentRoute>} />

                <Route path="/tarefas" element={<StudentRoute><TarefasPage /></StudentRoute>} />

                <Route path="/calendario" element={<StudentRoute><CalendarioPage /></StudentRoute>} />

                <Route path="/metodos" element={<StudentRoute><MetodosPage /></StudentRoute>} />
                <Route path="/metodos/pomodoro" element={<StudentRoute><PomodoroPage /></StudentRoute>} />
                <Route path="/metodos/flashcards" element={<StudentRoute><FlashCardsPage /></StudentRoute>} />

                <Route path="/flashcards" element={<Navigate to="/metodos/flashcards" replace />} />

                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            </Routes>

            <PomodoroWidget />

            {showChat && <ChatButton />}
        </PomodoroProvider>
    )
}
