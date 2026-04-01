<?php

// Carrega utilitários da API.
// headers.php garante resposta JSON adequada.
// input.php está incluído por padrão do projeto, mesmo que aqui não haja leitura de body.
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/headers.php');

// Inicia a sessão para consultar se existe usuário autenticado.
session_start();

// Estrutura padrão de resposta da API.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Se existir usuário na sessão, a autenticação continua válida.
if (isset($_SESSION["usuario"])) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Sessão válida.";
    $retorno["data"] = [
        "usuario" => $_SESSION["usuario"]
    ];
} else {
    // Caso contrário, informa que não há usuário autenticado no momento.
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Nenhum usuário autenticado.";
    $retorno["data"] = [];
}

// Retorna a resposta em JSON.
echo json_encode($retorno);