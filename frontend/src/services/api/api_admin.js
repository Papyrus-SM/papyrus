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

export async function listAdminUsers() {
    const response = await fetch(`${API_BASE_URL}/admin/admin_usuario_listar.php`, {
        method: 'GET',
        credentials: 'include',
    })

    return await parseResponse(response)
}

export async function editAdminUser(payload) {
    const response = await fetch(`${API_BASE_URL}/admin/admin_usuario_editar.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

export async function deleteAdminUser(payload) {
    const response = await fetch(`${API_BASE_URL}/admin/admin_usuario_excluir.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

export async function getAdminDashboardMetrics() {
    const response = await fetch(`${API_BASE_URL}/admin/admin_dashboard_metricas.php`, {
        method: 'GET',
        credentials: 'include',
    })

    return await parseResponse(response)
}