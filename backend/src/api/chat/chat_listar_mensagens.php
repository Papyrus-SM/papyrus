<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Arquivos de configuração compartilhados da API:
// headers.php -> define cabeçalhos da resposta (JSON, CORS, etc.)
// conexao.php -> cria e retorna a conexão com o banco de dados
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/conexao.php');

session_start();

// Estrutura padrão de resposta da API.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Verifica se o usuário está autenticado.
if (!isset($_SESSION["usuario"]["id"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";
    echo json_encode($retorno);
    exit;
}

// ID do usuário logado (via sessão).
$user_id = $_SESSION["usuario"]["id"];

// Recupera o ID da conversa do query string (?conversa_id=X).
$conversa_id = $_GET["conversa_id"] ?? null;

// Validação: conversa_id é obrigatório.
if (empty($conversa_id)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID da conversa não informado.";
    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Verifica se a conversa pertence ao usuário logado.
// Isso impede que um usuário acesse mensagens de outro.
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

// Busca todas as mensagens da conversa, ordenadas cronologicamente.
$stmt = $conexao->prepare("
    SELECT id, tipo, conteudo, criada_em
    FROM chat_mensagens
    WHERE conversa_id = :conversa_id
    ORDER BY criada_em ASC
");
$stmt->execute([":conversa_id" => $conversa_id]);
$mensagens = $stmt->fetchAll();

// Retorna as mensagens da conversa.
$retorno["status"] = "ok";
$retorno["mensagem"] = "Mensagens listadas com sucesso.";
$retorno["data"] = $mensagens;

echo json_encode($retorno);
