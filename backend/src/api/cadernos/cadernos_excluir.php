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

$body = getBody();

$id = $body["id"] ?? null;

if (empty($id)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID do caderno é obrigatório.";

    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmtCheck = $conexao->prepare("
    SELECT c.id
    FROM cadernos c
    INNER JOIN materias m ON m.id = c.materia_id
    WHERE c.id = :id AND m.user_id = :user_id
");

$stmtCheck->execute([
    ":id" => $id,
    ":user_id" => $_SESSION["usuario"]["id"]
]);

if (!$stmtCheck->fetch()) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Caderno não encontrado.";

    echo json_encode($retorno);
    exit;
}

$stmt = $conexao->prepare("DELETE FROM cadernos WHERE id = :id");

$executou = $stmt->execute([
    ":id" => $id
]);

if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Caderno excluído com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível excluir o caderno.";
}

echo json_encode($retorno);
