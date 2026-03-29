<?php

header("Content-Type: application/json; charset=utf-8");

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