<?php

include_once(__DIR__ . '/../../config/headers.php');
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

if (($_SESSION["usuario"]["papel"] ?? "") !== "admin") {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Acesso negado.";
    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmt = $conexao->prepare("
    SELECT id, nome, email, data_nascimento, genero, papel
    FROM users
    ORDER BY nome ASC
");

$stmt->execute();
$usuarios = $stmt->fetchAll();

$retorno["status"] = "ok";
$retorno["mensagem"] = "Usuários listados com sucesso.";
$retorno["data"] = [
    "usuarios" => $usuarios
];

echo json_encode($retorno);