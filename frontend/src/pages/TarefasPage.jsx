import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import TarefasPanel from '@/components/Tarefas/TarefasPanel'
import CreateTarefaModal from '@/components/Tarefas/CreateTarefaModal'
import EditTarefaModal from '@/components/Tarefas/EditTarefaModal'
import FeedbackToast from '@/components/ui/FeedbackToast'
import { listTarefas, createTarefa, editTarefa, deleteTarefa } from '@/services/api/api_tarefas.js'
import { listMaterias } from '@/services/api/api_materias.js'
import { validateSession } from '@/services/api/api_usuario.js'

export default function TarefasPage() {
    const [user, setUser] = useState(null)
    const [tarefas, setTarefas] = useState([])
    const [materias, setMaterias] = useState([])
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingTarefas, setLoadingTarefas] = useState(true)

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedTarefa, setSelectedTarefa] = useState(null)

    const [loadingCreateTarefa, setLoadingCreateTarefa] = useState(false)
    const [loadingEditTarefa, setLoadingEditTarefa] = useState(false)
    const [loadingDeleteTarefaId, setLoadingDeleteTarefaId] = useState(null)

    const [feedback, setFeedback] = useState({ open: false, type: 'success', message: '' })

    const navigate = useNavigate()

    function showFeedback(type, message) {
        setFeedback({ open: true, type, message })
    }

    const bootstrapSession = useCallback(async () => {
        try {git 
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

    const loadTarefas = useCallback(async () => {
        try {
            setLoadingTarefas(true)
            const data = await listTarefas()
            if (data.status === 'ok') {
                setTarefas(data.data || [])
            } else {
                setTarefas([])
                showFeedback('error', data.mensagem || 'Não foi possível carregar as tarefas.')
            }
        } catch {
            setTarefas([])
            showFeedback('error', 'Ocorreu um erro ao carregar as tarefas.')
        } finally {
            setLoadingTarefas(false)
        }
    }, [])

    const loadMaterias = useCallback(async () => {
        try {
            const data = await listMaterias()
            if (data.status === 'ok') {
                setMaterias(data.data.materias || [])
            }
        } catch {
            // silencioso — materias são auxiliares para o formulário
        }
    }, [])

    async function handleCreateTarefa(payload) {
        try {
            setLoadingCreateTarefa(true)
            const data = await createTarefa(payload)
            if (data.status === 'ok') {
                await loadTarefas()
                setShowCreateModal(false)
                showFeedback('success', 'Tarefa criada com sucesso.')
            } else {
                showFeedback('error', data.mensagem || 'Não foi possível criar a tarefa.')
            }
        } catch {
            showFeedback('error', 'Ocorreu um erro ao criar a tarefa.')
        } finally {
            setLoadingCreateTarefa(false)
        }
    }

    async function handleEditTarefa(payload) {
        try {
            setLoadingEditTarefa(true)
            const data = await editTarefa(payload)
            if (data.status === 'ok') {
                await loadTarefas()
                setShowEditModal(false)
                setSelectedTarefa(null)
                showFeedback('success', 'Tarefa atualizada com sucesso.')
            } else {
                showFeedback('error', data.mensagem || 'Não foi possível editar a tarefa.')
            }
        } catch {
            showFeedback('error', 'Ocorreu um erro ao editar a tarefa.')
        } finally {
            setLoadingEditTarefa(false)
        }
    }

    async function handleDeleteTarefa(tarefa) {
        if (!window.confirm(`Deseja realmente excluir a tarefa "${tarefa.titulo}"?`)) return

        try {
            setLoadingDeleteTarefaId(tarefa.id)
            const data = await deleteTarefa({ tarefa_id: tarefa.id })
            if (data.status === 'ok') {
                await loadTarefas()
                showFeedback('success', 'Tarefa excluída com sucesso.')
            } else {
                showFeedback('error', data.mensagem || 'Não foi possível excluir a tarefa.')
            }
        } catch {
            showFeedback('error', 'Ocorreu um erro ao excluir a tarefa.')
        } finally {
            setLoadingDeleteTarefaId(null)
        }
    }

    useEffect(() => { bootstrapSession() }, [bootstrapSession])
    useEffect(() => {
        if (user) {
            loadTarefas()
            loadMaterias()
        }
    }, [user, loadTarefas, loadMaterias])

    return (
        <>
            <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
                <div className="flex">
                    <DashboardSidebar user={user} setUser={setUser} />

                    <div className="min-h-screen flex-1">
                        <DashboardHeader eyebrow="Tarefas" title="Suas tarefas" />

                        <div className="px-8 py-8">
                            {loadingPage ? (
                                <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                                    <p className="text-sm text-[#8A8A80]">Validando sessão...</p>
                                </section>
                            ) : (
                                <TarefasPanel
                                    tarefas={tarefas}
                                    loading={loadingTarefas}
                                    onCreateClick={() => setShowCreateModal(true)}
                                    onEditClick={(tarefa) => {
                                        setSelectedTarefa(tarefa)
                                        setShowEditModal(true)
                                    }}
                                    onDeleteClick={handleDeleteTarefa}
                                    loadingDeleteTarefaId={loadingDeleteTarefaId}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <CreateTarefaModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateTarefa}
                    loading={loadingCreateTarefa}
                    materias={materias}
                />

                <EditTarefaModal
                    isOpen={showEditModal}
                    tarefa={selectedTarefa}
                    onClose={() => {
                        setShowEditModal(false)
                        setSelectedTarefa(null)
                    }}
                    onSubmit={handleEditTarefa}
                    loading={loadingEditTarefa}
                    materias={materias}
                />
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
