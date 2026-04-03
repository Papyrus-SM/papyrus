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

// Apenas usuários autenticados podem criar matérias.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";

    echo json_encode($retorno);
    exit;
}

// Lê o corpo da requisição.
$body = getBody();

// Coleta e sanitização dos dados recebidos.
$nome = trim($body["nome"] ?? "");
$descricao = trim($body["descricao"] ?? "");
$color_hex = trim($body["color_hex"] ?? "#F8FF97");
$horas_semanais = $body["horas_semanais"] ?? 0;

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

// Validação simples da cor hexadecimal no formato #RRGGBB.
if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $color_hex)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Cor inválida. Use o formato hexadecimal, por exemplo: #F8FF97.";

    echo json_encode($retorno);
    exit;
}

// Validação de horas semanais.
if (!filter_var($horas_semanais, FILTER_VALIDATE_INT) && $horas_semanais !== 0 && $horas_semanais !== "0") {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Horas semanais inválidas.";

    echo json_encode($retorno);
    exit;
}

$horas_semanais = (int) $horas_semanais;

if ($horas_semanais < 0 || $horas_semanais > 255) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Horas semanais devem estar entre 0 e 255.";

    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Insere a nova matéria.
$stmt = $conexao->prepare("
    INSERT INTO materias (user_id, nome, descricao, color_hex, horas_semanais)
    VALUES (:user_id, :nome, :descricao, :color_hex, :horas_semanais)
");

$executou = $stmt->execute([
    ":user_id" => $_SESSION["usuario"]["id"],
    ":nome" => $nome,
    ":descricao" => $descricao ?: null,
    ":color_hex" => $color_hex,
    ":horas_semanais" => $horas_semanais
]);

if ($executou) {
    $materiaId = $conexao->lastInsertId();

    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Matéria criada com sucesso.";
    $retorno["data"] = [
        "materia" => [
            "id" => (int) $materiaId,
            "nome" => $nome,
            "descricao" => $descricao ?: null,
            "color_hex" => $color_hex,
            "horas_semanais" => $horas_semanais
        ]
    ];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível criar a matéria.";
}

echo json_encode($retorno);