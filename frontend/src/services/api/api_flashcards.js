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
    const response = await fetch(`${API_BASE_URL}/flashcards/flashcards_listar.php`, {
        method: 'GET',
        credentials: 'include',
    })

    return await parseResponse(response)
}

export async function createFlashcard(pergunta, resposta) {
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
