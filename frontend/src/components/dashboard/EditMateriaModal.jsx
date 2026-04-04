// MUDANÇAS:
// 1. Mesma correção do CreateMateriaModal: onClose via ref para estabilizar o listener.
// 2. Ordem das condições no useEffect reorganizada para early return limpo.
// 3. setTimeout para focus mantido (necessário para garantir render completo após abertura).
// 4. Dependências do useEffect simplificadas: [isOpen, materia] — onClose removido (via ref).

import { useEffect, useRef, useState } from 'react'

const initialForm = {
    nome: '',
    descricao: '',
    color_hex: '#F8FF97',
}

export default function EditMateriaModal({ isOpen, materia, onClose, onSubmit, loading = false }) {
    const [formData, setFormData] = useState(initialForm)
    const [error, setError] = useState('')
    const firstInputRef = useRef(null)

    // Ref estável para onClose: evita re-registro do listener a cada re-render do pai
    const onCloseRef = useRef(onClose)
    useEffect(() => { onCloseRef.current = onClose }, [onClose])

    useEffect(() => {
        if (!isOpen || !materia) {
            setFormData(initialForm)
            setError('')
            return
        }

        // Popula o form com os dados atuais da matéria
        setFormData({
            nome: materia.nome || '',
            descricao: materia.descricao || '',
            color_hex: materia.color_hex || '#F8FF97',
        })

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        // setTimeout garante que o DOM terminou de renderizar antes do focus
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
    }, [isOpen, materia]) // MELHORIA: onClose removido das dependências (agora via ref)

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    async function handleSubmit(event) {
        event.preventDefault()

        // BUG FIX: validações antes de montar payload
        if (!materia?.id) {
            setError('Matéria inválida para edição.')
            return
        }

        const payload = {
            id: materia.id,
            nome: formData.nome.trim(),
            descricao: formData.descricao.trim(),
            color_hex: formData.color_hex,
        }

        if (!payload.nome) {
            setError('Informe um nome para a matéria.')
            return
        }

        await onSubmit(payload)
    }

    if (!isOpen || !materia) return null

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-materia-title"
                className="w-full max-w-xl rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Matérias</p>
                        <h2 id="edit-materia-title" className="mt-3 font-serif-display text-4xl tracking-[-0.03em] text-[#1A1A1A]">Editar matéria</h2>
                        <p className="mt-3 text-sm leading-7 text-[#5A5A52]">Atualize os dados da matéria selecionada.</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-sm text-[#8A8A80] transition hover:text-[#1A1A1A]">Fechar</button>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="edit_nome" className="mb-2 block text-sm font-medium text-[#3F3F39]">Nome</label>
                        <input
                            ref={firstInputRef}
                            id="edit_nome"
                            name="nome"
                            type="text"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Ex.: Engenharia de Software"
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="edit_descricao" className="mb-2 block text-sm font-medium text-[#3F3F39]">Descrição</label>
                        <textarea
                            id="edit_descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Opcional"
                            rows={4}
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit_color_hex" className="mb-2 block text-sm font-medium text-[#3F3F39]">Cor</label>
                        <input
                            id="edit_color_hex"
                            name="color_hex"
                            type="color"
                            value={formData.color_hex}
                            onChange={handleChange}
                            className="h-12 w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-2 py-2"
                        />
                    </div>

                    {error && <p className="text-sm text-[#7A2E2E]">{error}</p>}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="rounded-xl border border-[#CBCBC2] px-4 py-3 text-sm text-[#1A1A1A] transition hover:bg-[#F0F0E8]">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A] disabled:opacity-70">
                            {loading ? 'Salvando...' : 'Salvar alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        // teste
    )
}