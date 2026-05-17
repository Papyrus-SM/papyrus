import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { listCadernos, editCaderno, deleteCaderno } from '@/services/api/api_cadernos.js'
import { listPaginas, createPagina, editPagina, deletePagina } from '@/services/api/api_paginas.js'
import { validateSession } from '@/services/api/api_usuario.js'
import FeedbackToast from '@/components/ui/FeedbackToast'

export default function CadernoDetalhePage() {
    const [user, setUser] = useState(null)
    const [caderno, setCaderno] = useState(null)
    const [paginas, setPaginas] = useState([])
    const [selectedPagina, setSelectedPagina] = useState(null)

    const [loadingPage, setLoadingPage] = useState(true)
    const [loadingPaginas, setLoadingPaginas] = useState(true)
    const [saving, setSaving] = useState(false)

    const [editTitulo, setEditTitulo] = useState('')
    const [editConteudo, setEditConteudo] = useState('')
    const [hasChanges, setHasChanges] = useState(false)

    const [feedback, setFeedback] = useState({ open: false, type: 'success', message: '' })

    const navigate = useNavigate()
    const { cadernoId } = useParams()

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

    const loadCaderno = useCallback(async () => {
        try {
            const data = await listCadernos()
            if (data.status === 'ok') {
                const found = (data.data.cadernos || []).find(
                    (c) => String(c.id) === String(cadernoId)
                )
                setCaderno(found || null)
            }
        } catch {
            setCaderno(null)
        }
    }, [cadernoId])

    const loadPaginas = useCallback(async () => {
        try {
            setLoadingPaginas(true)
            const data = await listPaginas(cadernoId)
            if (data.status === 'ok') {
                setPaginas(data.data.paginas || [])
            } else {
                setPaginas([])
            }
        } catch {
            setPaginas([])
        } finally {
            setLoadingPaginas(false)
        }
    }, [cadernoId])

    function selectPagina(pagina) {
        setSelectedPagina(pagina)
        setEditTitulo(pagina.titulo || '')
        setEditConteudo(pagina.conteudo || '')
        setHasChanges(false)
    }

    function handleTituloChange(value) {
        setEditTitulo(value)
        setHasChanges(true)
    }

    function handleConteudoChange(value) {
        setEditConteudo(value)
        setHasChanges(true)
    }

    async function handleSavePagina() {
        if (!selectedPagina) return

        try {
            setSaving(true)
            const data = await editPagina({
                id: selectedPagina.id,
                titulo: editTitulo.trim() || 'Sem título',
                conteudo: editConteudo,
            })

            if (data.status === 'ok') {
                setHasChanges(false)
                await loadPaginas()
                showFeedback('success', 'Página salva.')
            } else {
                showFeedback('error', data.mensagem || 'Erro ao salvar.')
            }
        } catch {
            showFeedback('error', 'Erro ao salvar a página.')
        } finally {
            setSaving(false)
        }
    }

    async function handleCreatePagina() {
        const titulo = prompt('Nome da nova página:')
        if (!titulo || !titulo.trim()) return

        try {
            const data = await createPagina({
                caderno_id: cadernoId,
                titulo: titulo.trim(),
            })

            if (data.status === 'ok') {
                await loadPaginas()
                if (data.data?.pagina) {
                    selectPagina(data.data.pagina)
                }
                showFeedback('success', 'Página criada.')
            } else {
                showFeedback('error', data.mensagem || 'Erro ao criar página.')
            }
        } catch {
            showFeedback('error', 'Erro ao criar a página.')
        }
    }

    async function handleDeletePagina(pagina) {
        if (!window.confirm(`Excluir a página "${pagina.titulo}"?`)) return

        try {
            const data = await deletePagina({ id: pagina.id })
            if (data.status === 'ok') {
                if (selectedPagina?.id === pagina.id) {
                    setSelectedPagina(null)
                    setEditTitulo('')
                    setEditConteudo('')
                    setHasChanges(false)
                }
                await loadPaginas()
                showFeedback('success', 'Página excluída.')
            } else {
                showFeedback('error', data.mensagem || 'Erro ao excluir.')
            }
        } catch {
            showFeedback('error', 'Erro ao excluir a página.')
        }
    }

    async function handleDeleteCaderno() {
        if (!caderno) return
        if (!window.confirm(`Excluir o caderno "${caderno.titulo}" e todas as suas páginas?`)) return

        try {
            const data = await deleteCaderno({ id: caderno.id })
            if (data.status === 'ok') {
                navigate('/cadernos')
            } else {
                showFeedback('error', data.mensagem || 'Erro ao excluir o caderno.')
            }
        } catch {
            showFeedback('error', 'Erro ao excluir o caderno.')
        }
    }

    useEffect(() => { bootstrapSession() }, [bootstrapSession])
    useEffect(() => {
        if (user) {
            loadCaderno()
            loadPaginas()
        }
    }, [user, loadCaderno, loadPaginas])

    const cor = caderno?.materia_cor || '#F8FF97'

    if (loadingPage) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
                <p className="text-sm text-[#8A8A80]">Carregando...</p>
            </div>
        )
    }

    if (!caderno && !loadingPage) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAFAF7]">
                <p className="text-[16px] text-[#5A5A52]">Caderno não encontrado.</p>
                <button
                    type="button"
                    onClick={() => navigate('/cadernos')}
                    className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A]"
                >
                    Voltar para cadernos
                </button>
            </div>
        )
    }

    return (
        <>
            <div className="flex min-h-screen bg-[#FAFAF7]">

                {/* Sidebar lateral */}
                <aside className="flex w-70 flex-col border-r border-[#E8E8DF] bg-[#F7F7F2]">

                    {/* Cabeçalho da sidebar */}
                    <div className="border-b border-[#E8E8DF] px-5 py-5">
                        <div className="flex items-center gap-3">
                            <div
                                className="h-3 w-3 rounded-full border border-black/10"
                                style={{ backgroundColor: cor }}
                            />
                            <div>
                                <h2 className="text-sm font-semibold text-[#1A1A1A]">{caderno?.titulo}</h2>
                                <p className="text-xs text-[#8A8A80]">{caderno?.materia_nome}</p>
                            </div>
                        </div>
                    </div>

                    {/* Lista de páginas */}
                    <div className="flex-1 overflow-y-auto px-3 py-3">
                        <p className="mb-2 px-2 text-[10px] uppercase tracking-[0.14em] text-[#8A8A80]">Páginas</p>

                        {loadingPaginas && (
                            <p className="px-2 text-xs text-[#8A8A80]">Carregando...</p>
                        )}

                        {!loadingPaginas && paginas.length === 0 && (
                            <p className="px-2 text-xs text-[#8A8A80]">Nenhuma página criada.</p>
                        )}

                        <nav className="space-y-1">
                            {paginas.map((pagina) => {
                                const isActive = selectedPagina?.id === pagina.id

                                return (
                                    <div key={pagina.id} className="group flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => selectPagina(pagina)}
                                            className={`flex-1 rounded-lg px-3 py-2 text-left text-sm transition ${
                                                isActive
                                                    ? 'bg-[#1A1A1A] text-[#FAFAF7]'
                                                    : 'text-[#4E4E47] hover:bg-[#ECECE4]'
                                            }`}
                                        >
                                            {pagina.titulo}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePagina(pagina)}
                                            className="rounded p-1 text-xs text-[#8A8A80] opacity-0 transition hover:text-[#7A2E2E] group-hover:opacity-100"
                                            title="Excluir página"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Botões da sidebar */}
                    <div className="space-y-2 border-t border-[#E8E8DF] px-4 py-4">
                        <button
                            type="button"
                            onClick={handleCreatePagina}
                            className="w-full rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-2.5 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A]"
                        >
                            + Nova página
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/cadernos')}
                            className="w-full rounded-xl border border-[#D8D8CF] px-4 py-2.5 text-sm text-[#4E4E47] transition hover:bg-[#ECECE4]"
                        >
                            ← Voltar
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteCaderno}
                            className="w-full rounded-xl border border-[#D9CACA] px-4 py-2.5 text-sm text-[#7A2E2E] transition hover:bg-[#FBF3F3]"
                        >
                            Excluir caderno
                        </button>
                    </div>
                </aside>

                {/* Área principal de edição */}
                <main className="flex flex-1 flex-col">

                    {!selectedPagina ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                            <div className="text-4xl opacity-20">📄</div>
                            <p className="text-sm text-[#8A8A80]">
                                {paginas.length === 0
                                    ? 'Crie sua primeira página para começar a escrever.'
                                    : 'Selecione uma página na lateral para editar.'
                                }
                            </p>
                            {paginas.length === 0 && (
                                <button
                                    type="button"
                                    onClick={handleCreatePagina}
                                    className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-3 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A]"
                                >
                                    + Criar primeira página
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Barra do topo com título editável */}
                            <div className="flex items-center justify-between border-b border-[#E8E8DF] px-8 py-4">
                                <input
                                    type="text"
                                    value={editTitulo}
                                    onChange={(e) => handleTituloChange(e.target.value)}
                                    placeholder="Título da página"
                                    className="flex-1 bg-transparent font-serif-display text-2xl tracking-[-0.02em] text-[#1A1A1A] outline-none placeholder:text-[#CBCBC2]"
                                />
                                <div className="flex items-center gap-3">
                                    {hasChanges && (
                                        <span className="text-xs text-[#8A8A80]">Não salvo</span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleSavePagina}
                                        disabled={saving || !hasChanges}
                                        className="rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] px-4 py-2 text-sm text-[#FAFAF7] transition hover:bg-[#2A2A2A] disabled:opacity-50"
                                    >
                                        {saving ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </div>
                            </div>

                            {/* Editor de texto */}
                            <div className="flex-1 px-8 py-6">
                                <textarea
                                    value={editConteudo}
                                    onChange={(e) => handleConteudoChange(e.target.value)}
                                    placeholder="Comece a escrever aqui..."
                                    className="h-full w-full resize-none bg-transparent text-[15px] leading-8 text-[#1A1A1A] outline-none placeholder:text-[#CBCBC2]"
                                />
                            </div>
                        </>
                    )}
                </main>
            </div>

            <FeedbackToast
                open={feedback.open}
                type={feedback.type}
                message={feedback.message}
                onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
            />
        </>
    )
}
