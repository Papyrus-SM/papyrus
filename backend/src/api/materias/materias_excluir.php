<?php

// Carrega configurações da API e conexão com o banco.
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

// Inicia a sessão para identificar o usuário autenticado.
session_start();

// Estrutura padrão de resposta da API.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Apenas usuários autenticados podem excluir matérias.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";

    echo json_encode($retorno);
    exit;
}

// Lê o corpo da requisição.
$body = getBody();
$id = $body["id"] ?? null;

// Validação do ID.
if (!filter_var($id, FILTER_VALIDATE_INT)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID da matéria inválido.";

    echo json_encode($retorno);
    exit;
}

$id = (int) $id;

// Abre conexão com o banco.
$conexao = getConexao();

// Exclui apenas a matéria que pertence ao usuário autenticado.
$stmt = $conexao->prepare("
    DELETE FROM materias
    WHERE id = :id
      AND user_id = :user_id
    LIMIT 1
");

$executou = $stmt->execute([
    ":id" => $id,
    ":user_id" => $_SESSION["usuario"]["id"]
]);

if ($executou && $stmt->rowCount() > 0) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Matéria excluída com sucesso.";
    $retorno["data"] = [];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível excluir a matéria ou ela não pertence ao usuário.";
}

echo json_encode($retorno);