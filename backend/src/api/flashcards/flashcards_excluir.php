<?php

session_start();

include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Endpoint para excluir um flashcard. Segue o padrão seguro:
// - valida ID passado
// - valida sessão do usuário
// - verifica que o flashcard pertence ao usuário antes de deletar

$body = getBody();

$flashcard_id = (int)($body["flashcard_id"] ?? 0);

if ($flashcard_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID do flashcard inválido.";
    echo json_encode($retorno);
    exit;
}

$user_id = $_SESSION["usuario"]["id"] ?? 0;

if ($user_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Você precisa estar logado para excluir um flashcard.";
    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmtVerifica = $conexao->prepare(
    "SELECT id FROM flashcards WHERE id = :flashcard_id AND user_id = :user_id LIMIT 1"
);

$stmtVerifica->execute([
    ":flashcard_id" => $flashcard_id,
    ":user_id" => $user_id
]);

if (!$stmtVerifica->fetch()) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Flashcard não encontrada ou não pertence a você.";
    echo json_encode($retorno);
    exit;
}

$stmtDelete = $conexao->prepare("DELETE FROM flashcards WHERE id = :flashcard_id LIMIT 1");
$executou = $stmtDelete->execute([
    ":flashcard_id" => $flashcard_id,
]);

if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Flashcard excluída com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao excluir a flashcard.";
}

echo json_encode($retorno);