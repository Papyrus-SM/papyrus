import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { logoutUser } from '@/services/auth'
import ProfileMenu from '@/components/profile/ProfileMenu'
const items = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Matérias', to: '#' },
    { label: 'Tarefas', to: '#' },
    { label: 'Calendário', to: '#' },
    { label: 'Métodos', to: '#' },
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
            navigate('/')
        } catch (error) {
            console.error('Erro ao sair da conta:', error)
            alert('Não foi possível sair da conta agora.')
        } finally {
            setIsLeaving(false)
        }
    }

    return (
        <aside className="flex min-h-screen w-[260px] flex-col border-r border-[#E8E8DF] bg-[#F7F7F2] px-5 py-6">
            <div className="mb-10">
                <div className="font-serif-display text-2xl tracking-[-0.03em] text-[#1A1A1A]">
                    Papyrus
                </div>

                <p className="mt-2 text-sm text-[#8A8A80]">
                    Painel acadêmico
                </p>
            </div>

            <nav className="space-y-2">
                {items.map((item) => {
                    const isActive = location.pathname === item.to

                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`block rounded-xl px-4 py-3 text-sm transition ${
                                isActive
                                    ? 'bg-[#1A1A1A] text-[#FAFAF7]'
                                    : 'text-[#4E4E47] hover:bg-[#ECECE4] hover:text-[#1A1A1A]'
                            }`}
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto space-y-4">
                <div className="rounded-2xl border border-[#E8E8DF] bg-white px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#8A8A80]">
                        Em breve
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#5A5A52]">
                        Flashcards, Pomodoro e cadernos inteligentes.
                    </p>
                </div>

                <ProfileMenu
                    user={user}
                    setUser={setUser}
                    onLogout={handleLogout}
                />

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