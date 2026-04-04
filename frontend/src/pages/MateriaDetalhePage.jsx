// MUDANÇAS:
// 1. BUG CRÍTICO CORRIGIDO: data.data.user -> data.data.usuario
//    (Inconsistência com MateriasPage que já usava .usuario corretamente.
//     Este bug causava setUser(undefined) silenciosamente, o que travava o carregamento.)
// 2. useEffect de bootstrapSession agora usa useCallback para incluir navigate
//    nas dependências sem causar loop infinito.
// 3. loadMaterias extraída como função nomeada para ser referenciável no useEffect.
// 4. Removido loadingPage do estado de loadingMateria: eram dois loadings separados
//    mas o título mostrava ambos juntos — agora exibe loading correto por fase.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { listMaterias } from '@/services/api/api_materias.js'
import { validateSession } from '@/services/api/api_usuario.js'

export default function MateriaDetalhePage() {
    const [user, setUser] = useState(null)
    const [materias, setMaterias] = useState([])
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingMateria, setLoadingMateria] = useState(true)

    const navigate = useNavigate()
    const { materiaId } = useParams()

    // useCallback para estabilizar a função e poder listá-la como dependência com segurança
    const bootstrapSession = useCallback(async () => {
        try {
            setLoadingPage(true)

            const storedUser = localStorage.getItem('papyrus_user')
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser))
                } catch {
                    localStorage.removeItem('papyrus_user')
                }
            }

            const data = await validateSession()

            if (data?.status !== 'ok') {
                localStorage.removeItem('papyrus_user')
                navigate('/login')
                return
            }

            // BUG FIX: era data.data.user — corrigido para data.data.usuario
            // (mesma chave retornada pela API, consistente com MateriasPage)
            if (data?.data?.usuario) {
                setUser(data.data.usuario)
                localStorage.setItem('papyrus_user', JSON.stringify(data.data.usuario))
            }
        } catch (error) {
            console.error('Erro ao validar sessão:', error)
            localStorage.removeItem('papyrus_user')
            navigate('/login')
        } finally {
            setLoadingPage(false)
        }
    }, [navigate])

    useEffect(() => {
        bootstrapSession()
    }, [bootstrapSession])

    useEffect(() => {
        if (!user) return

        async function loadMaterias() {
            try {
                setLoadingMateria(true)
                const data = await listMaterias()
                setMaterias(data.status === 'ok' ? data.data.materias || [] : [])
            } catch (error) {
                console.error('Erro ao carregar matéria:', error)
                setMaterias([])
            } finally {
                setLoadingMateria(false)
            }
        }

        loadMaterias()
    }, [user])

    // Busca a matéria específica na lista carregada pelo ID da URL
    const materia = useMemo(
        () => materias.find((item) => String(item.id) === String(materiaId)) ?? null,
        [materias, materiaId]
    )

    // MELHORIA: título do header reflete apenas a fase de loading correta
    const headerTitle = loadingPage
        ? 'Carregando...'
        : loadingMateria
            ? 'Carregando matéria...'
            : materia?.nome || 'Matéria não encontrada'

    return (
        <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <div className="flex">
                <DashboardSidebar user={user} setUser={setUser} />

                <div className="min-h-screen flex-1">
                    <DashboardHeader eyebrow="Matéria" title={headerTitle} />

                    <div className="space-y-8 px-8 py-8">
                        <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                            {loadingPage || loadingMateria ? (
                                <p className="text-sm text-[#8A8A80]">Carregando dados da matéria...</p>
                            ) : !materia ? (
                                <div className="space-y-4">
                                    <p className="text-[16px] leading-8 text-[#5A5A52]">Não encontramos essa matéria no seu ambiente.</p>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/materias')}
                                        className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A]"
                                    >
                                        Voltar para matérias
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-4 w-4 rounded-full border border-black/10"
                                            style={{ backgroundColor: materia.color_hex || '#F8FF97' }}
                                        />
                                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Detalhes da matéria</p>
                                    </div>
                                    <h2 className="mt-4 font-serif-display text-[clamp(34px,5vw,56px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
                                        {materia.nome}
                                    </h2>
                                    <p className="mt-4 max-w-3xl text-[16px] leading-8 text-[#5A5A52]">
                                        {materia.descricao || 'Esta matéria ainda não possui uma descrição cadastrada.'}
                                    </p>
                                </>
                            )}
                        </section>

                        <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Tarefas</p>
                            <h3 className="mt-4 font-serif-display text-[clamp(28px,4vw,40px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">Espaço da matéria</h3>
                            <p className="mt-4 max-w-3xl text-[16px] leading-8 text-[#5A5A52]">
                                As tarefas vinculadas a esta matéria aparecerão aqui. Esta página já está pronta para receber o próximo módulo do projeto.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}