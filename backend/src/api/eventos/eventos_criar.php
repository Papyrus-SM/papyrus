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

if (empty($titulo)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Informe um título para o evento.";
    echo json_encode($retorno);
    exit;
}

if (empty($data_evento)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Selecione uma data para o evento.";
    echo json_encode($retorno);
    exit;
}

$data = DateTime::createFromFormat('Y-m-d', $data_evento);
if (!$data || $data->format('Y-m-d') !== $data_evento) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Data inválida. Use o formato YYYY-MM-DD.";
    echo json_encode($retorno);
    exit;
}

if ($hora_evento !== null && $hora_evento !== "") {
    $hora = DateTime::createFromFormat('H:i', $hora_evento);
    if (!$hora || $hora->format('H:i') !== $hora_evento) {
        $retorno["status"] = "nok";
        $retorno["mensagem"] = "Hora inválida. Use o formato HH:MM.";
        echo json_encode($retorno);
        exit;
    }
} else {
    $hora_evento = null;
}

$conexao = getConexao();

$user_id = (int) $usuario["id"];

$stmt = $conexao->prepare("
    INSERT INTO eventos (
        user_id, titulo, descricao, data_evento, hora_evento, local, cor
    ) VALUES (
        :user_id, :titulo, :descricao, :data_evento, :hora_evento, :local, :cor
    )
");

$executou = $stmt->execute([
    ":user_id" => $user_id,
    ":titulo" => $titulo,
    ":descricao" => $descricao,
    ":data_evento" => $data_evento,
    ":hora_evento" => $hora_evento,
    ":local" => $local,
    ":cor" => $cor,
]);

if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Evento criado com sucesso.";
    $retorno["data"] = [
        "id" => (int)$conexao->lastInsertId()
    ];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao criar o evento.";
}

echo json_encode($retorno);
