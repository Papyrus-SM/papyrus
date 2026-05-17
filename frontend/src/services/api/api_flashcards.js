const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

async function parseResponse(response) {
    const text = await response.text()

    try {
        return JSON.parse(text)
    } catch {
        console.error('Resposta bruta da API:', text)
        throw new Error(`Resposta inválida da API. HTTP ${response.status}`)
    }
}

export async function listFlashcards() {
    // Lista todos os flashcards do usuário autenticado.
    // Padrão: usa GET e envia cookies de sessão (credentials: 'include').
    const response = await fetch(`${API_BASE_URL}/flashcards/flashcards_listar.php`, {
        method: 'GET',
        credentials: 'include',
    })

    return await parseResponse(response)
}

export async function createFlashcard(pergunta, resposta) {
    // Cria um novo flashcard.
    // Envia JSON com `pergunta` e `resposta`.
    const response = await fetch(`${API_BASE_URL}/flashcards/flashcards_criar.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pergunta,
            resposta,
        }),
    })

    return await parseResponse(response)
}

export async function editFlashcard(flashcard_id, pergunta, resposta) {
    // Atualiza um flashcard existente.
    // Deve enviar o `flashcard_id` para que o backend saiba qual registro alterar.
    const response = await fetch(`${API_BASE_URL}/flashcards/flashcards_editar.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            flashcard_id,
            pergunta,
            resposta,
        }),
    })

    return await parseResponse(response)
}

export async function deleteFlashcard(flashcard_id) {
    // Remove um flashcard. Envia `flashcard_id` no corpo da requisição.
    const response = await fetch(`${API_BASE_URL}/flashcards/flashcards_excluir.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            flashcard_id,
        }),
    })

    return await parseResponse(response)
}