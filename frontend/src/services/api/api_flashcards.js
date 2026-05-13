// API de flashcards ainda não está implementada no backend.
// Este arquivo fornece uma implementação básica para a página funcionar
// e poder ser expandida quando os endpoints estiverem disponíveis.

export async function listFlashcards() {
    return {
        status: 'ok',
        data: {
            flashcards: [],
        },
    }
}
