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

$caderno_id = $body["caderno_id"] ?? null;
$titulo = trim($body["titulo"] ?? "");

if (empty($caderno_id)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID do caderno é obrigatório.";

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

// coalesce é uma função que retorna o primeiro valor não nulo.
$stmtOrdem = $conexao->prepare("
    SELECT COALESCE(MAX(ordem), 0) + 1 AS proxima_ordem
    FROM paginas
    WHERE caderno_id = :caderno_id
");

$stmtOrdem->execute([":caderno_id" => $caderno_id]);
$proxima_ordem = $stmtOrdem->fetch()["proxima_ordem"];

$stmt = $conexao->prepare("
    INSERT INTO paginas (caderno_id, titulo, conteudo, ordem)
    VALUES (:caderno_id, :titulo, :conteudo, :ordem)
");

$executou = $stmt->execute([
    ":caderno_id" => $caderno_id,
    ":titulo" => $titulo,
    ":conteudo" => "",
    ":ordem" => $proxima_ordem
]);

if ($executou) {
    $paginaId = $conexao->lastInsertId();

    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Página criada com sucesso.";
    $retorno["data"] = [
        "pagina" => [
            "id" => (int) $paginaId,
            "caderno_id" => (int) $caderno_id,
            "titulo" => $titulo,
            "conteudo" => "",
            "ordem" => (int) $proxima_ordem
        ]
    ];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível criar a página.";
}

echo json_encode($retorno);
