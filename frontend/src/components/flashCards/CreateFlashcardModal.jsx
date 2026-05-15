import { useEffect, useRef, useState } from 'react'

const initialForm = {
    pergunta: '',
    resposta: '',
}

export default function CreateFlashcardModal({ isOpen, onClose, onSubmit, loading = false }) {
    const [formData, setFormData] = useState(initialForm)
    const [error, setError] = useState('')
    const firstInputRef = useRef(null)

    const onCloseRef = useRef(onClose)
    useEffect(() => { onCloseRef.current = onClose }, [onClose])

    useEffect(() => {
        if (!isOpen) {
            setFormData(initialForm)
            setError('')
            return
        }

        firstInputRef.current?.focus()

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        function handleKeyDown(event) {
            if (event.key === 'Escape') onCloseRef.current()
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen])

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const payload = {
            pergunta: formData.pergunta.trim(),
            resposta: formData.resposta.trim(),
        }

        if (!payload.pergunta) {
            setError('Informe a pergunta da flashcard.')
            return
        }

        if (!payload.resposta) {
            setError('Informe a resposta da flashcard.')
            return
        }

        await onSubmit(payload)
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/15 px-4 py-8 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-flashcard-title"
                className="w-full max-w-xl rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Flashcards</p>
                        <h2 id="create-flashcard-title" className="mt-3 font-serif-display text-4xl tracking-[-0.03em] text-[#1A1A1A]">Criar flashcard</h2>
                        <p className="mt-3 text-sm leading-7 text-[#5A5A52]">Cadastre um novo flashcard com pergunta e resposta.</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-sm text-[#8A8A80] transition hover:text-[#1A1A1A]">Fechar</button>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="pergunta" className="mb-2 block text-sm font-medium text-[#3F3F39]">Pergunta (Frente)</label>
                        <textarea
                            ref={firstInputRef}
                            id="pergunta"
                            name="pergunta"
                            value={formData.pergunta}
                            onChange={handleChange}
                            placeholder="Digite a pergunta da flashcard..."
                            rows={4}
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="resposta" className="mb-2 block text-sm font-medium text-[#3F3F39]">Resposta (Trás)</label>
                        <textarea
                            id="resposta"
                            name="resposta"
                            value={formData.resposta}
                            onChange={handleChange}
                            placeholder="Digite a resposta da flashcard..."
                            rows={4}
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-[#7A2E2E]">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="rounded-xl border border-[#CBCBC2] px-4 py-3 text-sm text-[#1A1A1A] transition hover:bg-[#F0F0E8]">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A] disabled:opacity-70">
                            {loading ? 'Criando...' : 'Criar flashcard'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
