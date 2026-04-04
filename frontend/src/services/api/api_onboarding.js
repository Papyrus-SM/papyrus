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

export async function getOnboardingStatus() {
    const response = await fetch(`${API_BASE_URL}/onboarding/onboarding_buscar_status.php`, {
        method: 'GET',
        credentials: 'include',
    })

    return await parseResponse(response)
}

export async function completeOnboarding() {
    const response = await fetch(`${API_BASE_URL}/onboarding/onboarding_concluir.php`, {
        method: 'POST',
        credentials: 'include',
    })

    return await parseResponse(response)
}

export async function skipOnboarding() {
    const response = await fetch(`${API_BASE_URL}/onboarding/onboarding_pular.php`, {
        method: 'POST',
        credentials: 'include',
    })

    return await parseResponse(response)
}