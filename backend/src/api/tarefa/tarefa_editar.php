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

// Lê o corpo da requisição.
$body = getBody();

// Coleta o ID da tarefa a ser editada
$tarefa_id = (int)($body["tarefa_id"] ?? 0);

// Validação do ID da tarefa
if ($tarefa_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID da tarefa inválido.";
    echo json_encode($retorno);
    exit;
}

// Coleta as novas informações da tarefa
$titulo = trim($body["titulo"] ?? "");
$descricao = $body["descricao"] ?? null;
$dificuldade = trim($body["dificuldade"] ?? "");
$data_entrega = $body["data_entrega"] ?? null;
$concluida = isset($body["concluida"]) ? (bool)$body["concluida"] : false;
$materia = trim($body["materia"] ?? "");

// Validação básica: pelo menos um campo deve ser preenchido
if (empty($titulo) && empty($dificuldade) && empty($materia) && $descricao === null && $data_entrega === null && !$concluida) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Nenhum campo para atualizar.";
    echo json_encode($retorno);
    exit;
}

// Regra: título é obrigatório (se enviado)
if (!empty($titulo) && strlen($titulo) < 3) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O título deve ter pelo menos 3 caracteres.";
    echo json_encode($retorno);
    exit;
}

// Regra: dificuldade é obrigatória (se enviada)
if (!empty($dificuldade)) {
    $dificuldadePermitida = ["facil", "medio", "dificil"];
    if (!in_array($dificuldade, $dificuldadePermitida)) {
        $retorno["status"] = "nok";
        $retorno["mensagem"] = "Dificuldade inválida.";
        echo json_encode($retorno);
        exit;
    }
}

// Validação da data de entrega (se for preenchida)
if ($data_entrega !== null && $data_entrega !== "") {
    $data = DateTime::createFromFormat('Y-m-d', $data_entrega);
    if (!$data || $data->format('Y-m-d') !== $data_entrega) {
        $retorno["status"] = "nok";
        $retorno["mensagem"] = "Data de entrega inválida. Use o formato YYYY-MM-DD.";
        echo json_encode($retorno);
        exit;
    }
    $data_entrega = $data->format('Y-m-d');
}

// Abre conexão com o banco.
$conexao = getConexao();

// Guarda o ID do usuário
$user_id = $_SESSION["usuario"] ["id"] ?? 0;

// Verifica se a tarefa existe E pertence ao usuário
$stmt = $conexao->prepare("
    SELECT t.id, t.materia_id 
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

// Se a matéria foi alterada, valida
$materia_id = $tarefaExistente["materia_id"];

if (!empty($materia)) {
    $stmtMateria = $conexao->prepare("SELECT id FROM materias WHERE nome = :materia AND user_id = :user_id LIMIT 1");
    $stmtMateria->execute([
        ":materia" => $materia,
        ":user_id" => $user_id
    ]);

    $materiaValida = $stmtMateria->fetch();
    if (!$materiaValida) {
        $retorno["status"] = "nok";
        $retorno["mensagem"] = "Matéria inválida ou não pertence a você.";
        echo json_encode($retorno);
        exit;
    }

    $materia_id = $materiaValida["id"];
}

// Verifica duplicidade de título (se foi alterado)
if (!empty($titulo)) {
    $stmtVerifica = $conexao->prepare("
        SELECT id FROM tarefas 
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
}

// Prepara o UPDATE
$stmt = $conexao->prepare("
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

// Executa o UPDATE
$executou = $stmt->execute([
    ":tarefa_id" => $tarefa_id,
    ":titulo" => $titulo,
    ":descricao" => $descricao,
    ":dificuldade" => $dificuldade,
    ":data_entrega" => $data_entrega,
    ":concluida" => $concluida ? 1 : 0,
    ":materia_id" => $materia_id,
]);

// Se houve atualização real no banco, informa sucesso.
if ($executou && $stmt->rowCount() > 0) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Tarefa atualizada com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Nenhuma alteração foi realizada.";
}

// Retorna resposta em JSON.
echo json_encode($retorno);