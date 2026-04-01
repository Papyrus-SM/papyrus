import { useState } from 'react'
import { registerUser } from '@/services/api/api_usuario.js'

const initialForm = {
    nome: '',
    email: '',
    senha: '',
    data_nascimento: '',
    genero: '',
}

export default function RegisterForm() {
    const [formData, setFormData] = useState(initialForm)
    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState({
        type: '',
        message: '',
    })

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setLoading(true)
        setFeedback({ type: '', message: '' })

        try {
            const data = await registerUser(formData)

            if (data.status === 'ok') {
                setFeedback({
                    type: 'success',
                    message: data.mensagem || 'Usuário cadastrado com sucesso.',
                })

                setFormData(initialForm)
            } else {
                setFeedback({
                    type: 'error',
                    message: data.mensagem || 'Não foi possível realizar o cadastro.',
                })
            }
        } catch (error) {
            setFeedback({
                type: 'error',
                message: 'Erro ao conectar com o servidor.',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md rounded-2xl border border-[#E8E8DF] bg-white/70 p-8 shadow-sm backdrop-blur-sm">
            <div className="mb-8">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8A8A80]">
                    Criar conta
                </p>

                <h2 className="font-serif-display text-4xl tracking-[-0.03em] text-[#1A1A1A]">
                    Comece no Papyrus
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#5A5A52]">
                    Organize seus estudos, metas, calendário e rotina em um só lugar.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="nome"
                        className="mb-2 block text-sm font-medium text-[#3F3F39]"
                    >
                        Nome
                    </label>
                    <input
                        id="nome"
                        name="nome"
                        type="text"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                        className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-[#3F3F39]"
                    >
                        E-mail
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="voce@email.com"
                        className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="senha"
                        className="mb-2 block text-sm font-medium text-[#3F3F39]"
                    >
                        Senha
                    </label>
                    <input
                        id="senha"
                        name="senha"
                        type="password"
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder="Mínimo de 6 caracteres"
                        className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="data_nascimento"
                        className="mb-2 block text-sm font-medium text-[#3F3F39]"
                    >
                        Data de nascimento
                    </label>
                    <input
                        id="data_nascimento"
                        name="data_nascimento"
                        type="date"
                        value={formData.data_nascimento}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        required
                    />
                </div>

                <div>
                    <label
                        htmlFor="genero"
                        className="mb-2 block text-sm font-medium text-[#3F3F39]"
                    >
                        Gênero
                    </label>
                    <select
                        id="genero"
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        required
                    >
                        <option value="">Selecione</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="prefiro_nao_dizer">Prefiro não dizer</option>
                    </select>
                </div>

                {feedback.message && (
                    <div
                        className={`rounded-xl border px-4 py-3 text-sm ${
                            feedback.type === 'success'
                                ? 'border-[#D6E7D4] bg-[#F4FAF2] text-[#355B35]'
                                : 'border-[#E7D4D4] bg-[#FBF3F3] text-[#7A2E2E]'
                        }`}
                    >
                        {feedback.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-8 py-3.5 text-[15px] font-medium tracking-[0.01em] text-[#FAFAF7] transition duration-200 hover:-translate-y-[1px] hover:bg-[#2E2E2E] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Criando conta...' : 'Criar conta'}
                </button>

                <a
                    href="/login"
                    className="block w-full rounded-xl border border-[#CBCBC2] bg-transparent px-8 py-3.5 text-center text-[15px] font-normal tracking-[0.01em] text-[#1A1A1A] transition duration-200 hover:-translate-y-[1px] hover:border-[#1A1A1A] hover:bg-[#F0F0E8]"
                >
                    Já tenho uma conta
                </a>
            </form>
        </div>
    )
}