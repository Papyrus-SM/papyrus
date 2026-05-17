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

$conexao = getConexao();

$stmt = $conexao->prepare("
    SELECT c.id, c.materia_id, c.titulo, c.descricao, c.data_criacao, m.nome AS materia_nome, m.color_hex AS materia_cor,
    (SELECT COUNT(*) FROM paginas WHERE caderno_id = c.id) AS total_paginas
    FROM cadernos c
    INNER JOIN materias m ON m.id = c.materia_id
    WHERE m.user_id = :user_id
    ORDER BY c.data_criacao DESC
");

$stmt->execute([
    ":user_id" => $_SESSION["usuario"]["id"]
]);

$cadernos = $stmt->fetchAll();

$retorno["status"] = "ok";
$retorno["mensagem"] = "Cadernos listados com sucesso.";
$retorno["data"] = [
    "cadernos" => $cadernos
];

echo json_encode($retorno);
