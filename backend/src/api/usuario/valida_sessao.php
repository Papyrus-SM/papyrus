<?php

include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/headers.php');

session_start();

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

if (isset($_SESSION["usuario"])) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Sessão válida.";
    $retorno["data"] = [
        "usuario" => $_SESSION["usuario"]
    ];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Nenhum usuário autenticado.";
    $retorno["data"] = [];
}

echo json_encode($retorno);