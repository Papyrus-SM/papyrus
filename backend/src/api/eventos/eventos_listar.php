<?php

session_start();

include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/conexao.php');
include_once(__DIR__ . '/../../config/auth.php');

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

$usuario = requireStudent($retorno);

$conexao = getConexao();

$user_id = (int) $usuario["id"];

$stmt = $conexao->prepare("
    SELECT id, titulo, descricao, data_evento, hora_evento, local, cor
    FROM eventos
    WHERE user_id = :user_id
    ORDER BY data_evento ASC, hora_evento ASC
");

$stmt->execute([
    ":user_id" => $user_id
]);

$eventos = $stmt->fetchAll();

$retorno["status"] = "ok";
$retorno["data"] = $eventos;

echo json_encode($retorno);
