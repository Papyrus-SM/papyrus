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

// Lê o corpo da requisição HTTP e transforma em array.
$body = getBody();

// ID do usuário logado (via sessão).
$user_id = $_SESSION["usuario"]["id"];

// Recupera o ID da conversa do body.
$conversa_id = $body["conversa_id"] ?? null;

// Validação: conversa_id é obrigatório.
if (empty($conversa_id)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID da conversa não informado.";
    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Exclui a conversa somente se pertencer ao usuário logado.
// As mensagens são excluídas automaticamente pelo ON DELETE CASCADE.
$stmt = $conexao->prepare("
    DELETE FROM chat_conversas
    WHERE id = :conversa_id AND user_id = :user_id
");
$executou = $stmt->execute([
    ":conversa_id" => $conversa_id,
    ":user_id" => $user_id
]);

// Verifica se alguma linha foi afetada (conversa existia e foi excluída).
if ($executou && $stmt->rowCount() > 0) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Conversa excluída com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Conversa não encontrada ou já foi excluída.";
}

echo json_encode($retorno);
