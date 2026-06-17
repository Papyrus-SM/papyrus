import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DatePopup from '@/components/calendario/DatePopup'
import CreateEventoModal from '@/components/calendario/CreateEventoModal'
import CreateTarefaModal from '@/components/Tarefas/CreateTarefaModal'
import FeedbackToast from '@/components/ui/FeedbackToast'
import { listTarefas, createTarefa } from '@/services/api/api_tarefas.js'
import { listEventos, createEvento } from '@/services/api/api_eventos.js'
import { listMaterias } from '@/services/api/api_materias.js'
import { validateSession } from '@/services/api/api_usuario.js'

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const DIAS_SEMANA_COMPLETO = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function hoje() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function isSameDay(a, b) {
    return a === b
}

function getWeekDays(date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    d.setDate(diff)
    const days = []
    for (let i = 0; i < 7; i++) {
        const nd = new Date(d)
        nd.setDate(nd.getDate() + i)
        days.push({
            dateKey: formatDateKey(nd.getFullYear(), nd.getMonth(), nd.getDate()),
            day: nd.getDate(),
            month: nd.getMonth(),
            year: nd.getFullYear(),
            isToday: formatDateKey(nd.getFullYear(), nd.getMonth(), nd.getDate()) === hoje(),
        })
    }
    return days
}

function getMonthGrid(year, month) {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const grid = []
    let row = []

    for (let i = 0; i < firstDay; i++) {
        row.push(null)
    }

    for (let d = 1; d <= daysInMonth; d++) {
        row.push({
            dateKey: formatDateKey(year, month, d),
            day: d,
            isToday: formatDateKey(year, month, d) === hoje(),
        })
        if (row.length === 7) {
            grid.push(row)
            row = []
        }
    }

    if (row.length > 0) {
        while (row.length < 7) {
            row.push(null)
        }
        grid.push(row)
    }

    return grid
}

function calcularAlerta(tarefa) {
    if (!tarefa.data_entrega || tarefa.concluida) return null
    const hojeDate = new Date()
    hojeDate.setHours(0, 0, 0, 0)
    const entrega = new Date(tarefa.data_entrega + 'T00:00:00')
    const diffTime = entrega - hojeDate
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'danger'
    if (tarefa.dias_seguros && diffDays <= tarefa.dias_seguros) return 'warning'
    return null
}

export default function CalendarioPage() {
    const [user, setUser] = useState(null)
    const [loadingPage, setLoadingPage] = useState(true)

    const [tarefas, setTarefas] = useState([])
    const [eventos, setEventos] = useState([])
    const [materias, setMaterias] = useState([])

    const [viewMode, setViewMode] = useState('mes')
    const [currentDate, setCurrentDate] = useState(new Date())

    const [selectedDate, setSelectedDate] = useState(null)
    const [showDatePopup, setShowDatePopup] = useState(false)

    const [showCreateTarefaModal, setShowCreateTarefaModal] = useState(false)
    const [showCreateEventoModal, setShowCreateEventoModal] = useState(false)
    const [tarefaInitialDate, setTarefaInitialDate] = useState(null)
    const [eventoInitialDate, setEventoInitialDate] = useState(null)

    const [loadingCreate, setLoadingCreate] = useState(false)
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

    const loadData = useCallback(async () => {
        try {
            const [tarefasRes, eventosRes, materiasRes] = await Promise.all([
                listTarefas(),
                listEventos(),
                listMaterias(),
            ])
            if (tarefasRes.status === 'ok') setTarefas(tarefasRes.data || [])
            if (eventosRes.status === 'ok') setEventos(eventosRes.data || [])
            if (materiasRes.status === 'ok') setMaterias(materiasRes.data.materias || [])
        } catch {
            // silencioso
        }
    }, [])

    useEffect(() => { bootstrapSession() }, [bootstrapSession])
    useEffect(() => {
        if (user) loadData()
    }, [user, loadData])

    function handlePrev() {
        const d = new Date(currentDate)
        if (viewMode === 'mes') {
            d.setMonth(d.getMonth() - 1)
        } else if (viewMode === 'semana') {
            d.setDate(d.getDate() - 7)
        } else {
            d.setFullYear(d.getFullYear() - 1)
        }
        setCurrentDate(d)
    }

    function handleNext() {
        const d = new Date(currentDate)
        if (viewMode === 'mes') {
            d.setMonth(d.getMonth() + 1)
        } else if (viewMode === 'semana') {
            d.setDate(d.getDate() + 7)
        } else {
            d.setFullYear(d.getFullYear() + 1)
        }
        setCurrentDate(d)
    }

    function handleDayClick(dateKey) {
        setSelectedDate(dateKey)
        setShowDatePopup(true)
    }

    function handleAddTarefaFromPopup(dateKey) {
        setTarefaInitialDate(dateKey)
        setShowDatePopup(false)
        setShowCreateTarefaModal(true)
    }

    function handleAddEventoFromPopup(dateKey) {
        setEventoInitialDate(dateKey)
        setShowDatePopup(false)
        setShowCreateEventoModal(true)
    }

    async function handleCreateTarefa(payload) {
        try {
            setLoadingCreate(true)
            const data = await createTarefa(payload)
            if (data.status === 'ok') {
                await loadData()
                setShowCreateTarefaModal(false)
                showFeedback('success', 'Tarefa criada com sucesso.')
            } else {
                showFeedback('error', data.mensagem || 'Não foi possível criar a tarefa.')
            }
        } catch {
            showFeedback('error', 'Ocorreu um erro ao criar a tarefa.')
        } finally {
            setLoadingCreate(false)
        }
    }

    async function handleCreateEvento(payload) {
        try {
            setLoadingCreate(true)
            const data = await createEvento(payload)
            if (data.status === 'ok') {
                await loadData()
                setShowCreateEventoModal(false)
                showFeedback('success', 'Evento criado com sucesso.')
            } else {
                showFeedback('error', data.mensagem || 'Não foi possível criar o evento.')
            }
        } catch {
            showFeedback('error', 'Ocorreu um erro ao criar o evento.')
        } finally {
            setLoadingCreate(false)
        }
    }

    function tarefasNoDia(dateKey) {
        return tarefas.filter((t) => t.data_entrega === dateKey && !t.concluida)
    }

    function eventosNoDia(dateKey) {
        return eventos.filter((e) => e.data_evento === dateKey)
    }

    function getTitulo() {
        if (viewMode === 'mes') {
            return `${MESES[currentDate.getMonth()]} de ${currentDate.getFullYear()}`
        } else if (viewMode === 'semana') {
            return `Semana de ${MESES[currentDate.getMonth()]} de ${currentDate.getFullYear()}`
        }
        return `${currentDate.getFullYear()}`
    }

    return (
        <>
            <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
                <div className="flex">
                    <DashboardSidebar user={user} setUser={setUser} />

                    <div className="min-h-screen flex-1">
                        <DashboardHeader eyebrow="Calendário" title="Seu calendário" />

                        <div className="px-8 py-8">
                            {loadingPage ? (
                                <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                                    <p className="text-sm text-[#8A8A80]">Validando sessão...</p>
                                </section>
                            ) : (
                                <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                                    {/* Navigation */}
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={handlePrev}
                                                className="rounded-xl border border-[#CBCBC2] px-3 py-2 text-sm text-[#1A1A1A] transition hover:bg-[#F0F0E8]"
                                            >
                                                &#8592;
                                            </button>
                                            <h3 className="font-serif-display text-2xl tracking-[-0.03em] text-[#1A1A1A]">
                                                {getTitulo()}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                className="rounded-xl border border-[#CBCBC2] px-3 py-2 text-sm text-[#1A1A1A] transition hover:bg-[#F0F0E8]"
                                            >
                                                &#8594;
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            {['mes', 'semana', 'ano'].map((mode) => (
                                                <button
                                                    key={mode}
                                                    type="button"
                                                    onClick={() => setViewMode(mode)}
                                                    className={`rounded-xl px-4 py-2 text-sm transition ${
                                                        viewMode === mode
                                                            ? 'bg-[#1A1A1A] text-[#FAFAF7]'
                                                            : 'border border-[#CBCBC2] text-[#1A1A1A] hover:bg-[#F0F0E8]'
                                                    }`}
                                                >
                                                    {mode === 'mes' ? 'Mês' : mode === 'semana' ? 'Semana' : 'Ano'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Month View */}
                                    {viewMode === 'mes' && (
                                        <div className="mt-8">
                                            <div className="grid grid-cols-7 border-b border-[#E8E8DF] pb-2">
                                                {DIAS_SEMANA.map((d) => (
                                                    <div key={d} className="text-center text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                                                        {d}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-2 space-y-1">
                                                {getMonthGrid(currentDate.getFullYear(), currentDate.getMonth()).map((week, wi) => (
                                                    <div key={wi} className="grid grid-cols-7">
                                                        {week.map((day, di) => {
                                                            if (!day) {
                                                                return <div key={`e-${di}`} className="min-h-[90px] p-1" />
                                                            }

                                                            const tarefasDia = tarefasNoDia(day.dateKey)
                                                            const eventosDia = eventosNoDia(day.dateKey)
                                                            const temAlerta = tarefasDia.some((t) => calcularAlerta(t) !== null)

                                                            return (
                                                                <button
                                                                    key={day.dateKey}
                                                                    type="button"
                                                                    onClick={() => handleDayClick(day.dateKey)}
                                                                    className={`group relative min-h-[90px] rounded-xl p-2 text-left transition hover:bg-[#F0F0E8] ${
                                                                        day.isToday ? 'ring-2 ring-[#1A1A1A] ring-inset' : ''
                                                                    }`}
                                                                >
                                                                    <span className={`text-sm font-medium ${
                                                                        day.isToday ? 'text-[#1A1A1A]' : 'text-[#5A5A52]'
                                                                    }`}>
                                                                        {day.day}
                                                                    </span>

                                                                    <div className="mt-1 space-y-1">
                                                                        {tarefasDia.slice(0, 2).map((t) => {
                                                                            const alerta = calcularAlerta(t)
                                                                            return (
                                                                                <div
                                                                                    key={t.id}
                                                                                    className="flex items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-[10px]"
                                                                                    style={{
                                                                                        backgroundColor: t.materia?.cor ? `${t.materia.cor}40` : '#F8FF9740',
                                                                                        color: '#1A1A1A',
                                                                                    }}
                                                                                >
                                                                                    {alerta && (
                                                                                        <span className="shrink-0">
                                                                                            {alerta === 'danger' ? '🔴' : '⚠️'}
                                                                                        </span>
                                                                                    )}
                                                                                    <span className="truncate">{t.titulo}</span>
                                                                                </div>
                                                                            )
                                                                        })}

                                                                        {eventosDia.slice(0, 1).map((e) => (
                                                                            <div
                                                                                key={e.id}
                                                                                className="truncate rounded-md px-1.5 py-0.5 text-[10px]"
                                                                                style={{
                                                                                    backgroundColor: `${e.cor}40`,
                                                                                    color: '#1A1A1A',
                                                                                }}
                                                                            >
                                                                                {e.titulo}
                                                                            </div>
                                                                        ))}

                                                                        {(tarefasDia.length + eventosDia.length) > (viewMode === 'mes' ? 3 : 5) && (
                                                                            <div className="text-[10px] text-[#8A8A80]">
                                                                                +{tarefasDia.length + eventosDia.length - 3} mais
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Week View */}
                                    {viewMode === 'semana' && (
                                        <div className="mt-8">
                                            <div className="grid grid-cols-7 border-b border-[#E8E8DF] pb-2">
                                                {DIAS_SEMANA.map((d) => (
                                                    <div key={d} className="text-center text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                                                        {d}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-2 grid grid-cols-7 gap-1">
                                                {getWeekDays(currentDate).map((dayInfo) => {
                                                    const tarefasDia = tarefasNoDia(dayInfo.dateKey)
                                                    const eventosDia = eventosNoDia(dayInfo.dateKey)
                                                    const temAlerta = tarefasDia.some((t) => calcularAlerta(t) !== null)

                                                    return (
                                                        <button
                                                            key={dayInfo.dateKey}
                                                            type="button"
                                                            onClick={() => handleDayClick(dayInfo.dateKey)}
                                                            className={`flex flex-col rounded-xl p-2 text-left transition hover:bg-[#F0F0E8] min-h-[150px] ${
                                                                dayInfo.isToday ? 'ring-2 ring-[#1A1A1A] ring-inset' : ''
                                                            }`}
                                                        >
                                                            <span className={`text-sm font-medium ${
                                                                dayInfo.isToday ? 'text-[#1A1A1A]' : 'text-[#5A5A52]'
                                                            }`}>
                                                                {dayInfo.day}
                                                            </span>

                                                            <div className="mt-2 space-y-1">
                                                                {tarefasDia.slice(0, 4).map((t) => {
                                                                    const alerta = calcularAlerta(t)
                                                                    return (
                                                                        <div
                                                                            key={t.id}
                                                                            className="flex items-center gap-1 truncate rounded-md px-1.5 py-1 text-[11px]"
                                                                            style={{
                                                                                backgroundColor: t.materia?.cor ? `${t.materia.cor}40` : '#F8FF9740',
                                                                            }}
                                                                        >
                                                                            {alerta === 'danger' && <span className="shrink-0">🔴</span>}
                                                                            {alerta === 'warning' && <span className="shrink-0">⚠️</span>}
                                                                            <span className="truncate">{t.titulo}</span>
                                                                        </div>
                                                                    )
                                                                })}
                                                                {eventosDia.slice(0, 2).map((e) => (
                                                                    <div
                                                                        key={e.id}
                                                                        className="truncate rounded-md px-1.5 py-1 text-[11px]"
                                                                        style={{ backgroundColor: `${e.cor}40` }}
                                                                    >
                                                                        {e.titulo}
                                                                    </div>
                                                                ))}
                                                                {(tarefasDia.length + eventosDia.length) > 6 && (
                                                                    <div className="text-[11px] text-[#8A8A80]">
                                                                        +{tarefasDia.length + eventosDia.length - 6} mais
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Year View */}
                                    {viewMode === 'ano' && (
                                        <div className="mt-8 grid grid-cols-3 gap-6 md:grid-cols-4">
                                            {MESES.map((mesNome, mi) => {
                                                const grid = getMonthGrid(currentDate.getFullYear(), mi)
                                                return (
                                                    <div key={mi} className="rounded-xl border border-[#E8E8DF] bg-[#FAFAF7] p-3">
                                                        <p className="mb-2 text-center text-xs font-medium text-[#1A1A1A]">{mesNome}</p>
                                                        <div className="grid grid-cols-7 gap-0">
                                                            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                                                <div key={i} className="text-center text-[8px] text-[#8A8A80]">{d}</div>
                                                            ))}
                                                            {grid.flat().map((day, i) => {
                                                                if (!day) return <div key={`e-${i}`} className="p-0.5" />
                                                                const tarefasDia = tarefasNoDia(day.dateKey)
                                                                const eventosDia = eventosNoDia(day.dateKey)
                                                                const hasItems = tarefasDia.length > 0 || eventosDia.length > 0
                                                                const temAlerta = tarefasDia.some((t) => calcularAlerta(t) !== null)

                                                                return (
                                                                    <button
                                                                        key={day.dateKey}
                                                                        type="button"
                                                                        onClick={() => handleDayClick(day.dateKey)}
                                                                        className={`relative p-0.5 text-center text-[11px] rounded transition hover:bg-[#E8E8DF] ${
                                                                            day.isToday ? 'bg-[#1A1A1A] text-[#FAFAF7]' : 'text-[#5A5A52]'
                                                                        }`}
                                                                    >
                                                                        {day.day}
                                                                        {hasItems && (
                                                                            <span className={`absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full ${
                                                                                temAlerta ? 'bg-[#7A2E2E]' : 'bg-[#4A90D9]'
                                                                            }`} />
                                                                        )}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </section>
                            )}
                        </div>
                    </div>
                </div>

                {showDatePopup && selectedDate && (
                    <DatePopup
                        selectedDate={selectedDate}
                        tarefas={tarefas}
                        eventos={eventos}
                        onClose={() => {
                            setShowDatePopup(false)
                            setSelectedDate(null)
                        }}
                        onAddTarefa={handleAddTarefaFromPopup}
                        onAddEvento={handleAddEventoFromPopup}
                    />
                )}

                <CreateTarefaModal
                    isOpen={showCreateTarefaModal}
                    onClose={() => {
                        setShowCreateTarefaModal(false)
                        setTarefaInitialDate(null)
                    }}
                    onSubmit={handleCreateTarefa}
                    loading={loadingCreate}
                    materias={materias}
                    initialDate={tarefaInitialDate}
                />

                <CreateEventoModal
                    isOpen={showCreateEventoModal}
                    onClose={() => {
                        setShowCreateEventoModal(false)
                        setEventoInitialDate(null)
                    }}
                    onSubmit={handleCreateEvento}
                    loading={loadingCreate}
                    initialDate={eventoInitialDate}
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
