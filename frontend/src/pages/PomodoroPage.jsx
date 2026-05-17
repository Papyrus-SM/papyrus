import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { validateSession } from '@/services/api/api_usuario.js'
import { listTarefas } from '@/services/api/api_tarefas.js'
import { usePomodoro } from '@/contexts/PomodoroContext'

const PRESETS = [
    { label: '25 min', minutes: 25, desc: 'Pomodoro clássico' },
    { label: '45 min', minutes: 45, desc: 'Foco intermediário' },
    { label: '60 min', minutes: 60, desc: 'Sessão longa' },
]

const RADIUS = 135
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function PomodoroPage() {
    const [user, setUser] = useState(null)
    const [loadingPage, setLoadingPage] = useState(true)
    const navigate = useNavigate()

    const {
        selectedMinutes,
        isRunning,
        sessions,
        phase,
        progress,
        timeDisplay,
        linkedTask,
        setLinkedTask,
        handleSelectPreset,
        handleStartPause,
        handleReset,
    } = usePomodoro()

    // Editor modal state
    const [showEditor, setShowEditor] = useState(false)
    const [customMinutes, setCustomMinutes] = useState('')
    const [tarefas, setTarefas] = useState([])
    const [selectedTarefaId, setSelectedTarefaId] = useState('')
    const [loadingTarefas, setLoadingTarefas] = useState(false)

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

    async function openEditor() {
        setCustomMinutes(String(selectedMinutes))
        setSelectedTarefaId(linkedTask ? String(linkedTask.id) : '')
        setShowEditor(true)
        try {
            setLoadingTarefas(true)
            const data = await listTarefas()
            if (data.status === 'ok') setTarefas(data.data || [])
        } catch {
            // silencioso
        } finally {
            setLoadingTarefas(false)
        }
    }

    function closeEditor() {
        setShowEditor(false)
    }

    function handleSave() {
        const mins = parseInt(customMinutes, 10)
        if (!mins || mins < 10 || mins > 60) return
        handleSelectPreset(mins)
        const tarefa = tarefas.find((t) => String(t.id) === selectedTarefaId) || null
        setLinkedTask(tarefa)
        closeEditor()
    }

    const parsedMinutes = parseInt(customMinutes, 10)
    const isTooShort = customMinutes !== '' && !isNaN(parsedMinutes) && parsedMinutes < 10
    const isTooLong = customMinutes !== '' && !isNaN(parsedMinutes) && parsedMinutes > 60
    const isValidInput = customMinutes !== '' && !isNaN(parsedMinutes) && !isTooShort && !isTooLong

    const isDone = phase === 'done'
    const ringColor = isDone ? '#22C55E' : '#1A1A1A'
    const strokeDashoffset = CIRCUMFERENCE * (1 - progress)

    const phaseLabel = isDone
        ? 'Sessão concluída!'
        : isRunning
            ? 'Focando...'
            : 'Pronto para começar'

    const editButton = (
        <button
            onClick={openEditor}
            title="Personalizar sessão"
            className="flex items-center gap-2 rounded-xl border border-[#E8E8DF] bg-white px-4 py-2.5 text-sm text-[#4E4E47] transition hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
        >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Personalizar
        </button>
    )

    return (
        <div className="flex h-screen overflow-hidden bg-[#FAFAF7] text-[#1A1A1A]">
            <DashboardSidebar user={user} setUser={setUser} />

            <div className="flex h-full flex-1 flex-col">
                <DashboardHeader
                    eyebrow="Métodos / Pomodoro"
                    title="Temporizador Pomodoro"
                    actions={editButton}
                />

                {loadingPage ? (
                    <div className="flex flex-1 items-center justify-center">
                        <p className="text-sm text-[#8A8A80]">Validando sessão...</p>
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col overflow-auto px-10 pb-8 pt-6">

                        {/* Presets de minutos */}
                        <div className="mx-auto flex w-full max-w-lg gap-3">
                            {PRESETS.map((preset) => {
                                const active = selectedMinutes === preset.minutes
                                return (
                                    <button
                                        key={preset.minutes}
                                        onClick={() => handleSelectPreset(preset.minutes)}
                                        disabled={isRunning}
                                        className={`flex-1 rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                            active
                                                ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#FAFAF7]'
                                                : 'border-[#E8E8DF] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]'
                                        }`}
                                    >
                                        <div className="text-sm font-medium">{preset.label}</div>
                                        <div className={`mt-0.5 text-[11px] ${active ? 'text-[#CDCDC7]' : 'text-[#8A8A80]'}`}>
                                            {preset.desc}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        {/* Timer centralizado */}
                        <div className="flex flex-1 flex-col items-center justify-center gap-8">

                            <p className="text-xs uppercase tracking-[0.18em] text-[#8A8A80]">
                                {phaseLabel}
                            </p>

                            {/* Tarefa vinculada */}
                            {linkedTask && (
                                <div className="flex items-center gap-2 rounded-xl border border-[#E8E8DF] bg-white px-4 py-2">
                                    <span className="text-xs text-[#8A8A80]">Focando em</span>
                                    <span className="text-xs font-medium text-[#1A1A1A]">{linkedTask.titulo}</span>
                                    <button
                                        onClick={() => setLinkedTask(null)}
                                        className="ml-1 text-[#A3A399] transition hover:text-[#1A1A1A]"
                                        title="Desvincular tarefa"
                                    >
                                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
                                            <path d="M1 1l10 10M11 1L1 11" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Timer circular */}
                            <div className="relative">
                                <svg width="310" height="310" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle
                                        cx="155" cy="155" r={RADIUS}
                                        fill="none"
                                        stroke="#EEEEE8"
                                        strokeWidth="10"
                                    />
                                    <circle
                                        cx="155" cy="155" r={RADIUS}
                                        fill="none"
                                        stroke={ringColor}
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={CIRCUMFERENCE}
                                        strokeDashoffset={strokeDashoffset}
                                        style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
                                    />
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                    <span className="font-serif-display text-7xl tracking-[-0.04em] text-[#1A1A1A]">
                                        {timeDisplay}
                                    </span>
                                    {sessions > 0 && (
                                        <span className="text-xs text-[#8A8A80]">
                                            {sessions} {sessions === 1 ? 'sessão' : 'sessões'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Controles */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleReset}
                                    className="rounded-xl border border-[#E8E8DF] px-6 py-3 text-sm text-[#4E4E47] transition hover:border-[#1A1A1A] hover:bg-[#ECECE4] hover:text-[#1A1A1A]"
                                >
                                    Reiniciar
                                </button>
                                <button
                                    onClick={handleStartPause}
                                    disabled={isDone}
                                    className={`rounded-xl px-12 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                        isRunning
                                            ? 'border border-[#E8E8DF] bg-white text-[#1A1A1A] hover:bg-[#ECECE4]'
                                            : 'bg-[#1A1A1A] text-[#FAFAF7] hover:bg-[#2E2E2A]'
                                    }`}
                                >
                                    {isRunning ? 'Pausar' : 'Iniciar'}
                                </button>
                            </div>
                        </div>

                        {/* Contador de sessões */}
                        {sessions > 0 && (
                            <div className="mx-auto w-full max-w-lg rounded-2xl border border-[#E8E8DF] bg-white px-6 py-4">
                                <p className="text-sm text-[#5A5A52]">
                                    Você completou{' '}
                                    <span className="font-medium text-[#1A1A1A]">
                                        {sessions} {sessions === 1 ? 'pomodoro' : 'pomodoros'}
                                    </span>{' '}
                                    nesta sessão.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de personalização */}
            {showEditor && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/25"
                    onClick={(e) => e.target === e.currentTarget && closeEditor()}
                >
                    <div className="w-full max-w-md rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-2xl">

                        {/* Header do modal */}
                        <div className="mb-7 flex items-start justify-between">
                            <div>
                                <h2 className="font-serif-display text-2xl tracking-[-0.02em] text-[#1A1A1A]">
                                    Personalizar sessão
                                </h2>
                                <p className="mt-1 text-xs text-[#8A8A80]">
                                    Defina a duração e vincule a uma tarefa.
                                </p>
                            </div>
                            <button
                                onClick={closeEditor}
                                className="rounded-xl border border-[#E8E8DF] p-2 text-[#8A8A80] transition hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                            >
                                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                                    <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Campo de duração */}
                        <div className="mb-5">
                            <label className="mb-2 block text-[11px] uppercase tracking-[0.12em] text-[#8A8A80]">
                                Duração personalizada
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    value={customMinutes}
                                    onChange={(e) => setCustomMinutes(e.target.value)}
                                    className={`w-24 rounded-xl border px-4 py-2.5 text-center text-sm outline-none transition ${
                                        isTooShort || isTooLong
                                            ? 'border-amber-400 bg-amber-50 text-amber-800 focus:border-amber-500'
                                            : 'border-[#E8E8DF] bg-[#FAFAF7] text-[#1A1A1A] focus:border-[#1A1A1A]'
                                    }`}
                                    placeholder="25"
                                />
                                <span className="text-sm text-[#8A8A80]">minutos</span>
                            </div>

                            {isTooShort && (
                                <p className="mt-2.5 max-w-xs text-xs leading-5 text-amber-700">
                                    Tempo muito curto para se concentrar. Sessões eficazes precisam de pelo menos 10 minutos contínuos de foco.
                                </p>
                            )}
                            {isTooLong && (
                                <p className="mt-2.5 max-w-xs text-xs leading-5 text-amber-700">
                                    Tempo muito longo. Para uma melhor aprendizagem, prefira sessões menores com intervalos de descanso regulares.
                                </p>
                            )}
                        </div>

                        {/* Campo de tarefa vinculada */}
                        <div className="mb-7">
                            <label className="mb-2 block text-[11px] uppercase tracking-[0.12em] text-[#8A8A80]">
                                Vincular a uma tarefa
                                <span className="ml-1 normal-case tracking-normal text-[#A3A399]">(opcional)</span>
                            </label>
                            <select
                                value={selectedTarefaId}
                                onChange={(e) => setSelectedTarefaId(e.target.value)}
                                disabled={loadingTarefas}
                                className="w-full rounded-xl border border-[#E8E8DF] bg-[#FAFAF7] px-4 py-2.5 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <option value="">Nenhuma tarefa selecionada</option>
                                {tarefas.map((t) => (
                                    <option key={t.id} value={String(t.id)}>
                                        {t.titulo}
                                    </option>
                                ))}
                            </select>
                            {loadingTarefas && (
                                <p className="mt-1.5 text-xs text-[#8A8A80]">Carregando tarefas...</p>
                            )}
                            {!loadingTarefas && tarefas.length === 0 && (
                                <p className="mt-1.5 text-xs text-[#A3A399]">Nenhuma tarefa encontrada.</p>
                            )}
                        </div>

                        {/* Ações */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeEditor}
                                className="rounded-xl border border-[#E8E8DF] px-5 py-2.5 text-sm text-[#4E4E47] transition hover:border-[#1A1A1A] hover:bg-[#ECECE4]"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!isValidInput}
                                className="rounded-xl bg-[#1A1A1A] px-5 py-2.5 text-sm font-medium text-[#FAFAF7] transition hover:bg-[#2E2E2A] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
