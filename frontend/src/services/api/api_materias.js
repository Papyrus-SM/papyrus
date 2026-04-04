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

export async function listMaterias() {
    const response = await fetch(`${API_BASE_URL}/materias/materias_listar.php`, {
        method: 'GET',
        credentials: 'include',
    })

    return await parseResponse(response)
}

export async function createMateria(payload) {
    const response = await fetch(`${API_BASE_URL}/materias/materias_criar.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

export async function createInitialMaterias(payload) {
    const response = await fetch(`${API_BASE_URL}/materias/materias_criar_iniciais.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

export async function editMateria(payload) {
    const response = await fetch(`${API_BASE_URL}/materias/materias_editar.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

export async function deleteMateria(payload) {
    const response = await fetch(`${API_BASE_URL}/materias/materias_excluir.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}