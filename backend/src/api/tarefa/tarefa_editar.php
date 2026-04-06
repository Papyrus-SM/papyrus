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

if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";
    echo json_encode($retorno);
    exit;
}

$body = getBody();

$tarefa_id = (int)($body["tarefa_id"] ?? 0);
$titulo = trim($body["titulo"] ?? "");
$descricao = $body["descricao"] ?? null;
$dificuldade = trim($body["dificuldade"] ?? "");
$data_entrega = $body["data_entrega"] ?? null;
$concluida = isset($body["concluida"]) ? (bool)$body["concluida"] : false;
$materia_id = (int)($body["materia_id"] ?? 0);

if ($tarefa_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID da tarefa inválido.";
    echo json_encode($retorno);
    exit;
}

if (empty($titulo) || empty($dificuldade) || $materia_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Matéria, título e dificuldade são obrigatórios.";
    echo json_encode($retorno);
    exit;
}

if (strlen($titulo) < 3) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O título deve ter pelo menos 3 caracteres.";
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

if ($descricao !== null) {
    $descricao = trim($descricao);
    if ($descricao === '') {
        $descricao = null;
    }
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

$stmt = $conexao->prepare("
    SELECT t.id
    FROM tarefas t
    INNER JOIN materias m ON t.materia_id = m.id
    WHERE t.id = :tarefa_id AND m.user_id = :user_id
    LIMIT 1
");

$stmt->execute([
    ":tarefa_id" => $tarefa_id,
    ":user_id" => $user_id
]);

$tarefaExistente = $stmt->fetch();

if (!$tarefaExistente) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Tarefa não encontrada ou não pertence a você.";
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
    WHERE titulo = :titulo AND materia_id = :materia_id AND id != :tarefa_id
    LIMIT 1
");

$stmtVerifica->execute([
    ":titulo" => $titulo,
    ":materia_id" => $materia_id,
    ":tarefa_id" => $tarefa_id
]);

if ($stmtVerifica->fetch()) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Já existe outra tarefa com esse título para essa matéria.";
    echo json_encode($retorno);
    exit;
}

$stmtUpdate = $conexao->prepare("
    UPDATE tarefas
    SET
        titulo = :titulo,
        descricao = :descricao,
        dificuldade = :dificuldade,
        data_entrega = :data_entrega,
        concluida = :concluida,
        materia_id = :materia_id
    WHERE id = :tarefa_id
    LIMIT 1
");

$executou = $stmtUpdate->execute([
    ":tarefa_id" => $tarefa_id,
    ":titulo" => $titulo,
    ":descricao" => $descricao,
    ":dificuldade" => $dificuldade,
    ":data_entrega" => $data_entrega,
    ":concluida" => $concluida ? 1 : 0,
    ":materia_id" => $materia_id,
]);

if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Tarefa atualizada com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao atualizar a tarefa.";
}

echo json_encode($retorno);