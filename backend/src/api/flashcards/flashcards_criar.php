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

// Endpoint para criar um novo flashcard.
// Valida entrada mínima (pergunta/resposta) e que o usuário esteja
// autenticado. Evita duplicatas por pergunta para o mesmo usuário.

$body = getBody();

$pergunta = trim($body["pergunta"] ?? "");
$resposta = trim($body["resposta"] ?? "");

if (empty($pergunta) || empty($resposta)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Pergunta e resposta são obrigatórias.";
    echo json_encode($retorno);
    exit;
}

$user_id = $_SESSION["usuario"]["id"] ?? 0;

if ($user_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Você precisa estar logado para criar um flashcard.";
    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmtVerifica = $conexao->prepare(
    "SELECT id FROM flashcards WHERE user_id = :user_id AND pergunta = :pergunta LIMIT 1"
);

$stmtVerifica->execute([
    ":user_id" => $user_id,
    ":pergunta" => $pergunta
]);

if ($stmtVerifica->fetch()) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Já existe um flashcard com essa pergunta.";
    echo json_encode($retorno);
    exit;
}

$stmt = $conexao->prepare(
    "INSERT INTO flashcards (user_id, pergunta, resposta) VALUES (:user_id, :pergunta, :resposta)"
);

$executou = $stmt->execute([
    ":user_id" => $user_id,
    ":pergunta" => $pergunta,
    ":resposta" => $resposta
]);

if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Flashcard criado com sucesso.";
    $retorno["data"] = [
        "id" => (int)$conexao->lastInsertId()
    ];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao criar o flashcard.";
}

echo json_encode($retorno);