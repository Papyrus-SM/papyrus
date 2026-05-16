// ChatSidebar.jsx
// Componente principal do chat com IA.
// Contém: lista de conversas, área de mensagens, input de envio.
// Gerencia todo o estado do chat internamente.

import { useState, useEffect, useRef, useCallback } from 'react'
import ChatMessage from '@/components/chat/ChatMessage'
import { sendChatMessage, listConversas, listMensagens, deleteConversa } from '@/services/api/api_chat'
import './ChatSidebar.css'

export default function ChatSidebar({ isOpen, onClose }) {
    // Estado das conversas do usuário.
    const [conversas, setConversas] = useState([])
    // ID da conversa atualmente selecionada (null = nova conversa).
    const [conversaAtiva, setConversaAtiva] = useState(null)
    // Mensagens da conversa ativa.
    const [mensagens, setMensagens] = useState([])
    // Texto digitado pelo usuário no input.
    const [inputText, setInputText] = useState('')
    // Indica se a IA está processando uma resposta.
    const [loading, setLoading] = useState(false)
    // Controla visibilidade do painel de conversas.
    const [showConversas, setShowConversas] = useState(false)

    // Referência para scroll automático até a última mensagem.
    const messagesEndRef = useRef(null)
    // Referência para o campo de input (foco automático).
    const inputRef = useRef(null)

    // Rola automaticamente para a última mensagem.
    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Sempre que as mensagens mudam, faz scroll para o final.
    useEffect(() => {
        scrollToBottom()
    }, [mensagens, loading])

    // Foca no input quando o sidebar abre.
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 400)
        }
    }, [isOpen])

    // Carrega a lista de conversas quando o sidebar abre.
    const loadConversas = useCallback(async () => {
        try {
            const data = await listConversas()
            if (data.status === 'ok') {
                setConversas(data.data || [])
            }
        } catch (error) {
            console.error('Erro ao carregar conversas:', error)
        }
    }, [])

    useEffect(() => {
        if (isOpen) {
            loadConversas()
        }
    }, [isOpen, loadConversas])

    // Carrega as mensagens de uma conversa específica.
    async function handleSelectConversa(conversa) {
        try {
            setConversaAtiva(conversa.id)
            setShowConversas(false)

            const data = await listMensagens(conversa.id)
            if (data.status === 'ok') {
                setMensagens(data.data || [])
            }
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error)
        }
    }

    // Inicia uma nova conversa (limpa tudo).
    function handleNovaConversa() {
        setConversaAtiva(null)
        setMensagens([])
        setInputText('')
        setShowConversas(false)
        inputRef.current?.focus()
    }

    // Exclui uma conversa da lista.
    async function handleDeleteConversa(e, conversaId) {
        // Evita que o clique no botão de excluir selecione a conversa.
        e.stopPropagation()

        if (!window.confirm('Deseja excluir esta conversa?')) return

        try {
            const data = await deleteConversa({ conversa_id: conversaId })
            if (data.status === 'ok') {
                // Se a conversa excluída era a ativa, limpa tudo.
                if (conversaAtiva === conversaId) {
                    setConversaAtiva(null)
                    setMensagens([])
                }
                await loadConversas()
            }
        } catch (error) {
            console.error('Erro ao excluir conversa:', error)
        }
    }

    // Envia uma mensagem para a IA.
    async function handleSendMessage(e) {
        e.preventDefault()

        const texto = inputText.trim()
        if (!texto || loading) return

        // Adiciona a mensagem do usuário na tela imediatamente (otimista).
        const novaMensagemUser = { tipo: 'user', conteudo: texto }
        setMensagens(prev => [...prev, novaMensagemUser])
        setInputText('')
        setLoading(true)

        try {
            const payload = {
                mensagem: texto,
                ...(conversaAtiva && { conversa_id: conversaAtiva })
            }

            const data = await sendChatMessage(payload)

            if (data.status === 'ok') {
                // Se era uma nova conversa, atualiza o ID e recarrega a lista.
                if (!conversaAtiva && data.data.conversa_id) {
                    setConversaAtiva(data.data.conversa_id)
                    await loadConversas()
                }

                // Adiciona a resposta da IA na tela.
                const novaMensagemIA = { tipo: 'assistant', conteudo: data.data.resposta }
                setMensagens(prev => [...prev, novaMensagemIA])
            } else {
                // Se houve erro, mostra na área de mensagens.
                const erroMsg = { tipo: 'assistant', conteudo: `⚠️ ${data.mensagem || 'Erro ao processar sua mensagem.'}` }
                setMensagens(prev => [...prev, erroMsg])
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error)
            const erroMsg = { tipo: 'assistant', conteudo: '⚠️ Erro de conexão. Tente novamente.' }
            setMensagens(prev => [...prev, erroMsg])
        } finally {
            setLoading(false)
        }
    }

    // Envia com Enter (Shift+Enter para quebra de linha).
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage(e)
        }
    }

    return (
        <>
            {/* Overlay escuro atrás do sidebar */}
            <div
                className={`chat-overlay ${isOpen ? 'chat-overlay--visible' : ''}`}
                onClick={onClose}
            />

            {/* Sidebar principal */}
            <aside className={`chat-sidebar ${isOpen ? 'chat-sidebar--open' : ''}`}>
                {/* ---- Header ---- */}
                <div className="chat-header">
                    <div className="chat-header__title">
                        {/* Ícone sparkle */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        Papyrus AI
                    </div>
                    <div className="chat-header__actions">
                        {/* Botão listar conversas */}
                        <button
                            type="button"
                            className="chat-header__btn"
                            onClick={() => setShowConversas(!showConversas)}
                            title="Conversas anteriores"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </button>
                        {/* Botão nova conversa */}
                        <button
                            type="button"
                            className="chat-header__btn"
                            onClick={handleNovaConversa}
                            title="Nova conversa"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>
                        {/* Botão fechar */}
                        <button
                            type="button"
                            className="chat-header__btn"
                            onClick={onClose}
                            title="Fechar chat"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ---- Painel de conversas (toggle) ---- */}
                <div className={`chat-conversas ${showConversas ? 'chat-conversas--open' : ''}`}>
                    <div className="chat-conversas__label">Conversas anteriores</div>
                    {conversas.length === 0 ? (
                        <p className="chat-conversas__empty">Nenhuma conversa ainda.</p>
                    ) : (
                        <ul className="chat-conversas__list">
                            {conversas.map((conversa) => (
                                <li
                                    key={conversa.id}
                                    className={`chat-conversas__item ${conversaAtiva === conversa.id ? 'chat-conversas__item--active' : ''}`}
                                    onClick={() => handleSelectConversa(conversa)}
                                >
                                    <span className="chat-conversas__item-title">{conversa.titulo}</span>
                                    <button
                                        type="button"
                                        className="chat-conversas__item-delete"
                                        onClick={(e) => handleDeleteConversa(e, conversa.id)}
                                        title="Excluir conversa"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ---- Área de mensagens ---- */}
                {mensagens.length === 0 && !loading ? (
                    <div className="chat-welcome">
                        <div className="chat-welcome__icon">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                        </div>
                        <h3 className="chat-welcome__title">Olá! Sou o Papyrus AI</h3>
                        <p className="chat-welcome__subtitle">
                            Seu tutor acadêmico pessoal. Tire dúvidas, peça explicações ou discuta ideias comigo.
                        </p>
                    </div>
                ) : (
                    <div className="chat-messages">
                        {mensagens.map((msg, index) => (
                            <ChatMessage
                                key={index}
                                tipo={msg.tipo}
                                conteudo={msg.conteudo}
                            />
                        ))}

                        {/* Indicador de digitação da IA */}
                        {loading && (
                            <div className="chat-typing">
                                <div className="chat-typing__avatar">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                    </svg>
                                </div>
                                <div className="chat-typing__dots">
                                    <span className="chat-typing__dot" />
                                    <span className="chat-typing__dot" />
                                    <span className="chat-typing__dot" />
                                </div>
                            </div>
                        )}

                        {/* Âncora para scroll automático */}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* ---- Input de mensagem ---- */}
                <div className="chat-input">
                    <form className="chat-input__form" onSubmit={handleSendMessage}>
                        <textarea
                            ref={inputRef}
                            className="chat-input__field"
                            placeholder="Faça uma pergunta..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="chat-input__submit"
                            disabled={loading || !inputText.trim()}
                            title="Enviar mensagem"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </form>
                </div>
            </aside>
        </>
    )
}
