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

export async function listPaginas(cadernoId) {
    const response = await fetch(`${API_BASE_URL}/paginas/paginas_listar.php?caderno_id=${cadernoId}`, {
        method: 'GET',
        credentials: 'include',
    })

    return await parseResponse(response)
}

export async function createPagina(payload) {
    const response = await fetch(`${API_BASE_URL}/paginas/paginas_criar.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

export async function editPagina(payload) {
    const response = await fetch(`${API_BASE_URL}/paginas/paginas_editar.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

export async function deletePagina(payload) {
    const response = await fetch(`${API_BASE_URL}/paginas/paginas_excluir.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}
