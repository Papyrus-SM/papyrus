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

$caderno_id = $_GET["caderno_id"] ?? null;

if (empty($caderno_id)) {
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
    WHERE c.id = :caderno_id AND m.user_id = :user_id
");

$stmtCheck->execute([
    ":caderno_id" => $caderno_id,
    ":user_id" => $_SESSION["usuario"]["id"]
]);

if (!$stmtCheck->fetch()) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Caderno não encontrado.";

    echo json_encode($retorno);
    exit;
}

$stmt = $conexao->prepare("
    SELECT id, titulo, conteudo, ordem, data_criacao
    FROM paginas
    WHERE caderno_id = :caderno_id
    ORDER BY ordem ASC, id ASC
");

$stmt->execute([
    ":caderno_id" => $caderno_id
]);

$paginas = $stmt->fetchAll();

$retorno["status"] = "ok";
$retorno["mensagem"] = "Páginas listadas com sucesso.";
$retorno["data"] = [
    "paginas" => $paginas
];

echo json_encode($retorno);
