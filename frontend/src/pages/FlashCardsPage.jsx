
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import FlashcardsPanel from '@/components/dashboard/FlashCardsPanel'
import FeedbackToast from '@/components/ui/FeedbackToast'
import { listFlashcards } from '@/services/api/api_flashcards.js'
import { validateSession } from '@/services/api/api_usuario.js'

export default function FlashCardsPage() {
    const [user, setUser] = useState(null)
    const [flashcards, setFlashcards] = useState([])
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingFlashcards, setLoadingFlashcards] = useState(true)
    const [feedback, setFeedback] = useState({ open: false, type: 'success', message: '' })

    const navigate = useNavigate()

    function showFeedback(type, message) {
        setFeedback({ open: true, type, message })
    }

    const bootstrapSession = useCallback(async () => {
        try {
            setLoadingPage(true)
            const storedUser = localStorage.getItem('papyrus_user')
            if (storedUser) {
                try { setUser(JSON.parse(storedUser)) }
                catch { localStorage.removeItem('papyrus_user') }
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

    const loadFlashcards = useCallback(async () => {
        try {
            setLoadingFlashcards(true)
            const data = await listFlashcards()
            if (data.status === 'ok') {
                setFlashcards(data.data.flashcards || [])
            } else {
                setFlashcards([])
                showFeedback('error', data.mensagem || 'Não foi possível carregar as flashcards.')
            }
        } catch {
            setFlashcards([])
            showFeedback('error', 'Ocorreu um erro ao carregar as flashcards.')
        } finally {
            setLoadingFlashcards(false)
        }
    }, [])

    function handleOpenFlashcard(flashcard) {
        if (flashcard?.id) {
            navigate(`/flashcards/${flashcard.id}`)
        }
    }

    useEffect(() => { bootstrapSession() }, [bootstrapSession])
    useEffect(() => { if (user) loadFlashcards() }, [user, loadFlashcards])

    return (
        <>
            <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
                <div className="flex">
                    <DashboardSidebar user={user} setUser={setUser} />

                    <div className="min-h-screen flex-1">
                        <DashboardHeader eyebrow="Flashcards" title="Sua organização por flashcards" />

                        <div className="px-8 py-8">
                            {loadingPage ? (
                                <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                                    <p className="text-sm text-[#8A8A80]">Validando sessão...</p>
                                </section>
                            ) : (
                                <FlashcardsPanel
                                    flashcards={flashcards}
                                    loading={loadingFlashcards}
                                    onCreateClick={() => showFeedback('info', 'Em breve você poderá criar novas flashcards.')}
                                    onEditClick={() => showFeedback('info', 'Em breve você poderá editar flashcards.')}
                                    onDeleteClick={() => showFeedback('info', 'Em breve você poderá excluir flashcards.')}
                                    onOpenFlashcard={handleOpenFlashcard}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <FeedbackToast
                open={feedback.open}
                type={feedback.type}
                message={feedback.message}
                onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
            />
        </>
    )
}
