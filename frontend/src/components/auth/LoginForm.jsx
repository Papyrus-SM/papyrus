import { useState } from 'react'
import { loginUser } from '@/services/api/api_usuario.js'
import FormFeedback from './FormFeedback'

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
    })

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
            const data = await loginUser(formData)

            if (data.status === 'ok') {
                localStorage.setItem('papyrus_user', JSON.stringify(data.data.usuario))

                setFeedback({
                    type: 'success',
                    message: data.mensagem || 'Login realizado com sucesso.',
                })

                setTimeout(() => {
                    const destino =
                        data?.data?.usuario?.papel === 'admin' ? '/admin' : '/dashboard'

                    window.location.href = destino
                }, 600)
            } else {
                setFeedback({
                    type: 'error',
                    message: data.mensagem || 'Erro ao fazer login.',
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
                    Entrar
                </p>

                <h2 className="font-serif-display text-4xl tracking-[-0.03em] text-[#1A1A1A]">
                    Acesse sua conta
                </h2>

                <p className="mt-3 text-sm leading-7 text-[#5A5A52]">
                    Continue sua organização acadêmica a partir do seu ambiente personalizado.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder="Digite sua senha"
                        className="w-full rounded-xl border border-[#D9D9D0] bg-[#FAFAF7] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#1A1A1A]"
                        required
                    />
                </div>

                <FormFeedback
                    type={feedback.type}
                    message={feedback.message}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-8 py-3.5 text-[15px] font-medium tracking-[0.01em] text-[#FAFAF7] transition duration-200 hover:-translate-y-[1px] hover:bg-[#2E2E2E] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>

                <a
                    href="/register"
                    className="block w-full rounded-xl border border-[#CBCBC2] bg-transparent px-8 py-3.5 text-center text-[15px] font-normal tracking-[0.01em] text-[#1A1A1A] transition duration-200 hover:-translate-y-[1px] hover:border-[#1A1A1A] hover:bg-[#F0F0E8]"
                >
                    Criar conta
                </a>
            </form>
        </div>
    )
}