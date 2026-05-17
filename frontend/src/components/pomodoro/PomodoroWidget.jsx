import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePomodoro } from '@/contexts/PomodoroContext'

const BASE_RADIUS = 32
const BASE_CIRCUMFERENCE = 2 * Math.PI * BASE_RADIUS

const MIN_SCALE = 0.7
const MAX_SCALE = 2.2
const DRAG_SENSITIVITY = 180 // px por unidade de scale

export default function PomodoroWidget() {
    const { isRunning, timeDisplay, progress, phase, handleStartPause } = usePomodoro()
    const location = useLocation()
    const navigate = useNavigate()

    const [scale, setScale] = useState(1)
    const dragStartRef = useRef(null)

    if (!isRunning || location.pathname === '/metodos/pomodoro') return null

    const strokeDashoffset = BASE_CIRCUMFERENCE * (1 - progress)
    const isDone = phase === 'done'

    function handleDragStart(e) {
        e.preventDefault()
        dragStartRef.current = { y: e.clientY, startScale: scale }

        function onMove(ev) {
            const delta = dragStartRef.current.y - ev.clientY
            const next = dragStartRef.current.startScale + delta / DRAG_SENSITIVITY
            setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, next)))
        }

        function onUp() {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
            dragStartRef.current = null
        }

        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
    }

    return (
        <div
            className="fixed bottom-6 right-6 z-50"
            style={{ transformOrigin: 'bottom right', transform: `scale(${scale})` }}
        >
            <div className="overflow-hidden rounded-2xl border border-[#E8E8DF] bg-white shadow-xl">

                {/* Drag para redimensionar o tamanho ao usuario */}
                <div
                    onPointerDown={handleDragStart}
                    className="flex cursor-ns-resize select-none items-center justify-center py-2 transition hover:bg-[#F5F5F0]"
                    title="Arraste para cima/baixo para redimensionar"
                >
                    <div className="h-[3px] w-8 rounded-full bg-[#D8D8CF]" />
                </div>

                
                <div className="flex items-center gap-4 px-5 pb-5">

                    {/* Widget com o timer do pomodoro estilizado */}
                    <div className="relative flex-shrink-0">
                        <svg width="76" height="76" style={{ transform: 'rotate(-90deg)' }}>
                            <circle
                                cx="38" cy="38" r={BASE_RADIUS}
                                fill="none"
                                stroke="#EEEEE8"
                                strokeWidth="5"
                            />
                            <circle
                                cx="38" cy="38" r={BASE_RADIUS}
                                fill="none"
                                stroke={isDone ? '#22C55E' : '#1A1A1A'}
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeDasharray={BASE_CIRCUMFERENCE}
                                strokeDashoffset={strokeDashoffset}
                                style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[11px] font-medium tabular-nums text-[#1A1A1A]">
                                {timeDisplay}
                            </span>
                        </div>
                    </div>

                    {/* Setor de controles do widget */}
                    <div className="flex flex-col gap-2.5">
                        <div>
                            <p className="text-[11px] font-medium text-[#1A1A1A]">Pomodoro</p>
                            <p className="text-[10px] text-[#8A8A80]">Em andamento</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleStartPause}
                                className="rounded-lg border border-[#E8E8DF] px-3 py-1.5 text-[11px] text-[#4E4E47] transition hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                            >
                                Pausar
                            </button>
                            <button
                                onClick={() => navigate('/metodos/pomodoro')}
                                className="rounded-lg bg-[#1A1A1A] px-3 py-1.5 text-[11px] text-[#FAFAF7] transition hover:bg-[#2E2E2A]"
                            >
                                Abrir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
