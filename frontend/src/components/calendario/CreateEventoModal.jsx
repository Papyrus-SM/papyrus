import { useEffect, useRef, useState } from 'react'

const initialForm = {
    titulo: '',
    descricao: '',
    data_evento: '',
    hora_evento: '',
    local: '',
    cor: '#4A90D9',
}

function formatDateForInput(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toISOString().split('T')[0]
}

export default function CreateEventoModal({ isOpen, onClose, onSubmit, loading = false, initialDate = null }) {
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

        setFormData((prev) => ({
            ...prev,
            data_evento: initialDate ? formatDateForInput(initialDate) : prev.data_evento,
        }))

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
    }, [isOpen, initialDate])

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const payload = {
            titulo: formData.titulo.trim(),
            descricao: formData.descricao.trim() || null,
            data_evento: formData.data_evento || null,
            hora_evento: formData.hora_evento || null,
            local: formData.local.trim() || null,
            cor: formData.cor || '#4A90D9',
        }

        if (!payload.titulo) {
            setError('Informe um título para o evento.')
            return
        }

        if (!payload.data_evento) {
            setError('Selecione uma data para o evento.')
            return
        }

        await onSubmit(payload)
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-evento-title"
                className="w-full max-w-xl rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Eventos</p>
                        <h2 id="create-evento-title" className="mt-3 font-serif-display text-4xl tracking-[-0.03em] text-[#1A1A1A]">Novo evento</h2>
                        <p className="mt-3 text-sm leading-7 text-[#5A5A52]">Crie um evento para organizar sua agenda.</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-sm text-[#8A8A80] transition hover:text-[#1A1A1A]">Fechar</button>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="evento_titulo" className="mb-2 block text-sm font-medium text-[#3F3F39]">Título</label>
                        <input
                            ref={firstInputRef}
                            id="evento_titulo"
                            name="titulo"
                            type="text"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Ex.: Encontro de cosplay"
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="evento_descricao" className="mb-2 block text-sm font-medium text-[#3F3F39]">Descrição</label>
                        <textarea
                            id="evento_descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Opcional"
                            rows={3}
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="evento_data" className="mb-2 block text-sm font-medium text-[#3F3F39]">Data</label>
                            <input
                                id="evento_data"
                                name="data_evento"
                                type="date"
                                value={formData.data_evento}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="evento_hora" className="mb-2 block text-sm font-medium text-[#3F3F39]">Hora</label>
                            <input
                                id="evento_hora"
                                name="hora_evento"
                                type="time"
                                value={formData.hora_evento}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="evento_local" className="mb-2 block text-sm font-medium text-[#3F3F39]">Local</label>
                        <input
                            id="evento_local"
                            name="local"
                            type="text"
                            value={formData.local}
                            onChange={handleChange}
                            placeholder="Opcional"
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        />
                    </div>

                    <div>
                        <label htmlFor="evento_cor" className="mb-2 block text-sm font-medium text-[#3F3F39]">Cor</label>
                        <input
                            id="evento_cor"
                            name="cor"
                            type="color"
                            value={formData.cor}
                            onChange={handleChange}
                            className="h-10 w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-2 py-1"
                        />
                    </div>

                    {error && <p className="text-sm text-[#7A2E2E]">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="rounded-xl border border-[#CBCBC2] px-4 py-3 text-sm text-[#1A1A1A] transition hover:bg-[#F0F0E8]">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A] disabled:opacity-70">
                            {loading ? 'Salvando...' : 'Criar evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
