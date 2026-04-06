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

$conexao = getConexao();
$user_id = $_SESSION["usuario"]["id"] ?? 0;

$stmt = $conexao->prepare("
    SELECT
        t.id,
        t.titulo,
        t.descricao,
        t.dificuldade,
        DATE(t.data_entrega) AS data_entrega,
        t.concluida,
        t.data_criacao,
        m.id AS materia_id,
        m.nome AS materia_nome,
        m.color_hex
    FROM tarefas t
    INNER JOIN materias m ON t.materia_id = m.id
    WHERE m.user_id = :user_id
    ORDER BY t.data_criacao DESC
");

$stmt->execute([
    ":user_id" => $user_id
]);

$tarefas = $stmt->fetchAll();

if (!$tarefas) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Nenhuma tarefa encontrada.";
    $retorno["data"] = [];
    echo json_encode($retorno);
    exit;
}

$tarefasFormatadas = [];

foreach ($tarefas as $tarefa) {
    $tarefasFormatadas[] = [
        "id" => (int)$tarefa["id"],
        "titulo" => $tarefa["titulo"],
        "descricao" => $tarefa["descricao"],
        "dificuldade" => $tarefa["dificuldade"],
        "data_entrega" => $tarefa["data_entrega"],
        "concluida" => (bool)$tarefa["concluida"],
        "data_criacao" => $tarefa["data_criacao"],
        "materia" => [
            "id" => (int)$tarefa["materia_id"],
            "nome" => $tarefa["materia_nome"],
            "cor" => $tarefa["color_hex"]
        ]
    ];
}

$retorno["status"] = "ok";
$retorno["mensagem"] = "Tarefas listadas com sucesso.";
$retorno["data"] = $tarefasFormatadas;

echo json_encode($retorno);