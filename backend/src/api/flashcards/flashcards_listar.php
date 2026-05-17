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

$user_id = $_SESSION["usuario"]["id"] ?? 0;
// Este endpoint retorna a lista de flashcards do usuário logado.
// Segue o mesmo padrão das outras features: valida sessão, monta
// resposta padrão e executa a consulta ao banco via PDO.

if ($user_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Você precisa estar logado para listar os flashcards.";
    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmt = $conexao->prepare(
    "SELECT id, pergunta, resposta, color_hex, criado_em FROM flashcards WHERE user_id = :user_id ORDER BY id DESC"
);

$stmt->execute([
    ":user_id" => $user_id
]);

$flashcards = $stmt->fetchAll(PDO::FETCH_ASSOC);

$retorno["status"] = "ok";
$retorno["mensagem"] = "Flashcards carregados com sucesso.";
$retorno["data"] = [
    "flashcards" => $flashcards
];

echo json_encode($retorno);
