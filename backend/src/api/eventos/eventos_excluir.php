<?php

session_start();

include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');
include_once(__DIR__ . '/../../config/auth.php');

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

$usuario = requireStudent($retorno);

$body = getBody();

$id = (int)($body["id"] ?? 0);

if ($id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Evento inválido.";
    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$user_id = (int) $usuario["id"];

$stmt = $conexao->prepare("
    DELETE FROM eventos
    WHERE id = :id AND user_id = :user_id
");

$executou = $stmt->execute([
    ":id" => $id,
    ":user_id" => $user_id,
]);

if ($executou && $stmt->rowCount() > 0) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Evento excluído com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao excluir o evento ou evento não encontrado.";
}

echo json_encode($retorno);
