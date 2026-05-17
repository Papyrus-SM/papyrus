import { createContext, useContext, useEffect, useRef, useState } from 'react'

const PomodoroContext = createContext(null)

export function PomodoroProvider({ children }) {
    const [selectedMinutes, setSelectedMinutes] = useState(25)
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isRunning, setIsRunning] = useState(false)
    const [sessions, setSessions] = useState(0)
    const [phase, setPhase] = useState('idle') // 'idle' | 'running' | 'done'
    const [linkedTask, setLinkedTask] = useState(null)
    const intervalRef = useRef(null)

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current)
                        setIsRunning(false)
                        setSessions((s) => s + 1)
                        setPhase('done')
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } else {
            clearInterval(intervalRef.current)
        }
        return () => clearInterval(intervalRef.current)
    }, [isRunning])

    function handleSelectPreset(minutes) {
        if (isRunning) return
        setSelectedMinutes(minutes)
        setTimeLeft(minutes * 60)
        setPhase('idle')
    }

    function handleStartPause() {
        if (phase === 'done') return
        setIsRunning((prev) => {
            setPhase(!prev ? 'running' : 'idle')
            return !prev
        })
    }

    function handleReset() {
        clearInterval(intervalRef.current)
        setIsRunning(false)
        setTimeLeft(selectedMinutes * 60)
        setPhase('idle')
    }

    const progress = timeLeft / (selectedMinutes * 60)

    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60
    const timeDisplay = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

    return (
        <PomodoroContext.Provider value={{
            selectedMinutes,
            timeLeft,
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
        }}>
            {children}
        </PomodoroContext.Provider>
    )
}

export function usePomodoro() {
    const ctx = useContext(PomodoroContext)
    if (!ctx) throw new Error('usePomodoro must be used inside PomodoroProvider')
    return ctx
}
