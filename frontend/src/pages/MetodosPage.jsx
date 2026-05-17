import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { validateSession } from '@/services/api/api_usuario.js'

const methods = [
    {
        key: 'pomodoro',
        title: 'Pomodoro',
        description: 'Técnica de gerenciamento de tempo com ciclos de foco e pausas curtas para maximizar a concentração.',
        to: '/metodos/pomodoro',
    },
    {
        key: 'flashcards',
        title: 'Flashcards',
        to: '/metodos/flashcards',
    },
]

export default function MetodosPage() {
    const [user, setUser] = useState(null)
    const [loadingPage, setLoadingPage] = useState(true)
    const navigate = useNavigate()

    const bootstrapSession = useCallback(async () => {
        try {
            setLoadingPage(true)
            const storedUser = localStorage.getItem('papyrus_user')
            if (storedUser) {
                try { setUser(JSON.parse(storedUser)) } catch { localStorage.removeItem('papyrus_user') }
            }
            const data = await validateSession()
            if (data?.status !== 'ok') {
                localStorage.removeItem('papyrus_user')
                navigate('/login')
                return
            }
            if (data?.data?.usuario) {
                setUser(data.data.usuario)
                localStorage.setItem('papyrus_user', JSON.stringify(data.data.usuario))
            }
        } catch {
            navigate('/login')
        } finally {
            setLoadingPage(false)
        }
    }, [navigate])

    useEffect(() => { bootstrapSession() }, [bootstrapSession])

    return (
        <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <div className="flex">
                <DashboardSidebar user={user} setUser={setUser} />

                <div className="min-h-screen flex-1">
                    <DashboardHeader eyebrow="Métodos" title="Métodos de estudo" />

                    <div className="px-8 py-8">
                        {loadingPage ? (
                            <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                                <p className="text-sm text-[#8A8A80]">Validando sessão...</p>
                            </section>
                        ) : (
                            <div>
                                <p className="mb-6 text-sm text-[#8A8A80]">Escolha um método de estudo para começar.</p>

                                <div className="grid grid-cols-2 gap-4">
                                    {methods.map((method) => (
                                        <button
                                            key={method.key}
                                            onClick={() => navigate(method.to)}
                                            className="group rounded-3xl border border-[#E8E8DF] bg-white p-8 text-left shadow-sm transition hover:border-[#1A1A1A] hover:shadow-md"
                                        >

                                            <h2 className="font-serif-display text-2xl tracking-[-0.03em] text-[#1A1A1A]">
                                                {method.title}
                                            </h2>

                                            <p className="mt-2 text-sm leading-6 text-[#5A5A52]">
                                                {method.description}
                                            </p>

                                            <div className="mt-6 flex items-center gap-1 text-xs font-medium text-[#4E4E47] transition group-hover:text-[#1A1A1A]">
                                                <span>Acessar</span>
                                                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3 transition group-hover:translate-x-0.5">
                                                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
