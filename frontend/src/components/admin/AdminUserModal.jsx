import { useEffect, useRef, useState } from 'react'

const initialForm = {
    id: null,
    nome: '',
    email: '',
    data_nascimento: '',
    genero: '',
    papel: 'estudante',
}

export default function AdminUserModal({
                                           isOpen,
                                           userData,
                                           onClose,
                                           onSubmit,
                                           onDelete,
                                           loading = false,
                                           loadingDelete = false,
                                       }) {
    const [formData, setFormData] = useState(initialForm)
    const [error, setError] = useState('')
    const firstInputRef = useRef(null)
    const onCloseRef = useRef(onClose)

    useEffect(() => {
        onCloseRef.current = onClose
    }, [onClose])

    useEffect(() => {
        if (!isOpen || !userData) {
            setFormData(initialForm)
            setError('')
            return
        }

        setFormData({
            id: userData.id,
            nome: userData.nome || '',
            email: userData.email || '',
            data_nascimento: userData.data_nascimento || '',
            genero: userData.genero || '',
            papel: userData.papel || 'estudante',
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
    }, [isOpen, userData])

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (error) setError('')
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const payload = {
            id: formData.id,
            nome: formData.nome.trim(),
            papel: formData.papel,
        }

        if (!payload.id) {
            setError('Usuário inválido.')
            return
        }

        if (!payload.nome) {
            setError('O nome é obrigatório.')
            return
        }

        await onSubmit(payload)
    }

    async function handleDelete() {
        if (!formData.id) return

        const confirmou = window.confirm(`Deseja excluir o usuário "${formData.nome}"?`)
        if (!confirmou) return

        await onDelete({ id: formData.id })
    }

    if (!isOpen || !userData) return null

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm"
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-user-modal-title"
                className="w-full max-w-xl rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                            Administração
                        </p>
                        <h2
                            id="admin-user-modal-title"
                            className="mt-3 font-serif-display text-4xl tracking-[-0.03em] text-[#1A1A1A]"
                        >
                            Editar usuário
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-[#5A5A52]">
                            Atualize o nome e o papel do usuário selecionado.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-[#8A8A80] transition hover:text-[#1A1A1A]"
                    >
                        Fechar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label
                            htmlFor="admin_nome"
                            className="mb-2 block text-sm font-medium text-[#3F3F39]"
                        >
                            Nome
                        </label>
                        <input
                            ref={firstInputRef}
                            id="admin_nome"
                            name="nome"
                            type="text"
                            value={formData.nome}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="admin_email"
                            className="mb-2 block text-sm font-medium text-[#3F3F39]"
                        >
                            E-mail
                        </label>
                        <input
                            id="admin_email"
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full rounded-xl border border-[#E2E2D9] bg-[#F2F2EC] px-4 py-3 text-sm text-[#6D6D65] outline-none"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="admin_data_nascimento"
                                className="mb-2 block text-sm font-medium text-[#3F3F39]"
                            >
                                Data de nascimento
                            </label>
                            <input
                                id="admin_data_nascimento"
                                type="text"
                                value={formData.data_nascimento || 'Não informado'}
                                disabled
                                className="w-full rounded-xl border border-[#E2E2D9] bg-[#F2F2EC] px-4 py-3 text-sm text-[#6D6D65] outline-none"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="admin_genero"
                                className="mb-2 block text-sm font-medium text-[#3F3F39]"
                            >
                                Gênero
                            </label>
                            <input
                                id="admin_genero"
                                type="text"
                                value={formData.genero || 'Não informado'}
                                disabled
                                className="w-full rounded-xl border border-[#E2E2D9] bg-[#F2F2EC] px-4 py-3 text-sm text-[#6D6D65] outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="admin_papel"
                            className="mb-2 block text-sm font-medium text-[#3F3F39]"
                        >
                            Papel
                        </label>
                        <select
                            id="admin_papel"
                            name="papel"
                            value={formData.papel}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        >
                            <option value="estudante">Estudante</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    {error && (
                        <p className="text-sm text-[#7A2E2E]">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-wrap justify-between gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loadingDelete}
                            className="rounded-xl border border-[#D9CACA] px-4 py-3 text-sm text-[#7A2E2E] transition hover:bg-[#FBF3F3] disabled:opacity-70"
                        >
                            {loadingDelete ? 'Excluindo...' : 'Excluir usuário'}
                        </button>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-[#CBCBC2] px-4 py-3 text-sm text-[#1A1A1A] transition hover:bg-[#F0F0E8]"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A] disabled:opacity-70"
                            >
                                {loading ? 'Salvando...' : 'Salvar alterações'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}