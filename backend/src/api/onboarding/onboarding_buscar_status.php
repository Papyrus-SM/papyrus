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

// Apenas usuários autenticados podem consultar o onboarding.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";

    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Busca o status atual do onboarding do usuário.
$stmt = $conexao->prepare("
    SELECT id, concluido, concluido_em
    FROM perfil_onboarding
    WHERE user_id = :user_id
    LIMIT 1
");

$stmt->execute([
    ":user_id" => $_SESSION["usuario"]["id"]
]);

$perfil = $stmt->fetch();

// Se ainda não existir linha para o usuário, assume onboarding pendente.
if (!$perfil) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Onboarding ainda não iniciado.";
    $retorno["data"] = [
        "onboarding" => [
            "concluido" => false,
            "concluido_em" => null,
            "mostrar_modal" => true
        ]
    ];

    echo json_encode($retorno);
    exit;
}

// Caso a linha exista, devolve o status atual.
$concluido = (bool) $perfil["concluido"];

$retorno["status"] = "ok";
$retorno["mensagem"] = $concluido
    ? "Onboarding já concluído."
    : "Onboarding pendente.";

$retorno["data"] = [
    "onboarding" => [
        "concluido" => $concluido,
        "concluido_em" => $perfil["concluido_em"],
        "mostrar_modal" => !$concluido
    ]
];

echo json_encode($retorno);