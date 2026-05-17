// ChatMessage.jsx
// Componente individual de mensagem no chat.
// Diferencia visualmente mensagens do usuário e da IA.

export default function ChatMessage({ tipo, conteudo }) {
    // Define se a mensagem é do usuário ou da IA.
    const isUser = tipo === 'user'

    return (
        <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
            {/* Ícone/avatar do remetente */}
            <div className={`chat-message__avatar ${isUser ? 'chat-message__avatar--user' : 'chat-message__avatar--assistant'}`}>
                {isUser ? (
                    // Ícone de usuário (silhueta simples)
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                ) : (
                    // Ícone de IA (estrela/sparkle)
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                )}
            </div>

            {/* Conteúdo da mensagem */}
            <div className={`chat-message__bubble ${isUser ? 'chat-message__bubble--user' : 'chat-message__bubble--assistant'}`}>
                {/* Renderiza o texto preservando quebras de linha */}
                {conteudo.split('\n').map((line, i) => (
                    <span key={i}>
                        {line}
                        {i < conteudo.split('\n').length - 1 && <br />}
                    </span>
                ))}
            </div>
        </div>
    )
}
