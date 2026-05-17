const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

async function parseResponse(response) { // objetivo da função é analisar a resposta da API e retornar um objeto JavaScript.
    const text = await response.text() // response.text() é um método que retorna uma Promise que resolve com o corpo da resposta como texto.

    try {
        return JSON.parse(text) // JSON.parse() é um método que analisa uma string JSON, transformando-a em um objeto JavaScript.
    } catch {
        console.error('Resposta bruta da API:', text)
        throw new Error(`Resposta inválida da API. HTTP ${response.status}`)
    }
}

export async function listCadernos() { // função que lista os cadernos.
    const response = await fetch(`${API_BASE_URL}/cadernos/cadernos_listar.php`, {
        method: 'GET',
        credentials: 'include',
    })

    return await parseResponse(response)
}

export async function createCaderno(payload) { // função que cria um caderno. payload é um objeto que contém os dados do caderno.
    const response = await fetch(`${API_BASE_URL}/cadernos/cadernos_criar.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

export async function editCaderno(payload) { // função que edita um caderno. payload é um objeto que contém os dados do caderno.
    const response = await fetch(`${API_BASE_URL}/cadernos/cadernos_editar.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response)
}

export async function deleteCaderno(payload) { // função que exclui um caderno. payload é um objeto que contém os dados do caderno.
    const response = await fetch(`${API_BASE_URL}/cadernos/cadernos_excluir.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    })

    return await parseResponse(response) // retorna o objeto JavaScript. 
}
