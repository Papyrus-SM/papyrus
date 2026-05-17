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

// Apenas usuários autenticados podem editar matérias.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";

    echo json_encode($retorno);
    exit;
}

// Lê o corpo da requisição.
$body = getBody();

$id = $body["id"] ?? null;
$nome = trim($body["nome"] ?? "");
$descricao = trim($body["descricao"] ?? "");
$color_hex = trim($body["color_hex"] ?? "#F8FF97");

// Validação do ID.
if (!filter_var($id, FILTER_VALIDATE_INT)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID da matéria inválido.";

    echo json_encode($retorno);
    exit;
}

$id = (int) $id;

// Validação do nome.
if (empty($nome)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O nome da matéria é obrigatório.";

    echo json_encode($retorno);
    exit;
}

if (strlen($nome) > 100) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O nome da matéria deve ter no máximo 100 caracteres.";

    echo json_encode($retorno);
    exit;
}

// Validação da cor hexadecimal.
if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $color_hex)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Cor inválida. Use o formato hexadecimal, por exemplo: #F8FF97.";

    echo json_encode($retorno);
    exit;
}


// Abre conexão com o banco.
$conexao = getConexao();

// Atualiza apenas a matéria que pertence ao usuário autenticado.
$stmt = $conexao->prepare("
    UPDATE materias
    SET nome = :nome,
        descricao = :descricao,
        color_hex = :color_hex
    WHERE id = :id
    AND user_id = :user_id
    LIMIT 1
");

$executou = $stmt->execute([
    ":nome" => $nome,
    ":descricao" => $descricao ?: null,
    ":color_hex" => $color_hex,
    ":id" => $id,
    ":user_id" => $_SESSION["usuario"]["id"]
]);

if ($executou && $stmt->rowCount() > 0) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Matéria atualizada com sucesso.";
    $retorno["data"] = [
        "materia" => [
            "id" => $id,
            "nome" => $nome,
            "descricao" => $descricao ?: null,
            "color_hex" => $color_hex,
        ]
    ];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Nenhuma alteração foi realizada ou a matéria não pertence ao usuário.";
}

echo json_encode($retorno);