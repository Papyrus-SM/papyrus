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

$body = getBody();

$titulo = trim($body["titulo"] ?? "");
$descricao = $body["descricao"] ?? null;
$dificuldade = trim($body["dificuldade"] ?? "");
$data_entrega = $body["data_entrega"] ?? null;
$materia_id = (int)($body["materia_id"] ?? 0);

$concluida = false;

if ($descricao !== null) {
    $descricao = trim($descricao);
    if ($descricao === '') {
        $descricao = null;
    }
}

if (empty($titulo) || empty($dificuldade) || $materia_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Matéria, título e dificuldade são obrigatórios.";
    echo json_encode($retorno);
    exit;
}

$dificuldadePermitida = ["facil", "medio", "dificil"];

if (!in_array($dificuldade, $dificuldadePermitida, true)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Dificuldade inválida.";
    echo json_encode($retorno);
    exit;
}

if ($data_entrega !== null && $data_entrega !== "") {
    $data = DateTime::createFromFormat('Y-m-d', $data_entrega);

    if (!$data || $data->format('Y-m-d') !== $data_entrega) {
        $retorno["status"] = "nok";
        $retorno["mensagem"] = "Data de entrega inválida. Use o formato YYYY-MM-DD.";
        echo json_encode($retorno);
        exit;
    }

    $data_entrega = $data->format('Y-m-d 00:00:00');
} else {
    $data_entrega = null;
}

$conexao = getConexao();

$user_id = $_SESSION["usuario"]["id"] ?? 0;

if ($user_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Você precisa estar logado para criar uma tarefa.";
    echo json_encode($retorno);
    exit;
}

$stmtMateria = $conexao->prepare("
    SELECT id
    FROM materias
    WHERE id = :materia_id AND user_id = :user_id
    LIMIT 1
");

$stmtMateria->execute([
    ":materia_id" => $materia_id,
    ":user_id" => $user_id
]);

$materiaValida = $stmtMateria->fetch();

if (!$materiaValida) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Matéria inválida ou não pertence a você.";
    echo json_encode($retorno);
    exit;
}

$stmtVerifica = $conexao->prepare("
    SELECT id
    FROM tarefas
    WHERE titulo = :titulo AND materia_id = :materia_id
    LIMIT 1
");

$stmtVerifica->execute([
    ":titulo" => $titulo,
    ":materia_id" => $materia_id
]);

if ($stmtVerifica->fetch()) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Já existe uma tarefa com esse título para essa matéria.";
    echo json_encode($retorno);
    exit;
}

$stmt = $conexao->prepare("
    INSERT INTO tarefas (
        materia_id,
        titulo,
        descricao,
        dificuldade,
        data_entrega,
        concluida
    ) VALUES (
        :materia_id,
        :titulo,
        :descricao,
        :dificuldade,
        :data_entrega,
        :concluida
    )
");

$executou = $stmt->execute([
    ":materia_id" => $materia_id,
    ":titulo" => $titulo,
    ":descricao" => $descricao,
    ":dificuldade" => $dificuldade,
    ":data_entrega" => $data_entrega,
    ":concluida" => $concluida ? 1 : 0
]);

if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Tarefa criada com sucesso.";
    $retorno["data"] = [
        "id" => (int)$conexao->lastInsertId()
    ];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao criar a tarefa.";
}

echo json_encode($retorno);