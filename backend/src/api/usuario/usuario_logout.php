<?php

// Carrega os headers da API e utilitários de input.
// Neste caso, conexão com banco não é necessária, pois logout trabalha só com sessão.
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');

// Inicia a sessão atual para poder limpá-la.
session_start();

// Estrutura padrão de resposta da API.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Remove os dados salvos na sessão e encerra a autenticação do usuário.
session_unset();
session_destroy();

// Monta resposta de sucesso.
$retorno["status"] = "ok";
$retorno["mensagem"] = "Logout realizado com sucesso.";
$retorno["data"] = [];

// Retorna JSON para o frontend.
echo json_encode($retorno);