<?php

session_start();

include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');
include_once(__DIR__ . '/../../config/auth.php');

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

$usuario = requireStudent($retorno);

$body = getBody();

$id = (int)($body["id"] ?? 0);
$titulo = trim($body["titulo"] ?? "");
$descricao = $body["descricao"] ?? null;
$data_evento = $body["data_evento"] ?? null;
$hora_evento = $body["hora_evento"] ?? null;
$local = $body["local"] ?? null;
$cor = $body["cor"] ?? '#4A90D9';

if ($descricao !== null) {
    $descricao = trim($descricao);
    if ($descricao === '') $descricao = null;
}

if ($local !== null) {
    $local = trim($local);
    if ($local === '') $local = null;
}

if ($id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Evento inválido.";
    echo json_encode($retorno);
    exit;
}

if (empty($titulo)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Informe um título para o evento.";
    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$user_id = (int) $usuario["id"];

$stmt = $conexao->prepare("
    UPDATE eventos
    SET titulo = :titulo,
        descricao = :descricao,
        data_evento = :data_evento,
        hora_evento = :hora_evento,
        local = :local,
        cor = :cor
    WHERE id = :id AND user_id = :user_id
");

$executou = $stmt->execute([
    ":id" => $id,
    ":user_id" => $user_id,
    ":titulo" => $titulo,
    ":descricao" => $descricao,
    ":data_evento" => $data_evento,
    ":hora_evento" => $hora_evento,
    ":local" => $local,
    ":cor" => $cor,
]);

if ($executou && $stmt->rowCount() > 0) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Evento atualizado com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao atualizar o evento ou evento não encontrado.";
}

echo json_encode($retorno);
