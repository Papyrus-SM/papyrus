// ChatButton.jsx
// Botão flutuante fixo (FAB) que abre o chat com IA.
// Fica visível em todas as páginas logadas.
// Gerencia o estado aberto/fechado do ChatSidebar.

import { useState, useEffect } from 'react'
import ChatSidebar from '@/components/chat/ChatSidebar'
import '@/components/chat/ChatSidebar.css'

export default function ChatButton() {
    // Controla se o sidebar do chat está aberto ou fechado.
    const [isOpen, setIsOpen] = useState(false)
    // Controla se o efeito de pulse deve aparecer (apenas na primeira vez).
    const [showPulse, setShowPulse] = useState(true)

    // Remove o efeito de pulse após o primeiro clique.
    useEffect(() => {
        if (isOpen) {
            setShowPulse(false)
        }
    }, [isOpen])

    return (
        <>
            {/* Botão flutuante (canto inferior direito) */}
            <button
                type="button"
                className={`chat-fab ${isOpen ? 'chat-fab--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? 'Fechar chat' : 'Abrir Papyrus AI'}
                id="chat-fab-button"
            >
                {/* Efeito de pulse (só aparece antes do primeiro clique) */}
                {showPulse && !isOpen && <span className="chat-fab__pulse" />}

                {/* Ícone muda entre chat e X conforme o estado */}
                {isOpen ? (
                    // Ícone de fechar (X)
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    // Ícone de sparkle (IA)
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                )}
            </button>

            {/* Sidebar do chat (renderiza sempre, controla via CSS) */}
            <ChatSidebar
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}
