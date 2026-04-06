import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { listMaterias } from '@/services/api/api_materias.js'
import { listTarefas } from '@/services/api/api_tarefas.js'
import { validateSession } from '@/services/api/api_usuario.js'

const DIFICULDADE_LABEL = {
    facil: 'Fácil',
    medio: 'Médio',
    dificil: 'Difícil',
}

const DIFICULDADE_STYLE = {
    facil: 'bg-[#EDFAF0] text-[#1E6B38] border border-[#B8E8C4]',
    medio: 'bg-[#FFF8E6] text-[#7A5A00] border border-[#F0DFA0]',
    dificil: 'bg-[#FBF3F3] text-[#7A2E2E] border border-[#E8C4C4]',
}

function formatDate(dateStr) {
    if (!dateStr) return null
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
}

export default function MateriaDetalhePage() {
    const [user, setUser] = useState(null)
    const [materias, setMaterias] = useState([])
    const [tarefas, setTarefas] = useState([])
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingMateria, setLoadingMateria] = useState(true)
    const [loadingTarefas, setLoadingTarefas] = useState(true)

    const navigate = useNavigate()
    const { materiaId } = useParams()

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

        async function loadTarefas() {
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
        }

        loadMaterias()
        loadTarefas()
    }, [user])

    const materia = useMemo(
        () => materias.find((item) => String(item.id) === String(materiaId)) ?? null,
        [materias, materiaId]
    )

    const tarefasDaMateria = useMemo(
        () => tarefas.filter((tarefa) => String(tarefa.materia?.id) === String(materiaId)),
        [tarefas, materiaId]
    )

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
                            <h3 className="mt-4 font-serif-display text-[clamp(28px,4vw,40px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
                                Tarefas desta matéria
                            </h3>
                            <p className="mt-4 max-w-3xl text-[16px] leading-8 text-[#5A5A52]">
                                Aqui ficam somente as tarefas vinculadas a esta matéria.
                            </p>

                            <div className="mt-8">
                                {loadingTarefas ? (
                                    <p className="text-sm text-[#8A8A80]">Carregando tarefas...</p>
                                ) : !materia ? (
                                    <p className="text-sm text-[#8A8A80]">Selecione uma matéria válida para visualizar as tarefas.</p>
                                ) : tarefasDaMateria.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-[#D9D9D0] bg-[#FAFAF7] px-6 py-8">
                                        <p className="text-sm leading-7 text-[#5A5A52]">
                                            Esta matéria ainda não possui tarefas cadastradas.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {tarefasDaMateria.map((tarefa) => {
                                            const dificuldadeStyle = DIFICULDADE_STYLE[tarefa.dificuldade] || ''
                                            const dificuldadeLabel = DIFICULDADE_LABEL[tarefa.dificuldade] || tarefa.dificuldade

                                            return (
                                                <article
                                                    key={tarefa.id}
                                                    className="rounded-2xl border border-[#E8E8DF] bg-[#FAFAF7] p-5 transition hover:-translate-y-[1px] hover:border-[#D4D4CB]"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div
                                                                className="h-3 w-3 shrink-0 rounded-full border border-black/10"
                                                                style={{ backgroundColor: tarefa.materia?.cor || '#F8FF97' }}
                                                            />
                                                            <h4 className="truncate text-lg font-medium text-[#1A1A1A]">
                                                                {tarefa.titulo}
                                                            </h4>
                                                        </div>

                                                        {tarefa.concluida && (
                                                            <span className="shrink-0 rounded-full bg-[#EDFAF0] px-2 py-0.5 text-[11px] font-medium text-[#1E6B38] border border-[#B8E8C4]">
                                                                Concluída
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-3 min-h-[36px] text-sm leading-6 text-[#5A5A52]">
                                                        {tarefa.descricao || 'Sem descrição cadastrada.'}
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${dificuldadeStyle}`}>
                                                            {dificuldadeLabel}
                                                        </span>

                                                        {tarefa.data_entrega && (
                                                            <span className="rounded-full bg-[#F0F0E8] px-2.5 py-0.5 text-[11px] text-[#5A5A52] border border-[#D9D9D0]">
                                                                Entrega: {formatDate(tarefa.data_entrega)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </article>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}