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

// Apenas usuários autenticados podem concluir o onboarding.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";

    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Insere ou atualiza o status do onboarding.
// Como user_id é UNIQUE, usamos ON DUPLICATE KEY UPDATE para simplificar.
$stmt = $conexao->prepare("
    INSERT INTO perfil_onboarding (user_id, concluido, concluido_em)
    VALUES (:user_id, TRUE, NOW())
    ON DUPLICATE KEY UPDATE
        concluido = TRUE,
        concluido_em = NOW()
");

$executou = $stmt->execute([
    ":user_id" => $_SESSION["usuario"]["id"]
]);

if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Onboarding concluído com sucesso.";
    $retorno["data"] = [
        "onboarding" => [
            "concluido" => true
        ]
    ];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível concluir o onboarding.";
}

echo json_encode($retorno);