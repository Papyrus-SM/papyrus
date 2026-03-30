// Define a URL base da API.
// Isso evita repetição e facilita manutenção (princípio DRY - Don't Repeat Yourself).
const API_BASE_URL = 'http://papyrus.local/src/api'


// Função utilitária responsável por tratar TODAS as respostas da API.
// Centralizar isso é uma excelente prática de arquitetura.
async function parseResponse(response) {

    // Lê a resposta como texto bruto
    // (não usamos response.json() direto para ter mais controle de erro)
    const text = await response.text()

    try {
        // Tenta converter o texto para JSON
        return JSON.parse(text)

    } catch {
        // Se não for JSON válido, loga a resposta para debug
        console.error('Resposta bruta da API:', text)

        // Lança erro customizado com status HTTP
        // Isso ajuda no tratamento de erros no front-end
        throw new Error(`Resposta inválida da API. HTTP ${response.status}`)
    }
}

export async function registerUser(payload) {

    // Faz requisição POST para criar um novo usuário
    const response = await fetch(`${API_BASE_URL}/usuario_novo.php`, {

        method: 'POST',

        // Define que estamos enviando JSON
        headers: {
            'Content-Type': 'application/json',
        },

        // Inclui cookies (importante para sessões PHP)
        credentials: 'include',

        // Converte o objeto JS para JSON
        body: JSON.stringify(payload),
    })

    // Delega o tratamento da resposta para a função centralizada
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

        // Mesmo logout sendo uma ação "simples",
        // usar POST é correto pois altera estado no servidor
        method: 'POST',

        // Mantém cookies para identificar a sessão
        credentials: 'include',
    })

    return await parseResponse(response)
}


export async function validateSession() {

    const response = await fetch(`${API_BASE_URL}/valida_sessao.php`, {

        // GET faz sentido pois estamos apenas consultando estado
        method: 'GET',

        credentials: 'include',
    })

    return await parseResponse(response)
}