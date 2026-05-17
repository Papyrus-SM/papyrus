import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminUserModal from '@/components/admin/AdminUserModal'
import AdminMetricsSection from '@/components/admin/AdminMetricsSection'
import AdminChartsSection from '@/components/admin/AdminChartsSection'
import AdminUsersSection from '@/components/admin/AdminUsersSection'
import {
    listAdminUsers,
    editAdminUser,
    deleteAdminUser,
    getAdminDashboardMetrics,
} from '@/services/api/api_admin.js'

const sectionInfo = {
    metricas: {
        eyebrow: 'Administração',
        title: 'Métricas administrativas',
    },
    graficos: {
        eyebrow: 'Administração',
        title: 'Gráficos administrativos',
    },
    usuarios: {
        eyebrow: 'Administração',
        title: 'Gerenciamento de usuários',
    },
}

export default function AdminPage() {
    const [user, setUser] = useState(null)
    const [usuarios, setUsuarios] = useState([])
    const [analytics, setAnalytics] = useState(null)

    const [activeSection, setActiveSection] = useState('metricas')

    const [loadingUsuarios, setLoadingUsuarios] = useState(true)
    const [loadingAnalytics, setLoadingAnalytics] = useState(true)

    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const [loadingForm, setLoadingForm] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    const navigate = useNavigate()

    const currentSection = useMemo(() => {
        return sectionInfo[activeSection] || sectionInfo.metricas
    }, [activeSection])

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

    const loadAnalytics = useCallback(async () => {
        try {
            setLoadingAnalytics(true)

            const data = await getAdminDashboardMetrics()

            if (data.status === 'ok') {
                setAnalytics(data.data || null)
            } else {
                console.error(data.mensagem || 'Não foi possível carregar as métricas.')
                setAnalytics(null)
            }
        } catch (error) {
            console.error('Erro ao carregar métricas:', error)
            setAnalytics(null)
        } finally {
            setLoadingAnalytics(false)
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
        loadAnalytics()
    }, [user, loadUsuarios, loadAnalytics])

    function handleOpenUser(usuario) {
        setSelectedUser(usuario)
        setShowModal(true)
    }

    function handleCloseModal() {
        setShowModal(false)
        setSelectedUser(null)
    }

    async function refreshAdminData() {
        await Promise.all([
            loadUsuarios(),
            loadAnalytics(),
        ])
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

                await loadAnalytics()
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
                await loadAnalytics()
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

    function renderActiveSection() {
        if (activeSection === 'graficos') {
            return (
                <AdminChartsSection
                    data={analytics}
                    loading={loadingAnalytics}
                />
            )
        }

        if (activeSection === 'usuarios') {
            return (
                <AdminUsersSection
                    usuarios={usuarios}
                    loading={loadingUsuarios}
                    onOpenUser={handleOpenUser}
                />
            )
        }

        return (
            <AdminMetricsSection
                data={analytics}
                loading={loadingAnalytics}
            />
        )
    }

    return (
        <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
            <div className="flex">
                <AdminSidebar
                    user={user}
                    setUser={setUser}
                    activeSection={activeSection}
                    onChangeSection={setActiveSection}
                />

                <div className="min-h-screen flex-1">
                    <DashboardHeader
                        eyebrow={currentSection.eyebrow}
                        title={currentSection.title}
                    />

                    <div className="space-y-8 px-8 py-8">
                        {renderActiveSection()}
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