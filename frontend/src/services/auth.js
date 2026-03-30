const API_BASE_URL = 'http://localhost/estudos/Papirus/papirusv1/papyrus/backend/src/api/'

async function parseResponse(response) {
    const text = await response.text()

    try {
        return JSON.parse(text)
    } catch {
        console.error('Resposta bruta da API:', text)
        throw new Error(`Resposta inválida da API. HTTP ${response.status}`)
    }
}

export async function registerUser(payload) {
    const response = await fetch(`${API_BASE_URL}/usuario_novo.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

export async function loginUser(payload) {
    const response = await fetch(`${API_BASE_URL}/usuario_login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

export async function logoutUser() {
    const response = await fetch(`${API_BASE_URL}/usuario_logout.php`, {
        method: 'POST',
        credentials: 'include',
    })

    return await parseResponse(response)
}

export async function validateSession() {
    const response = await fetch(`${API_BASE_URL}/valida_sessao.php`, {
        method: 'GET',
        credentials: 'include',
    })

    return await parseResponse(response)
}