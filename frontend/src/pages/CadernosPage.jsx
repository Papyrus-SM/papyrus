import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import CadernoMain from '@/components/cadernos/CadernoMain'
import CreateCadernoModal from '@/components/cadernos/CreateCadernoModal'
import FeedbackToast from '@/components/ui/FeedbackToast'
import { listCadernos, createCaderno } from '@/services/api/api_cadernos.js'
import { listMaterias } from '@/services/api/api_materias.js'
import { validateSession } from '@/services/api/api_usuario.js'

export default function CadernosPage() {
    const [user, setUser] = useState(null)
    const [cadernos, setCadernos] = useState([])
    const [materias, setMaterias] = useState([])
    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingCadernos, setLoadingCadernos] = useState(true)

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [loadingCreateCaderno, setLoadingCreateCaderno] = useState(false)

    const [feedback, setFeedback] = useState({ open: false, type: 'success', message: '' })

    const navigate = useNavigate()

    function showFeedback(type, message) {
        setFeedback({ open: true, type, message })
    }

    const bootstrapSession = useCallback(async () => {
        try {
            setLoadingPage(true)
            const storedUser = localStorage.getItem('papyrus_user')
            if (storedUser) {
                try { setUser(JSON.parse(storedUser)) }
                catch { localStorage.removeItem('papyrus_user') }
            }

            const data = await validateSession()
            if (data?.status !== 'ok') {
                localStorage.removeItem('papyrus_user')
                navigate('/login')
                return
            }

            if (data?.data?.usuario) {
                setUser(data.data.usuario)
                localStorage.setItem('papyrus_user', JSON.stringify(data.data.usuario))
            }
        } catch {
            navigate('/login')
        } finally {
            setLoadingPage(false)
        }
    }, [navigate])

    const loadCadernos = useCallback(async () => {
        try {
            setLoadingCadernos(true)
            const data = await listCadernos()
            if (data.status === 'ok') {
                setCadernos(data.data.cadernos || [])
            } else {
                setCadernos([])
                showFeedback('error', data.mensagem || 'Não foi possível carregar os cadernos.')
            }
        } catch {
            setCadernos([])
            showFeedback('error', 'Ocorreu um erro ao carregar os cadernos.')
        } finally {
            setLoadingCadernos(false)
        }
    }, [])

    const loadMaterias2 = useCallback(async () => {
        try {
            const data = await listMaterias()
            if (data.status === 'ok') {
                setMaterias(data.data.materias || [])
            }
        } catch {
            setMaterias([])
        }
    }, [])

    async function handleCreateCaderno(payload) {
        try {
            setLoadingCreateCaderno(true)
            const data = await createCaderno(payload)
            if (data.status === 'ok') {
                await loadCadernos()
                setShowCreateModal(false)
                showFeedback('success', 'Caderno criado com sucesso.')
            } else {
                showFeedback('error', data.mensagem || 'Não foi possível criar o caderno.')
            }
        } catch {
            showFeedback('error', 'Ocorreu um erro ao criar o caderno.')
        } finally {
            setLoadingCreateCaderno(false)
        }
    }

    function handleOpenCaderno(caderno) {
        navigate(`/cadernos/${caderno.id}`)
    }

    useEffect(() => { bootstrapSession() }, [bootstrapSession])
    useEffect(() => {
        if (user) {
            loadCadernos()
            loadMaterias2()
        }
    }, [user, loadCadernos, loadMaterias2])

    return (
        <>
            <main className="min-h-screen bg-[#FAFAF7] text-[#1A1A1A]">
                <div className="flex">
                    <DashboardSidebar user={user} setUser={setUser} />

                    <div className="min-h-screen flex-1">
                        <DashboardHeader eyebrow="Cadernos" title="Seus cadernos" />

                        <div className="px-8 py-8">
                            {loadingPage ? (
                                <section className="rounded-3xl border border-[#E8E8DF] bg-white p-8 shadow-sm">
                                    <p className="text-sm text-[#8A8A80]">Validando sessão...</p>
                                </section>
                            ) : (
                                <CadernoMain
                                    cadernos={cadernos}
                                    loading={loadingCadernos}
                                    onCreateClick={() => setShowCreateModal(true)}
                                    onOpenCaderno={handleOpenCaderno}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <CreateCadernoModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateCaderno}
                    loading={loadingCreateCaderno}
                    materias={materias}
                />
            </main>

            <FeedbackToast
                open={feedback.open}
                type={feedback.type}
                message={feedback.message}
                onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
            />
        </>
    )
}