import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import WelcomeCard from '@/components/dashboard/WelcomeCard'
import MateriasPanel from '@/components/dashboard/MateriasPanel'
import TarefasPanel from '@/components/Tarefas/TarefasPanel'
import CreateTarefaModal from '@/components/Tarefas/CreateTarefaModal'
import EditTarefaModal from '@/components/Tarefas/EditTarefaModal'
import OnboardingModal from '@/components/dashboard/OnboardingModal'
import { getOnboardingStatus, skipOnboarding, completeOnboarding } from '@/services/api/api_onboarding.js'
import { createInitialMaterias, listMaterias } from '@/services/api/api_materias.js'
import { listTarefas, createTarefa, editTarefa, deleteTarefa } from '@/services/api/api_tarefas.js'

export default function DashboardPage() {
    const [user, setUser] = useState(null)
    const [materias, setMaterias] = useState([])
    const [loadingMaterias, setLoadingMaterias] = useState(true)
    const [showOnboarding, setShowOnboarding] = useState(false)
    const [loadingOnboarding, setLoadingOnboarding] = useState(false)

    const [tarefas, setTarefas] = useState([])
    const [loadingTarefas, setLoadingTarefas] = useState(true)
    const [showCreateTarefa, setShowCreateTarefa] = useState(false)
    const [showEditTarefa, setShowEditTarefa] = useState(false)
    const [tarefaParaEditar, setTarefaParaEditar] = useState(null)
    const [loadingTarefaForm, setLoadingTarefaForm] = useState(false)
    const [loadingDeleteTarefaId, setLoadingDeleteTarefaId] = useState(null)

    const navigate = useNavigate()

    const loadMaterias = useCallback(async () => {
        try {
            setLoadingMaterias(true)
            const data = await listMaterias()
            setMaterias(data.status === 'ok' ? data.data.materias || [] : [])
        } catch (error) {
            console.error('Erro ao carregar matérias:', error)
            setMaterias([])
        } finally {
            setLoadingMaterias(false)
        }
    }, [])

    const loadTarefas = useCallback(async () => {
        try {
            setLoadingTarefas(true)
            const data = await listTarefas()
            setTarefas(data.status === 'ok' ? data.data || [] : [])
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error)
            setTarefas([])
        } finally {
            setLoadingTarefas(false)
        }
    }, [])

    const loadOnboardingStatus = useCallback(async () => {
        try {
            const data = await getOnboardingStatus()
            if (data.status === 'ok') {
                setShowOnboarding(Boolean(data.data.onboarding?.mostrar_modal))
            }
        } catch (error) {
            console.error('Erro ao buscar status do onboarding:', error)
        }
    }, [])

    async function handleSkipOnboarding() {
        try {
            setLoadingOnboarding(true)
            const data = await skipOnboarding()
            if (data.status === 'ok') setShowOnboarding(false)
        } catch (error) {
            console.error('Erro ao pular onboarding:', error)
        } finally {
            setLoadingOnboarding(false)
        }
    }

    async function handleFinishOnboarding(materiasIniciais) {
        try {
            setLoadingOnboarding(true)

            if (materiasIniciais.length > 0) {
                const createData = await createInitialMaterias({ materias: materiasIniciais })
                if (createData.status !== 'ok') {
                    alert(createData.mensagem || 'Não foi possível salvar as matérias iniciais.')
                    return
                }
            }

            const completeData = await completeOnboarding()
            if (completeData.status === 'ok') {
                await loadMaterias()
                setShowOnboarding(false)
            } else {
                alert(completeData.mensagem || 'Não foi possível concluir o onboarding.')
            }
        } catch {
            alert('Ocorreu um erro ao finalizar o onboarding.')
        } finally {
            setLoadingOnboarding(false)
        }
    }

    async function handleCreateTarefa(payload) {
        try {
            setLoadingTarefaForm(true)
            const data = await createTarefa(payload)
            if (data.status === 'ok') {
                await loadTarefas()
                setShowCreateTarefa(false)
            } else {
                alert(data.mensagem || 'Não foi possível criar a tarefa.')
            }
        } catch (error) {
            console.error('Erro ao criar tarefa:', error)
            alert('Ocorreu um erro ao criar a tarefa.')
        } finally {
            setLoadingTarefaForm(false)
        }
    }

    async function handleEditTarefa(payload) {
        try {
            setLoadingTarefaForm(true)
            const data = await editTarefa(payload)
            if (data.status === 'ok') {
                await loadTarefas()
                setShowEditTarefa(false)
                setTarefaParaEditar(null)
            } else {
                alert(data.mensagem || 'Não foi possível editar a tarefa.')
            }
        } catch (error) {
            console.error('Erro ao editar tarefa:', error)
            alert('Ocorreu um erro ao editar a tarefa.')
        } finally {
            setLoadingTarefaForm(false)
        }
    }

    async function handleDeleteTarefa(tarefa) {
        if (!window.confirm(`Deseja excluir a tarefa "${tarefa.titulo}"?`)) return

        try {
            setLoadingDeleteTarefaId(tarefa.id)
            const data = await deleteTarefa({ tarefa_id: tarefa.id })
            if (data.status === 'ok') {
                await loadTarefas()
            } else {
                alert(data.mensagem || 'Não foi possível excluir a tarefa.')
            }
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error)
            alert('Ocorreu um erro ao excluir a tarefa.')
        } finally {
            setLoadingDeleteTarefaId(null)
        }
    }

    function handleOpenEditTarefa(tarefa) {
        setTarefaParaEditar(tarefa)
        setShowEditTarefa(true)
    }

    function handleCloseEditTarefa() {
        setShowEditTarefa(false)
        setTarefaParaEditar(null)
    }

    // Inicialização: lê cache local e redireciona se não autenticado
    useEffect(() => {
        const storedUser = localStorage.getItem('papyrus_user')
        if (!storedUser) {
            navigate('/login')
            return
        }

        try {
            setUser(JSON.parse(storedUser))
        } catch {
            localStorage.removeItem('papyrus_user')
            navigate('/login')
        }
    }, [navigate])

    useEffect(() => {
        if (!user) return
        loadMaterias()
        loadTarefas()
        loadOnboardingStatus()
    }, [user, loadMaterias, loadTarefas, loadOnboardingStatus])

    return (
        <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <div className="flex">
                <DashboardSidebar user={user} setUser={setUser} />

                <div className="min-h-screen flex-1">
                    <DashboardHeader eyebrow="Dashboard" title="Visão geral" />

                    <div className="space-y-8 px-8 py-8">
                        <WelcomeCard user={user} />
                        <MateriasPanel
                            materias={materias}
                            loading={loadingMaterias}
                            onCreateClick={() => navigate('/materias')}
                            onOpenMateria={(materia) => navigate(`/materias/${materia.id}`)}
                        />
                        <TarefasPanel
                            tarefas={tarefas}
                            loading={loadingTarefas}
                            onCreateClick={() => setShowCreateTarefa(true)}
                            onEditClick={handleOpenEditTarefa}
                            onDeleteClick={handleDeleteTarefa}
                            loadingDeleteTarefaId={loadingDeleteTarefaId}
                        />
                    </div>
                </div>
            </div>

            <OnboardingModal
                isOpen={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                onSkip={handleSkipOnboarding}
                onFinish={handleFinishOnboarding}
                loading={loadingOnboarding}
            />

            <CreateTarefaModal
                isOpen={showCreateTarefa}
                onClose={() => setShowCreateTarefa(false)}
                onSubmit={handleCreateTarefa}
                loading={loadingTarefaForm}
                materias={materias}
            />

            <EditTarefaModal
                isOpen={showEditTarefa}
                tarefa={tarefaParaEditar}
                onClose={handleCloseEditTarefa}
                onSubmit={handleEditTarefa}
                loading={loadingTarefaForm}
                materias={materias}
            />
        </main>
    )
}
