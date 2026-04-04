// MUDANÇAS:
// 1. bootstrapSession e loadMaterias envolvidas em useCallback para que possam
//    ser listadas nas dependências dos useEffects sem causar loops infinitos.
// 2. useEffects agora têm dependências corretas e explícitas.
// 3. handleOpenEditModal inline no JSX para reduzir uma função redundante no escopo.
// 4. Ordem de limpeza do estado ao fechar o modal de edição garantida.
// 5. Comentários simplificados e precisos.

import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import MateriasPanel from '@/components/dashboard/MateriasPanel'
import CreateMateriaModal from '@/components/dashboard/CreateMateriaModal'
import EditMateriaModal from '@/components/dashboard/EditMateriaModal'
import FeedbackToast from '@/components/ui/FeedbackToast'
import { listMaterias, createMateria, editMateria, deleteMateria } from '@/services/api/api_materias.js'
import { validateSession } from '@/services/api/api_usuario.js'

export default function MateriasPage() {
    const [user, setUser] = useState(null)
    const [materias, setMaterias] = useState([])
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingMaterias, setLoadingMaterias] = useState(true)

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedMateria, setSelectedMateria] = useState(null)

    const [loadingCreateMateria, setLoadingCreateMateria] = useState(false)
    const [loadingEditMateria, setLoadingEditMateria] = useState(false)
    const [loadingDeleteMateriaId, setLoadingDeleteMateriaId] = useState(null)

    const [feedback, setFeedback] = useState({ open: false, type: 'success', message: '' })

    const navigate = useNavigate()

    function showFeedback(type, message) {
        setFeedback({ open: true, type, message })
    }

    // useCallback: navigate é estável, então esta função também será estável
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

    // useCallback: usada tanto no efeito inicial quanto após operações de escrita
    const loadMaterias = useCallback(async () => {
        try {
            setLoadingMaterias(true)
            const data = await listMaterias()
            if (data.status === 'ok') {
                setMaterias(data.data.materias || [])
            } else {
                setMaterias([])
                showFeedback('error', data.mensagem || 'Não foi possível carregar as matérias.')
            }
        } catch {
            setMaterias([])
            showFeedback('error', 'Ocorreu um erro ao carregar as matérias.')
        } finally {
            setLoadingMaterias(false)
        }
    }, [])

    async function handleCreateMateria(payload) {
        try {
            setLoadingCreateMateria(true)
            const data = await createMateria(payload)
            if (data.status === 'ok') {
                await loadMaterias()
                setShowCreateModal(false)
                showFeedback('success', 'Matéria criada com sucesso.')
            } else {
                showFeedback('error', data.mensagem || 'Não foi possível criar a matéria.')
            }
        } catch {
            showFeedback('error', 'Ocorreu um erro ao criar a matéria.')
        } finally {
            setLoadingCreateMateria(false)
        }
    }

    async function handleEditMateria(payload) {
        try {
            setLoadingEditMateria(true)
            const data = await editMateria(payload)
            if (data.status === 'ok') {
                await loadMaterias()
                // Fecha modal e limpa seleção juntos, atomicamente
                setShowEditModal(false)
                setSelectedMateria(null)
                showFeedback('success', 'Matéria atualizada com sucesso.')
            } else {
                showFeedback('error', data.mensagem || 'Não foi possível editar a matéria.')
            }
        } catch {
            showFeedback('error', 'Ocorreu um erro ao editar a matéria.')
        } finally {
            setLoadingEditMateria(false)
        }
    }

    async function handleDeleteMateria(materia) {
        if (!window.confirm(`Deseja realmente excluir a matéria "${materia.nome}"?`)) return

        try {
            setLoadingDeleteMateriaId(materia.id)
            const data = await deleteMateria({ id: materia.id })
            if (data.status === 'ok') {
                await loadMaterias()
                showFeedback('success', 'Matéria excluída com sucesso.')
            } else {
                showFeedback('error', data.mensagem || 'Não foi possível excluir a matéria.')
            }
        } catch {
            showFeedback('error', 'Ocorreu um erro ao excluir a matéria.')
        } finally {
            setLoadingDeleteMateriaId(null)
        }
    }

    function handleOpenMateria(materia) {
        navigate(`/materias/${materia.id}`)
    }

    // Dependências explícitas e corretas: sem mais funções instáveis no array
    useEffect(() => { bootstrapSession() }, [bootstrapSession])
    useEffect(() => { if (user) loadMaterias() }, [user, loadMaterias])

    return (
        <>
            <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
                <div className="flex">
                    <DashboardSidebar user={user} setUser={setUser} />

                    <div className="min-h-screen flex-1">
                        <DashboardHeader eyebrow="Matérias" title="Sua organização por matéria" />

                        <div className="px-8 py-8">
                            {loadingPage ? (
                                <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                                    <p className="text-sm text-[#8A8A80]">Validando sessão...</p>
                                </section>
                            ) : (
                                <MateriasPanel
                                    materias={materias}
                                    loading={loadingMaterias}
                                    onCreateClick={() => setShowCreateModal(true)}
                                    // MELHORIA: handler inline elimina função handleOpenEditModal separada
                                    onEditClick={(materia) => {
                                        setSelectedMateria(materia)
                                        setShowEditModal(true)
                                    }}
                                    onDeleteClick={handleDeleteMateria}
                                    onOpenMateria={handleOpenMateria}
                                    loadingDeleteMateriaId={loadingDeleteMateriaId}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <CreateMateriaModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateMateria}
                    loading={loadingCreateMateria}
                />

                <EditMateriaModal
                    isOpen={showEditModal}
                    materia={selectedMateria}
                    onClose={() => {
                        setShowEditModal(false)
                        setSelectedMateria(null)
                    }}
                    onSubmit={handleEditMateria}
                    loading={loadingEditMateria}
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