<?php

// Carrega configurações da API e conexão com o banco.
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

// Inicia a sessão para identificar o usuário autenticado.
session_start();

// Estrutura padrão de resposta da API.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Apenas usuários autenticados podem listar suas matérias.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";

    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Busca todas as matérias do usuário autenticado.
$stmt = $conexao->prepare("
    SELECT id, nome, descricao, color_hex, horas_semanais
    FROM materias
    WHERE user_id = :user_id
    ORDER BY id ASC
");

$stmt->execute([
    ":user_id" => $_SESSION["usuario"]["id"]
]);

$materias = $stmt->fetchAll();

$retorno["status"] = "ok";
$retorno["mensagem"] = "Matérias listadas com sucesso.";
$retorno["data"] = [
    "materias" => $materias
];

echo json_encode($retorno);