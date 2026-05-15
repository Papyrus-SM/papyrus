// API de flashcards ainda não está implementada no backend.
// Este arquivo fornece uma implementação básica para a página funcionar
// e poder ser expandida quando os endpoints estiverem disponíveis.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/papyrus/backend/src'

export async function listFlashcards() {
    try {
        const response = await fetch(`${BASE_URL}/api/flashcards/flashcards_listar.php`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Erro ao listar flashcards:', error)
        // Retorna um erro genérico se a API não estiver disponível
        return {
            status: 'error',
            mensagem: 'Falha ao conectar com o servidor',
            data: { flashcards: [] },
        }
    }
}

export async function createFlashcard(pergunta, resposta) {
    try {
        const response = await fetch(`${BASE_URL}/api/flashcards/flashcards_criar.php`, {
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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Erro ao criar flashcard:', error)
        return {
            status: 'error',
            mensagem: 'Falha ao conectar com o servidor',
        }
    }
}
