
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import FlashcardsPanel from '@/components/flashCards/FlashcardsPanel'
import FeedbackToast from '@/components/ui/FeedbackToast'
import CreateFlashcardModal from '@/components/flashCards/CreateFlashcardModal'
import EditFlashcardModal from '@/components/flashCards/EditFlashcardModal'
import { listFlashcards, createFlashcard, editFlashcard, deleteFlashcard } from '@/services/api/api_flashcards.js'
import { validateSession } from '@/services/api/api_usuario.js'

export default function FlashCardsPage() {
    const [user, setUser] = useState(null)
    const [flashcards, setFlashcards] = useState([])
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingFlashcards, setLoadingFlashcards] = useState(true)
    const [feedback, setFeedback] = useState({ open: false, type: 'success', message: '' })
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [editingFlashcard, setEditingFlashcard] = useState(null)
    const [loadingDeleteFlashcardId, setLoadingDeleteFlashcardId] = useState(null)
    const [loadingSubmitFlashcard, setLoadingSubmitFlashcard] = useState(false)

    const navigate = useNavigate()

    function showFeedback(type, message) {
        setFeedback({ open: true, type, message })
    }

    // Padrão da página: carregar sessão, buscar dados via API e
    // expor handlers para criação/edição/exclusão que atualizam a lista
    // e mostram feedback ao usuário (mantendo consistência com Tarefas).

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

    async function handleCreateFlashcard(payload) {
        try {
            setLoadingSubmitFlashcard(true)
            const data = await createFlashcard(payload.pergunta, payload.resposta)

            if (data.status === 'ok') {
                setIsCreateModalOpen(false)
                showFeedback('success', 'Flashcard criada com sucesso!')
                loadFlashcards()
            } else {
                showFeedback('error', data.mensagem || 'Erro ao criar flashcard.')
            }
        } catch (error) {
            console.error('Erro ao criar flashcard:', error)
            showFeedback('error', 'Ocorreu um erro ao criar a flashcard.')
        } finally {
            setLoadingSubmitFlashcard(false)
        }
    }

    async function handleEditFlashcard(payload) {
        try {
            setLoadingSubmitFlashcard(true)
            const data = await editFlashcard(payload.flashcard_id, payload.pergunta, payload.resposta)

            if (data.status === 'ok') {
                // Fecha o modal de edição em caso de sucesso
                setEditingFlashcard(null)
                showFeedback('success', 'Flashcard atualizada com sucesso!')
                loadFlashcards()
            } else {
                showFeedback('error', data.mensagem || 'Erro ao atualizar flashcard.')
            }
        } catch (error) {
            console.error('Erro ao atualizar flashcard:', error)
            showFeedback('error', 'Ocorreu um erro ao atualizar a flashcard.')
        } finally {
            setLoadingSubmitFlashcard(false)
        }
    }

    async function handleDeleteFlashcard(flashcard) {
        const confirmDelete = window.confirm('Deseja realmente excluir este flashcard?')
        if (!confirmDelete) {
            return
        }

        // Confirmação simples e chamada ao backend para remover.
        try {
            setLoadingDeleteFlashcardId(flashcard.id)
            const data = await deleteFlashcard(flashcard.id)

            if (data.status === 'ok') {
                showFeedback('success', 'Flashcard excluída com sucesso!')
                loadFlashcards()
            } else {
                showFeedback('error', data.mensagem || 'Erro ao excluir flashcard.')
            }
        } catch (error) {
            console.error('Erro ao excluir flashcard:', error)
            showFeedback('error', 'Ocorreu um erro ao excluir a flashcard.')
        } finally {
            setLoadingDeleteFlashcardId(null)
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
                                    onCreateClick={() => setIsCreateModalOpen(true)}
                                    onEditClick={(flashcard) => setEditingFlashcard(flashcard)}
                                    onDeleteClick={handleDeleteFlashcard}
                                    loadingDeleteFlashcardId={loadingDeleteFlashcardId}
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

            <CreateFlashcardModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateFlashcard}
                loading={loadingSubmitFlashcard}
            />

            <EditFlashcardModal
                isOpen={Boolean(editingFlashcard)}
                flashcard={editingFlashcard}
                onClose={() => setEditingFlashcard(null)}
                onSubmit={handleEditFlashcard}
                loading={loadingSubmitFlashcard}
            />
        </>
    )
}
