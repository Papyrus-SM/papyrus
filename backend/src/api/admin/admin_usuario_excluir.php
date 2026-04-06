<?php

include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

session_start();

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";
    echo json_encode($retorno);
    exit;
}

if (($_SESSION["usuario"]["papel"] ?? "") !== "admin") {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Acesso negado.";
    echo json_encode($retorno);
    exit;
}

$body = getBody();
$id = (int) ($body["id"] ?? 0);

if ($id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID do usuário inválido.";
    echo json_encode($retorno);
    exit;
}

if ((int) $_SESSION["usuario"]["id"] === $id) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Você não pode excluir sua própria conta por esta tela.";
    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmt = $conexao->prepare("
    DELETE FROM users
    WHERE id = :id
    LIMIT 1
");

$executou = $stmt->execute([
    ":id" => $id
]);

if ($executou && $stmt->rowCount() > 0) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Usuário excluído com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível excluir o usuário.";
}

echo json_encode($retorno);