import { useState } from 'react'
import { loginUser } from '@/services/api/api_usuario.js'

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

    function handleChange(e) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
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
                    window.location.href = '/dashboard'
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
        <div className="w-full max-w-md rounded-2xl border border-[#E8E8DF] bg-white/70 p-8 shadow-sm">

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="text-sm">E-mail</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border px-4 py-3"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm">Senha</label>
                    <input
                        name="senha"
                        type="password"
                        value={formData.senha}
                        onChange={handleChange}
                        className="w-full rounded-xl border px-4 py-3"
                        required
                    />
                </div>

                {feedback.message && (
                    <div className={`p-3 rounded-xl text-sm ${
                        feedback.type === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {feedback.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white rounded-xl py-3"
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>

            </form>
        </div>
    )
}