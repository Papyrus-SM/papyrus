// DashboardSidebar.jsx
// MUDANÇAS: Nenhuma mudança funcional — componente já estava correto e bem estruturado.
// Mantido exatamente como estava.

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { logoutUser } from '@/services/api/api_usuario.js'
import ProfileMenu from '@/components/profile/ProfileMenu'

const items = [
    { label: 'Dashboard', to: '/dashboard', disabled: false },
    { label: 'Matérias', to: '/materias', disabled: false },
    { label: 'Post-its', to: '/sticky-notes', disabled: false },
    { label: 'Tarefas', to: '/tarefas', disabled: false },
    { label: 'Calendário', to: null, disabled: true },
    { label: 'Métodos', to: null, disabled: true },
]

export default function DashboardSidebar({ user, setUser }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [isLeaving, setIsLeaving] = useState(false)

    async function handleLogout(skipRequest = false) {
        try {
            setIsLeaving(true)
            if (!skipRequest) {
                await logoutUser()
            }
            localStorage.removeItem('papyrus_user')
            setUser?.(null)
            navigate('/')
        } catch (error) {
            console.error('Erro ao sair da conta:', error)
        } finally {
            setIsLeaving(false)
        }
    }

    return (
        <aside className="flex min-h-screen w-[260px] flex-col border-r border-[#E8E8DF] bg-[#F7F7F2] px-5 py-6">
            <div className="mb-10">
                <div className="font-serif-display text-2xl tracking-[-0.03em] text-[#1A1A1A]">Papyrus</div>
                <p className="mt-2 text-sm text-[#8A8A80]">Painel acadêmico</p>
            </div>

            <nav className="space-y-2">
                {items.map((item) => {
                    const isActive = item.to && location.pathname === item.to

                    if (item.disabled) {
                        return (
                            <div key={item.label} aria-disabled="true" className="cursor-not-allowed rounded-xl px-4 py-3 text-sm text-[#A3A399] opacity-70">
                                <div className="flex items-center justify-between gap-2">
                                    <span>{item.label}</span>
                                    <span className="text-[10px] uppercase tracking-[0.12em]">Em breve</span>
                                </div>
                            </div>
                        )
                    }

                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`block rounded-xl px-4 py-3 text-sm transition ${
                                isActive ? 'bg-[#1A1A1A] text-[#FAFAF7]' : 'text-[#4E4E47] hover:bg-[#ECECE4] hover:text-[#1A1A1A]'
                            }`}
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto space-y-4">
                <div className="rounded-2xl border border-[#E8E8DF] bg-white px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#8A8A80]">Em breve</p>
                    <p className="mt-2 text-sm leading-6 text-[#5A5A52]">Flashcards, Pomodoro e cadernos inteligentes.</p>
                </div>

                <ProfileMenu user={user} setUser={setUser} onLogout={handleLogout} />

                <button
                    type="button"
                    onClick={() => handleLogout(false)}
                    disabled={isLeaving}
                    className="w-full rounded-xl border border-[#D8D8CF] bg-transparent px-4 py-3 text-sm text-[#4E4E47] transition hover:border-[#1A1A1A] hover:bg-[#ECECE4] hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isLeaving ? 'Saindo...' : 'Sair'}
                </button>
            </div>
        </aside>
    )
}