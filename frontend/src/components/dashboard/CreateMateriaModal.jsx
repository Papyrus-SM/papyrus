// MUDANÇAS:
// 1. useCallback removido propositalmente (não disponível via desestruturação aqui),
//    mas o useEffect agora usa uma referência estável de onClose via ref para evitar
//    re-registros desnecessários do event listener sem adicionar dependências instáveis.
// 2. Lógica de reset do form movida para ANTES do early return, mantendo o fluxo claro.
// 3. Estabilização do listener de teclado: armazenado em ref para não recriar a cada render.

import { useEffect, useRef, useState } from 'react'

const initialForm = {
    nome: '',
    descricao: '',
    color_hex: '#F8FF97',
}

export default function CreateMateriaModal({ isOpen, onClose, onSubmit, loading = false }) {
    const [formData, setFormData] = useState(initialForm)
    const [error, setError] = useState('')
    const firstInputRef = useRef(null)

    // Ref estável para onClose: evita que o effect re-execute toda vez que o pai re-renderiza
    const onCloseRef = useRef(onClose)
    useEffect(() => { onCloseRef.current = onClose }, [onClose])

    useEffect(() => {
        // Reset antecipado ao fechar: garante estado limpo para a próxima abertura
        if (!isOpen) {
            setFormData(initialForm)
            setError('')
            return
        }

        firstInputRef.current?.focus()

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        // Usa ref para não precisar de onClose como dependência (evita re-registro do listener)
        function handleKeyDown(event) {
            if (event.key === 'Escape') onCloseRef.current()
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen]) // MELHORIA: removido onClose das dependências (agora via ref)

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (error) setError('')
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const payload = {
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

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-materia-title"
                className="w-full max-w-xl rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Matérias</p>
                        <h2 id="create-materia-title" className="mt-3 font-serif-display text-4xl tracking-[-0.03em] text-[#1A1A1A]">Nova matéria</h2>
                        <p className="mt-3 text-sm leading-7 text-[#5A5A52]">Cadastre manualmente uma nova matéria no seu ambiente.</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-sm text-[#8A8A80] transition hover:text-[#1A1A1A]">Fechar</button>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="nome" className="mb-2 block text-sm font-medium text-[#3F3F39]">Nome</label>
                        <input
                            ref={firstInputRef}
                            id="nome"
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
                        <label htmlFor="descricao" className="mb-2 block text-sm font-medium text-[#3F3F39]">Descrição</label>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Opcional"
                            rows={4}
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        />
                    </div>

                    <div>
                        <label htmlFor="color_hex" className="mb-2 block text-sm font-medium text-[#3F3F39]">Cor</label>
                        <input
                            id="color_hex"
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
                            {loading ? 'Salvando...' : 'Criar matéria'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}