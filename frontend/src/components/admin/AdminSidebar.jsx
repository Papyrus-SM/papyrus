import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '@/services/api/api_usuario.js'

const items = [
    {
        id: 'metricas',
        label: 'Métricas',
        description: 'Resumo geral',
    },
    {
        id: 'graficos',
        label: 'Gráficos',
        description: 'Análises visuais',
    },
    {
        id: 'usuarios',
        label: 'Usuários',
        description: 'Gerenciar contas',
    },
]

export default function AdminSidebar({
    user,
    setUser,
    activeSection,
    onChangeSection,
}) {
    const navigate = useNavigate()
    const [isLeaving, setIsLeaving] = useState(false)

    const nomeCompleto = user?.nome || 'Administrador'
    const primeiroNome = nomeCompleto.split(' ')[0]
    const email = user?.email || 'Sem e-mail'

    async function handleLogout(skipRequest = false) {
        try {
            setIsLeaving(true)

            if (!skipRequest) {
                await logoutUser()
            }

            localStorage.removeItem('papyrus_user')
            setUser?.(null)
            navigate('/')
        } catch (error) {
            console.error('Erro ao sair da conta:', error)
        } finally {
            setIsLeaving(false)
        }
    }

    return (
        <aside className="flex min-h-screen w-65 flex-col border-r border-[#E8E8DF] bg-[#F7F7F2] px-5 py-6">
            <div className="mb-10">
                <div className="font-serif-display text-2xl tracking-[-0.03em] text-[#1A1A1A]">
                    Papyrus
                </div>
                <p className="mt-2 text-sm text-[#8A8A80]">
                    Painel administrativo
                </p>
            </div>

            <nav className="space-y-2">
                {items.map((item) => {
                    const isActive = activeSection === item.id

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => onChangeSection(item.id)}
                            className={`w-full rounded-xl px-4 py-3 text-left transition ${
                                isActive
                                    ? 'bg-[#1A1A1A] text-[#FAFAF7]'
                                    : 'text-[#4E4E47] hover:bg-[#ECECE4] hover:text-[#1A1A1A]'
                            }`}
                        >
                            <span className="block text-sm">
                                {item.label}
                            </span>

                            <span
                                className={`mt-1 block text-xs ${
                                    isActive ? 'text-[#D8D8CF]' : 'text-[#8A8A80]'
                                }`}
                            >
                                {item.description}
                            </span>
                        </button>
                    )
                })}
            </nav>

            <div className="mt-auto space-y-4">
                <div className="rounded-2xl border border-[#E8E8DF] bg-white px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#8A8A80]">
                        Conta ativa
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#1A1A1A]">
                        {primeiroNome}
                    </p>

                    <p className="mt-1 break-all text-sm leading-6 text-[#5A5A52]">
                        {email}
                    </p>

                    <p className="mt-3 inline-flex rounded-full bg-[#1A1A1A] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[#FAFAF7]">
                        Admin
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => handleLogout(false)}
                    disabled={isLeaving}
                    className="w-full rounded-xl border border-[#D8D8CF] bg-transparent px-4 py-3 text-sm text-[#4E4E47] transition hover:border-[#1A1A1A] hover:bg-[#ECECE4] hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isLeaving ? 'Saindo...' : 'Sair'}
                </button>
            </div>
        </aside>
    )
}