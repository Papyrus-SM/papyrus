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

$materia_id = $body["materia_id"] ?? null;
$titulo = trim($body["titulo"] ?? "");
$descricao = trim($body["descricao"] ?? "");

if (empty($materia_id)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "É necessário selecionar uma matéria.";

    echo json_encode($retorno);
    exit;
}

if (empty($titulo)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O título do caderno é obrigatório.";

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
    SELECT id FROM materias WHERE id = :materia_id AND user_id = :user_id
");

$stmtCheck->execute([
    ":materia_id" => $materia_id,
    ":user_id" => $_SESSION["usuario"]["id"]
]);

if (!$stmtCheck->fetch()) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Matéria não encontrada.";

    echo json_encode($retorno);
    exit;
}

$stmt = $conexao->prepare("
    INSERT INTO cadernos (materia_id, titulo, descricao)
    VALUES (:materia_id, :titulo, :descricao)
");

$executou = $stmt->execute([
    ":materia_id" => $materia_id,
    ":titulo" => $titulo,
    ":descricao" => $descricao ?: null
]);

if ($executou) {
    $cadernoId = $conexao->lastInsertId();

    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Caderno criado com sucesso.";
    $retorno["data"] = [
        "caderno" => [
            "id" => (int) $cadernoId,
            "materia_id" => (int) $materia_id,
            "titulo" => $titulo,
            "descricao" => $descricao ?: null
        ]
    ];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível criar o caderno.";
}

echo json_encode($retorno);
