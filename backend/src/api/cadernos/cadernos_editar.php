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
$titulo = trim($body["titulo"] ?? "");
$descricao = trim($body["descricao"] ?? "");

if (empty($id)) { // empty() verifica se a variável está vazia, ou seja, se ela é null, false, 0, "", array() ou undefined.
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID do caderno é obrigatório.";

    echo json_encode($retorno);
    exit;
}

if (empty($titulo)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O título do caderno é obrigatório.";

    echo json_encode($retorno);
    exit;
}

if (strlen($titulo) > 150) { // strlen() retorna o tamanho da string.
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O título deve ter no máximo 150 caracteres.";

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

$stmt = $conexao->prepare("
    UPDATE cadernos
    SET titulo = :titulo, descricao = :descricao
    WHERE id = :id
");

$executou = $stmt->execute([
    ":titulo" => $titulo,
    ":descricao" => $descricao ?: null,
    ":id" => $id
]);

if ($executou) { // executou é uma variável booleana que indica se a execução foi bem-sucedida.
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Caderno atualizado com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível atualizar o caderno.";
}

echo json_encode($retorno);
