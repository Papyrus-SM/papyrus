// MUDANÇAS:
// 1. Mesma correção de estabilidade: onClose via ref no listener de teclado.
// 2. Dependências do useEffect simplificadas: [isOpen, step] — onClose removido (via ref).
// 3. Lógica de handleBackStep simplificada (era redundante com Math.max já que step >= 0 sempre).

import { useEffect, useMemo, useRef, useState } from 'react'

export default function OnboardingModal({ isOpen, onClose, onSkip, onFinish, loading = false }) {
    const [step, setStep] = useState(0)
    const [quantidade, setQuantidade] = useState('')
    const [nomesMaterias, setNomesMaterias] = useState([])
    const firstInputRef = useRef(null)

    // Ref estável para onClose: evita re-registro do listener ao re-renderizar o pai
    const onCloseRef = useRef(onClose)
    useEffect(() => { onCloseRef.current = onClose }, [onClose])

    const totalMaterias = useMemo(() => {
        const numero = Number(quantidade)
        return Number.isInteger(numero) && numero > 0 ? numero : 0
    }, [quantidade])

    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const timer = setTimeout(() => firstInputRef.current?.focus(), 0)

        function handleKeyDown(event) {
            if (event.key === 'Escape') onCloseRef.current()
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            clearTimeout(timer)
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, step]) // Re-executa ao mudar step para focar no novo input; onClose via ref

    function handleNextStep() {
        if (step === 0) {
            setStep(1)
            return
        }

        if (step === 1) {
            if (totalMaterias <= 0) return
            // Preserva nomes já digitados ao navegar para frente e para trás
            setNomesMaterias((prev) => Array.from({ length: totalMaterias }, (_, i) => prev[i] || ''))
            setStep(2)
        }
    }

    // MELHORIA: simplificado — Math.max(prev - 1, 0) é suficiente, sem casos especiais
    function handleBackStep() {
        setStep((prev) => Math.max(prev - 1, 0))
    }

    function handleMateriaChange(index, value) {
        setNomesMaterias((prev) => prev.map((item, i) => (i === index ? value : item)))
    }

    async function handleFinish() {
        const materiasValidas = nomesMaterias
            .map((nome) => nome.trim())
            .filter(Boolean)
            .map((nome) => ({ nome }))

        await onFinish(materiasValidas)
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="onboarding-title"
                className="w-full max-w-2xl rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Onboarding</p>
                        <h2 id="onboarding-title" className="mt-3 font-serif-display text-4xl tracking-[-0.03em] text-[#1A1A1A]">
                            Vamos montar seu ambiente inicial
                        </h2>
                    </div>
                    <button type="button" onClick={onClose} className="text-sm text-[#8A8A80] transition hover:text-[#1A1A1A]">Fechar</button>
                </div>

                <div className="mt-8">
                    {step === 0 && (
                        <div className="space-y-5">
                            <p className="text-[16px] leading-8 text-[#5A5A52]">
                                Vamos fazer algumas perguntas rápidas para deixar seu dashboard mais organizado...
                            </p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-5">
                            <label htmlFor="quantidade_materias" className="block text-sm font-medium text-[#3F3F39]">
                                Quantas matérias você está estudando neste momento?
                            </label>
                            <input
                                ref={firstInputRef}
                                id="quantidade_materias"
                                type="number"
                                min="1"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                                placeholder="Ex.: 5"
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-[16px] leading-8 text-[#5A5A52]">Agora informe o nome de cada matéria.</p>
                            {nomesMaterias.map((nome, index) => (
                                <div key={index}>
                                    <label htmlFor={`materia_${index}`} className="mb-2 block text-sm font-medium text-[#3F3F39]">
                                        Matéria {index + 1}
                                    </label>
                                    <input
                                        ref={index === 0 ? firstInputRef : null}
                                        id={`materia_${index}`}
                                        type="text"
                                        value={nome}
                                        onChange={(e) => handleMateriaChange(index, e.target.value)}
                                        className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                                        placeholder="Digite o nome da matéria"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-3">
                        {step > 0 && (
                            <button type="button" onClick={handleBackStep} className="rounded-xl border border-[#CBCBC2] px-4 py-3 text-sm text-[#1A1A1A] transition hover:bg-[#F0F0E8]">
                                Voltar
                            </button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button type="button" onClick={onSkip} disabled={loading} className="rounded-xl border border-[#CBCBC2] px-4 py-3 text-sm text-[#1A1A1A] transition hover:bg-[#F0F0E8] disabled:opacity-70">
                            Pular
                        </button>

                        {step < 2 ? (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                disabled={step === 1 && totalMaterias <= 0}
                                className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A] disabled:opacity-70"
                            >
                                Próximo
                            </button>
                        ) : (
                            <button type="button" onClick={handleFinish} disabled={loading} className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A] disabled:opacity-70">
                                {loading ? 'Salvando...' : 'Finalizar'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}