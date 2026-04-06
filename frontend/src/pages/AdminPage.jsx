import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminUserModal from '@/components/admin/AdminUserModal'
import { listAdminUsers, editAdminUser, deleteAdminUser } from '@/services/api/api_usuario.js'

export default function AdminPage() {
    const [user, setUser] = useState(null)
    const [usuarios, setUsuarios] = useState([])
    const [loadingUsuarios, setLoadingUsuarios] = useState(true)
    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [loadingForm, setLoadingForm] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    const navigate = useNavigate()

    const loadUsuarios = useCallback(async () => {
        try {
            setLoadingUsuarios(true)

            const data = await listAdminUsers()

            if (data.status === 'ok') {
                setUsuarios(data.data.usuarios || [])
            } else {
                alert(data.mensagem || 'Não foi possível carregar os usuários.')
                setUsuarios([])
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error)
            setUsuarios([])
        } finally {
            setLoadingUsuarios(false)
        }
    }, [])

    useEffect(() => {
        const storedUser = localStorage.getItem('papyrus_user')

        if (!storedUser) {
            navigate('/login')
            return
        }

        try {
            const parsedUser = JSON.parse(storedUser)

            if (parsedUser?.papel !== 'admin') {
                navigate('/dashboard')
                return
            }

            setUser(parsedUser)
        } catch {
            localStorage.removeItem('papyrus_user')
            navigate('/login')
        }
    }, [navigate])

    useEffect(() => {
        if (!user) return
        loadUsuarios()
    }, [user, loadUsuarios])

    function handleOpenUser(usuario) {
        setSelectedUser(usuario)
        setShowModal(true)
    }

    function handleCloseModal() {
        setShowModal(false)
        setSelectedUser(null)
    }

    async function handleEditUser(payload) {
        try {
            setLoadingForm(true)

            const data = await editAdminUser(payload)

            if (data.status === 'ok') {
                const usuarioAtualizado = data.data.usuario

                setUsuarios((prev) =>
                    prev.map((item) =>
                        item.id === usuarioAtualizado.id ? usuarioAtualizado : item
                    )
                )

                if (user?.id === usuarioAtualizado.id) {
                    const updatedLoggedUser = {
                        ...user,
                        nome: usuarioAtualizado.nome,
                        papel: usuarioAtualizado.papel,
                    }

                    setUser(updatedLoggedUser)
                    localStorage.setItem('papyrus_user', JSON.stringify(updatedLoggedUser))

                    if (usuarioAtualizado.papel !== 'admin') {
                        handleCloseModal()
                        navigate('/dashboard')
                        return
                    }
                }

                handleCloseModal()
            } else {
                alert(data.mensagem || 'Não foi possível editar o usuário.')
            }
        } catch (error) {
            console.error('Erro ao editar usuário:', error)
            alert('Ocorreu um erro ao editar o usuário.')
        } finally {
            setLoadingForm(false)
        }
    }

    async function handleDeleteUser(payload) {
        try {
            setLoadingDelete(true)

            const data = await deleteAdminUser(payload)

            if (data.status === 'ok') {
                setUsuarios((prev) => prev.filter((item) => item.id !== payload.id))
                handleCloseModal()
            } else {
                alert(data.mensagem || 'Não foi possível excluir o usuário.')
            }
        } catch (error) {
            console.error('Erro ao excluir usuário:', error)
            alert('Ocorreu um erro ao excluir o usuário.')
        } finally {
            setLoadingDelete(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <div className="flex">
                <AdminSidebar user={user} setUser={setUser} />

                <div className="min-h-screen flex-1">
                    <DashboardHeader
                        eyebrow="Administração"
                        title="Gerenciamento de usuários"
                    />

                    <div className="space-y-8 px-8 py-8">
                        <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-[#8A8A80]">
                                Usuários
                            </p>

                            <h2 className="mt-4 font-serif-display text-[clamp(30px,4vw,44px)] leading-[1.05] tracking-[-0.03em] text-[#1A1A1A]">
                                Contas cadastradas
                            </h2>

                            <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#5A5A52]">
                                Visualize os usuários existentes, edite informações essenciais
                                e mantenha o controle administrativo da plataforma.
                            </p>

                            <div className="mt-8">
                                {loadingUsuarios && (
                                    <p className="text-sm text-[#8A8A80]">
                                        Carregando usuários...
                                    </p>
                                )}

                                {!loadingUsuarios && usuarios.length === 0 && (
                                    <div className="rounded-2xl border border-dashed border-[#D9D9D0] bg-[#FAFAF7] px-6 py-8">
                                        <p className="text-sm leading-7 text-[#5A5A52]">
                                            Nenhum usuário encontrado.
                                        </p>
                                    </div>
                                )}

                                {!loadingUsuarios && usuarios.length > 0 && (
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        {usuarios.map((usuario) => (
                                            <article
                                                key={usuario.id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => handleOpenUser(usuario)}
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Enter' || event.key === ' ') {
                                                        event.preventDefault()
                                                        handleOpenUser(usuario)
                                                    }
                                                }}
                                                className="cursor-pointer rounded-2xl border border-[#E8E8DF] bg-[#FAFAF7] p-5 transition hover:-translate-y-[1px] hover:border-[#D4D4CB] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <h3 className="text-lg font-medium text-[#1A1A1A]">
                                                        {usuario.nome}
                                                    </h3>

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${
                                                            usuario.papel === 'admin'
                                                                ? 'bg-[#1A1A1A] text-[#FAFAF7]'
                                                                : 'bg-[#ECECE4] text-[#4E4E47]'
                                                        }`}
                                                    >
                                                        {usuario.papel}
                                                    </span>
                                                </div>

                                                <p className="mt-3 break-all text-sm leading-6 text-[#5A5A52]">
                                                    {usuario.email}
                                                </p>

                                                <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[#8A8A80]">
                                                    Clique para visualizar e editar
                                                </p>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <AdminUserModal
                isOpen={showModal}
                userData={selectedUser}
                onClose={handleCloseModal}
                onSubmit={handleEditUser}
                onDelete={handleDeleteUser}
                loading={loadingForm}
                loadingDelete={loadingDelete}
            />
        </main>
    )
}