<?php

// Inicia a sessão para identificar o usuário autenticado.
session_start();

// Carrega configurações da API e acesso ao banco.
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

// Estrutura padrão de resposta da API.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Este endpoint só pode ser usado por um usuário logado.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";
    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Guarda o ID do usuário
$user_id = $_SESSION["usuario"] ["id"] ?? 0;

// Busca todas as tarefas do usuário
$stmt = $conexao->prepare("
    SELECT 
        t.id,
        t.titulo,
        t.descricao,
        t.dificuldade,
        t.data_entrega,
        t.concluida,
        t.data_criacao,
        m.id as materia_id,
        m.nome as materia_nome,
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

// Se não houver tarefas, retorna lista vazia
if (!$tarefas) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Nenhuma tarefa encontrada.";
    $retorno["data"] = [];
    echo json_encode($retorno);
    exit;
}

// Formata as tarefas para retornar
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

// Retorna sucesso com as tarefas
$retorno["status"] = "ok";
$retorno["mensagem"] = "Tarefas listadas com sucesso.";
$retorno["data"] = $tarefasFormatadas;

echo json_encode($retorno);