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
$conteudo = $body["conteudo"] ?? "";

if (empty($id)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID da página é obrigatório.";

    echo json_encode($retorno);
    exit;
}

if (empty($titulo)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O título da página é obrigatório.";

    echo json_encode($retorno);
    exit;
}

if (strlen($titulo) > 150) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O título deve ter no máximo 150 caracteres.";

    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmtCheck = $conexao->prepare("
    SELECT p.id
    FROM paginas p
    INNER JOIN cadernos c ON c.id = p.caderno_id
    INNER JOIN materias m ON m.id = c.materia_id
    WHERE p.id = :id AND m.user_id = :user_id
");

$stmtCheck->execute([
    ":id" => $id,
    ":user_id" => $_SESSION["usuario"]["id"]
]);

if (!$stmtCheck->fetch()) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Página não encontrada.";

    echo json_encode($retorno);
    exit;
}

$stmt = $conexao->prepare("
    UPDATE paginas
    SET titulo = :titulo, conteudo = :conteudo
    WHERE id = :id
");

$executou = $stmt->execute([
    ":titulo" => $titulo,
    ":conteudo" => $conteudo,
    ":id" => $id
]);

if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Página atualizada com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível atualizar a página.";
}

echo json_encode($retorno);
