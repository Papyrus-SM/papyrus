import { useState } from 'react'
import { registerUser } from '@/services/api/api_usuario.js'
import FormFeedback from './FormFeedback'

const initialForm = {
    nome: '',
    email: '',
    senha: '',
    data_nascimento: '',
    genero: '',
}

export default function RegisterForm() {
    /*
        Estado principal do formulário de cadastro.
        Armazena os dados preenchidos pelo usuário.
    */
    const [formData, setFormData] = useState(initialForm)

    /*
        Estado de carregamento durante o envio do cadastro.
    */
    const [loading, setLoading] = useState(false)

    /*
        Estado de feedback visual.
        Exibe mensagens de sucesso ou erro.
    */
    const [feedback, setFeedback] = useState({
        type: '',
        message: '',
    })

    /*
        Atualiza o estado do formulário conforme o usuário digita ou seleciona um valor.
    */
    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    /*
        Envia os dados para a API de cadastro.
        Em caso de sucesso, limpa os campos e exibe feedback.
    */
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
        /*
            Card visual do formulário de cadastro.
            Reúne a apresentação e os campos de criação de conta.
        */
        <div className="w-full max-w-md rounded-2xl border border-[#E8E8DF] bg-white/70 p-8 shadow-sm backdrop-blur-sm">
            {/*
                Bloco introdutório do formulário.
                Apresenta a proposta da ação de criar conta no Papyrus.
            */}
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
                {/*
                    Campo de nome completo do usuário.
                */}
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

                {/*
                    Campo de e-mail do usuário.
                */}
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

                {/*
                    Campo de senha.
                    O placeholder informa a regra mínima já aplicada no backend.
                */}
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

                {/*
                    Campo de data de nascimento.
                */}
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

                {/*
                    Campo de gênero.
                    Usa select porque o backend trabalha com um conjunto fechado de opções.
                */}
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

                <FormFeedback
                    type={feedback.type}
                    message={feedback.message}
                />

                {/*
                    Botão principal de envio do cadastro.
                */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-8 py-3.5 text-[15px] font-medium tracking-[0.01em] text-[#FAFAF7] transition duration-200 hover:-translate-y-[1px] hover:bg-[#2E2E2E] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? 'Criando conta...' : 'Criar conta'}
                </button>

                {/*
                    Ação secundária para ir à tela de login.
                */}
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