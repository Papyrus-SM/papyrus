<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Arquivos de configuração compartilhados da API:
// headers.php -> define cabeçalhos da resposta (JSON, CORS, etc.)
// input.php -> fornece funções utilitárias para ler o body da requisição
// conexao.php -> cria e retorna a conexão com o banco de dados
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

session_start();

// Estrutura padrão de resposta da API.
// Ela será preenchida ao longo da execução e devolvida em JSON no final.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Verifica se o usuário está autenticado.
// Sem sessão ativa, a requisição é rejeitada.
if (!isset($_SESSION["usuario"]["id"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";
    echo json_encode($retorno);
    exit;
}

// Lê o corpo da requisição HTTP e transforma em array.
$body = getBody();

// ID do usuário logado (via sessão).
$user_id = $_SESSION["usuario"]["id"];

// Coleta e sanitização dos dados recebidos.
// conversa_id pode ser nulo (cria uma nova conversa).
// mensagem é obrigatória.
$conversa_id = $body["conversa_id"] ?? null;
$mensagem = trim($body["mensagem"] ?? "");

// Validação: a mensagem não pode estar vazia.
if (empty($mensagem)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "A mensagem não pode estar vazia.";
    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Se conversa_id não foi enviado, cria uma nova conversa.
// O título será gerado automaticamente a partir das primeiras palavras da mensagem.
if (empty($conversa_id)) {
    // Gera um título a partir das primeiras 50 caracteres da mensagem do usuário.
    $titulo = mb_strlen($mensagem) > 50
        ? mb_substr($mensagem, 0, 50) . '...'
        : $mensagem;

    $stmt = $conexao->prepare("
        INSERT INTO chat_conversas (user_id, titulo)
        VALUES (:user_id, :titulo)
    ");
    $stmt->execute([
        ":user_id" => $user_id,
        ":titulo" => $titulo
    ]);

    // Recupera o ID da conversa recém-criada.
    $conversa_id = $conexao->lastInsertId();
} else {
    // Se conversa_id foi enviado, verifica se pertence ao usuário logado.
    // Isso impede que um usuário acesse conversas de outro.
    $stmt = $conexao->prepare("
        SELECT id FROM chat_conversas
        WHERE id = :conversa_id AND user_id = :user_id
    ");
    $stmt->execute([
        ":conversa_id" => $conversa_id,
        ":user_id" => $user_id
    ]);

    if (!$stmt->fetch()) {
        $retorno["status"] = "nok";
        $retorno["mensagem"] = "Conversa não encontrada.";
        echo json_encode($retorno);
        exit;
    }
}

// Salva a mensagem do usuário no banco de dados.
$stmt = $conexao->prepare("
    INSERT INTO chat_mensagens (conversa_id, tipo, conteudo)
    VALUES (:conversa_id, 'user', :conteudo)
");
$stmt->execute([
    ":conversa_id" => $conversa_id,
    ":conteudo" => $mensagem
]);

// Carrega o histórico completo da conversa para enviar à IA.
// Isso permite que a IA mantenha contexto entre mensagens.
$stmt = $conexao->prepare("
    SELECT tipo, conteudo FROM chat_mensagens
    WHERE conversa_id = :conversa_id
    ORDER BY criada_em ASC
");
$stmt->execute([":conversa_id" => $conversa_id]);
$historico = $stmt->fetchAll();

// Monta o payload para a API do Gemini.
// O system prompt define o comportamento do tutor acadêmico.
$systemPrompt = "Você é um tutor acadêmico que ajuda estudantes. Seu nome é Papyrus IA. Responda em português de forma clara e didática. De agora em diante, não afirme simplesmente que minhas frases e conclusões estão corretas. Seu objetivo é ser um parceiro intelectual imparcial, não só um assistente que concorda com tudo que eu falo.
Sempre que eu te apresentar uma ideia, faça o seguinte:
1. Analise minhas premissas: O que eu estou assumindo como verdade que pode na verdade não ser?
2. Forneça contrapontos: O que um parceiro intelectual imparcial, bem informado diria?
3. Mostre outras perspectivas: Quais outras maneiras dessa ideia ser contada, interpretada ou desafiada?
4. Teste meu raciocínio: Minha lógica tem sentido ou existem falhas e pontos não considerados?
5. Priorize a verdade ao invés de rumores: Se eu estiver errado ou se minha lógica for fraca, eu preciso saber. Me corrija de maneira clara e me explique o motivo.
Mantenha uma metodologia construtiva, mas rigorosa. Sua função não é argumentar só por argumentar, mas para me desafiar a ter mais clareza, assertividade, e honestidade intelectual. Se eu começar a direcionar a conversa para algum viés ou rumores não confirmados, deixe isso claro imediatamente. Vamos melhorar não só nossas conclusões, mas também nosso raciocínio para chegar nelas.";

// Monta o array de conteúdos (contents) no formato esperado pela API do Gemini.
// Cada mensagem do histórico é convertida para o formato { role, parts }.
$contents = [];
foreach ($historico as $msg) {
    $contents[] = [
        "role" => $msg["tipo"] === "user" ? "user" : "model",
        "parts" => [["text" => $msg["conteudo"]]]
    ];
}

// Monta o payload completo para a API do Gemini.
$payload = [
    "system_instruction" => [
        "parts" => [["text" => $systemPrompt]]
    ],
    "contents" => $contents
];

// Recupera a chave da API do Gemini do arquivo .env.
$apiKey = $_ENV['GEMINI_API_KEY'] ?? '';

if (empty($apiKey)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Chave da API Gemini não configurada no servidor.";
    echo json_encode($retorno);
    exit;
}

// URL da API do Gemini com o modelo gemini-2.0-flash (gratuito).
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . $apiKey;

// Envia a requisição via cURL para a API do Gemini.
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
// Timeout de 60 segundos para a resposta da IA.
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Verifica se houve erro na requisição cURL.
if ($curlError) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Erro de conexão com a IA: " . $curlError;
    echo json_encode($retorno);
    exit;
}

// Decodifica a resposta JSON da API do Gemini.
$geminiResponse = json_decode($response, true);

// Verifica se a resposta HTTP indica erro.
if ($httpCode !== 200) {
    $errorMsg = $geminiResponse['error']['message'] ?? 'Erro desconhecido da API Gemini.';
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Erro da IA (HTTP {$httpCode}): " . $errorMsg;
    echo json_encode($retorno);
    exit;
}

// Extrai o texto da resposta da IA.
// A estrutura da resposta é: candidates[0].content.parts[0].text
$respostaIA = $geminiResponse['candidates'][0]['content']['parts'][0]['text'] ?? '';

if (empty($respostaIA)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "A IA não retornou uma resposta válida.";
    echo json_encode($retorno);
    exit;
}

// Salva a resposta da IA no banco de dados.
$stmt = $conexao->prepare("
    INSERT INTO chat_mensagens (conversa_id, tipo, conteudo)
    VALUES (:conversa_id, 'assistant', :conteudo)
");
$stmt->execute([
    ":conversa_id" => $conversa_id,
    ":conteudo" => $respostaIA
]);

// Retorna a resposta final com o ID da conversa e o texto da IA.
$retorno["status"] = "ok";
$retorno["mensagem"] = "Mensagem enviada com sucesso.";
$retorno["data"] = [
    "conversa_id" => (int) $conversa_id,
    "resposta" => $respostaIA
];

echo json_encode($retorno);
