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


export async function registerStickyNotes(payload) {
    const response = await fetch(`${API_BASE_URL}/stickyNotes/stickyNotes_criar.php`, { /* o fetch é a função nativa do JS para fazer requisições HTTP. Aqui ela envia os dados do formulário para a API. */
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload), /* aqui esta o formData e converte os dados do formulário em JSON para enviar à API */
    })

    return await parseResponse(response)
}


export async function getStickyNotes() {
    const response = await fetch(`${API_BASE_URL}/stickyNotes/stickyNotes_get.php`, {
        method: 'GET',
        credentials: 'include',
    })

    const data = await parseResponse(response)

    if (data.status === "ok") {
        return data.data || []
    } else {
        throw new Error(data.mensagem || "Não foi possível obter as anotações.")
    }
}


export async function deletStickyNotes(id) {
    const response = await fetch(`${API_BASE_URL}/stickyNotes/stickyNotes_excluir.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id }), /* aqui esta o formData e converte os dados do formulário em JSON para enviar à API */
    })

    const data = await parseResponse(response)

    if (data.status === "ok") {
        return data.data || []
    } else {
        throw new Error(data.mensagem || "Não foi possível obter as anotações.")
    }
}

export async function updateStickyNotes(payload) {
    const response = await fetch(`${API_BASE_URL}/stickyNotes/stickyNotes_editar.php`, { /* o fetch é a função nativa do JS para fazer requisições HTTP. Aqui ela envia os dados do formulário para a API. */
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload), /* aqui esta o formData e converte os dados do formulário em JSON para enviar à API */
    })

    return await parseResponse(response)
}