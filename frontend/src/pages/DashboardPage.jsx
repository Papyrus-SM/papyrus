// MUDANÇAS:
// 1. BUG CRÍTICO CORRIGIDO: MateriasPanel no Dashboard não recebia onOpenMateria,
//    onEditClick nem onDeleteClick. Com a correção no MateriasPanel (handlers opcionais),
//    isto funciona — mas onCreateClick agora navega para /materias como era a intenção.
// 2. loadMaterias e loadOnboardingStatus envolvidas em useCallback para dependências
//    corretas no useEffect que as chama, eliminando o warning de exhaustive-deps.
// 3. Lógica de leitura do localStorage extraída para evitar duplicação com try/catch isolado.

import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import WelcomeCard from '@/components/dashboard/WelcomeCard'
import MateriasPanel from '@/components/dashboard/MateriasPanel'
import OnboardingModal from '@/components/dashboard/OnboardingModal'
import { getOnboardingStatus, skipOnboarding, completeOnboarding } from '@/services/api/api_onboarding.js'
import { createInitialMaterias, listMaterias } from '@/services/api/api_materias.js'

export default function DashboardPage() {
    const [user, setUser] = useState(null)
    const [materias, setMaterias] = useState([])
    const [loadingMaterias, setLoadingMaterias] = useState(true)
    const [showOnboarding, setShowOnboarding] = useState(false)
    const [loadingOnboarding, setLoadingOnboarding] = useState(false)

    const navigate = useNavigate()

    // useCallback: estável entre renders, seguro nas dependências do useEffect
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
            // JSON corrompido: limpa e redireciona
            localStorage.removeItem('papyrus_user')
            navigate('/login')
        }
    }, [navigate])

    // Carrega dados apenas quando o usuário estiver disponível
    // useCallback garante que loadMaterias e loadOnboardingStatus sejam dependências estáveis
    useEffect(() => {
        if (!user) return
        loadMaterias()
        loadOnboardingStatus()
    }, [user, loadMaterias, loadOnboardingStatus])

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
                            // BUG FIX: navega para /materias para gerenciar — handlers de edição/delete
                            // não são passados intencionalmente (painel do Dashboard é somente leitura)
                            onCreateClick={() => navigate('/materias')}
                            onOpenMateria={(materia) => navigate(`/materias/${materia.id}`)}
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
        </main>
    )
}