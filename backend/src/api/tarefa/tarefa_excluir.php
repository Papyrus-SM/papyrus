<?php

// Inicia a sessão para identificar o usuário autenticado.
session_start();




// Carrega configurações e conexão com o banco.
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');




// Estrutura padrão de resposta da API.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];





// Lê o corpo da requisição HTTP
$body = getBody();




// Coleta o ID da tarefa a ser deletada
$tarefa_id = (int)($body["tarefa_id"] ?? 0);




// Validação do ID da tarefa
if ($tarefa_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID da tarefa inválido.";
    echo json_encode($retorno);
    exit;
}




// Este endpoint só pode ser usado por um usuário logado.
// Se não existir usuário salvo na sessão, a execução é encerrada.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";
    echo json_encode($retorno);
    exit;
}

// Pega o ID do usuário logado (agora sabemos que existe)
$user_id = $_SESSION["usuario"] ["id"] ?? 0;

// Validação extra 
if ($user_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID do usuário inválido.";
    echo json_encode($retorno);
    exit;
}



// Abre conexão com o banco.
$conexao = getConexao();




// Verifica se a tarefa existe e pertence ao usuário (através da matéria)
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

// Se a tarefa não existe ou não pertence ao usuário, a execução é encerrada.
if (!$tarefaExistente) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Tarefa não encontrada ou não pertence a você.";
    echo json_encode($retorno);
    exit;
}




// Deleta a tarefa
$stmtDelete = $conexao->prepare("DELETE FROM tarefas WHERE id = :tarefa_id");

$executou = $stmtDelete->execute([
    ":tarefa_id" => $tarefa_id
]);




// Define a resposta final conforme o resultado da exclusão
if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Tarefa deletada com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao deletar a tarefa.";
}




// Retorna a resposta final em JSON.
echo json_encode($retorno);