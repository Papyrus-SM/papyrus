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

// Endpoint para editar um flashcard existente.
// Padrão: valida sessão, valida que o flashcard pertence ao usuário,
// protege contra perguntas duplicadas e atualiza via UPDATE.

$body = getBody();

$flashcard_id = (int)($body["flashcard_id"] ?? 0);
$pergunta = trim($body["pergunta"] ?? "");
$resposta = trim($body["resposta"] ?? "");

if ($flashcard_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID do flashcard inválido.";
    echo json_encode($retorno);
    exit;
}

if (empty($pergunta) || empty($resposta)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Pergunta e resposta são obrigatórias.";
    echo json_encode($retorno);
    exit;
}

$user_id = $_SESSION["usuario"]["id"] ?? 0;

if ($user_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Você precisa estar logado para editar um flashcard.";
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

$stmtDuplicada = $conexao->prepare(
    "SELECT id FROM flashcards WHERE user_id = :user_id AND pergunta = :pergunta AND id != :flashcard_id LIMIT 1"
);

$stmtDuplicada->execute([
    ":user_id" => $user_id,
    ":pergunta" => $pergunta,
    ":flashcard_id" => $flashcard_id
]);

if ($stmtDuplicada->fetch()) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Já existe outro flashcard com essa pergunta.";
    echo json_encode($retorno);
    exit;
}

$stmtUpdate = $conexao->prepare(
    "UPDATE flashcards SET pergunta = :pergunta, resposta = :resposta WHERE id = :flashcard_id LIMIT 1"
);

$executou = $stmtUpdate->execute([
    ":flashcard_id" => $flashcard_id,
    ":pergunta" => $pergunta,
    ":resposta" => $resposta,
]);

if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Flashcard atualizada com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao atualizar a flashcard.";
}

echo json_encode($retorno);
