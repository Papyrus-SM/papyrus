// api_chat.js
// Serviço de API para o chat com IA (Gemini).
// Segue o mesmo padrão dos demais serviços do projeto.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Função utilitária para parsear a resposta da API.
// Trata respostas inválidas ou erros de parse.
async function parseResponse(response) {
    const text = await response.text()

    try {
        return JSON.parse(text)
    } catch {
        console.error('Resposta bruta da API:', text)
        throw new Error(`Resposta inválida da API. HTTP ${response.status}`)
    }
}

// Envia uma mensagem para a IA.
// Se conversa_id for nulo, cria uma nova conversa automaticamente.
export async function sendChatMessage(payload) {
    const response = await fetch(`${API_BASE_URL}/chat/chat_enviar.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

// Lista todas as conversas do usuário logado.
export async function listConversas() {
    const response = await fetch(`${API_BASE_URL}/chat/chat_listar_conversas.php`, {
        method: 'GET',
        credentials: 'include',
    })

    return await parseResponse(response)
}

// Lista todas as mensagens de uma conversa específica.
export async function listMensagens(conversaId) {
    const response = await fetch(`${API_BASE_URL}/chat/chat_listar_mensagens.php?conversa_id=${conversaId}`, {
        method: 'GET',
        credentials: 'include',
    })

    return await parseResponse(response)
}

// Exclui uma conversa e todas as suas mensagens.
export async function deleteConversa(payload) {
    const response = await fetch(`${API_BASE_URL}/chat/chat_excluir_conversa.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}
