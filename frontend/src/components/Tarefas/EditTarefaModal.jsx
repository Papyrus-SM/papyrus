import { useEffect, useRef, useState } from 'react'

const initialForm = {
    titulo: '',
    descricao: '',
    dificuldade: 'facil',
    data_entrega: '',
    materia_id: '',
    concluida: false,
}

export default function EditTarefaModal({ isOpen, tarefa, onClose, onSubmit, loading = false, materias = [] }) {
    const [formData, setFormData] = useState(initialForm)
    const [error, setError] = useState('')
    const firstInputRef = useRef(null)

    const onCloseRef = useRef(onClose)
    useEffect(() => { onCloseRef.current = onClose }, [onClose])

    useEffect(() => {
        if (!isOpen || !tarefa) {
            setFormData(initialForm)
            setError('')
            return
        }

        setFormData({
            titulo: tarefa.titulo || '',
            descricao: tarefa.descricao || '',
            dificuldade: tarefa.dificuldade || 'facil',
            data_entrega: tarefa.data_entrega || '',
            materia_id: tarefa.materia?.id || '',
            concluida: tarefa.concluida || false,
        })

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
    }, [isOpen, tarefa])

    function handleChange(event) {
        const { name, value, type, checked } = event.target
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
        if (error) setError('')
    }

    async function handleSubmit(event) {
        event.preventDefault()

        if (!tarefa?.id) {
            setError('Tarefa inválida para edição.')
            return
        }

        const payload = {
            tarefa_id: tarefa.id,
            titulo: formData.titulo.trim(),
            descricao: formData.descricao.trim() || null,
            dificuldade: formData.dificuldade,
            data_entrega: formData.data_entrega || null,
            materia_id: Number(formData.materia_id),
            concluida: formData.concluida,
        }

        if (!payload.titulo) {
            setError('Informe um título para a tarefa.')
            return
        }

        if (!payload.materia_id) {
            setError('Selecione uma matéria.')
            return
        }

        await onSubmit(payload)
    }

    if (!isOpen || !tarefa) return null

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-tarefa-title"
                className="w-full max-w-xl rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">Tarefas</p>
                        <h2 id="edit-tarefa-title" className="mt-3 font-serif-display text-4xl tracking-[-0.03em] text-[#1A1A1A]">Editar tarefa</h2>
                        <p className="mt-3 text-sm leading-7 text-[#5A5A52]">Atualize os dados da tarefa selecionada.</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-sm text-[#8A8A80] transition hover:text-[#1A1A1A]">Fechar</button>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="edit_titulo" className="mb-2 block text-sm font-medium text-[#3F3F39]">Título</label>
                        <input
                            ref={firstInputRef}
                            id="edit_titulo"
                            name="titulo"
                            type="text"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Ex.: Lista de exercícios cap. 3"
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="edit_materia_select" className="mb-2 block text-sm font-medium text-[#3F3F39]">Matéria</label>
                        <select
                            id="edit_materia_select"
                            name="materia_id"
                            value={formData.materia_id}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                            required
                        >
                            <option value="">Selecione uma matéria</option>
                            {materias.map((m) => (
                                <option key={m.id} value={m.id}>{m.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="edit_dificuldade" className="mb-2 block text-sm font-medium text-[#3F3F39]">Dificuldade</label>
                        <select
                            id="edit_dificuldade"
                            name="dificuldade"
                            value={formData.dificuldade}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        >
                            <option value="facil">Fácil</option>
                            <option value="medio">Médio</option>
                            <option value="dificil">Difícil</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="edit_descricao" className="mb-2 block text-sm font-medium text-[#3F3F39]">Descrição</label>
                        <textarea
                            id="edit_descricao"
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Opcional"
                            rows={3}
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit_data_entrega" className="mb-2 block text-sm font-medium text-[#3F3F39]">Data de entrega</label>
                        <input
                            id="edit_data_entrega"
                            name="data_entrega"
                            type="date"
                            value={formData.data_entrega}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            id="edit_concluida"
                            name="concluida"
                            type="checkbox"
                            checked={formData.concluida}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-[#D9D9D0] accent-[#1A1A1A]"
                        />
                        <label htmlFor="edit_concluida" className="text-sm font-medium text-[#3F3F39]">Marcar como concluída</label>
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
    )
}