<?php

include_once(__DIR__ . '/../config/headers.php');
include_once(__DIR__ . '/../config/input.php');

session_start();

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

session_unset();
session_destroy();

$retorno["status"] = "ok";
$retorno["mensagem"] = "Logout realizado com sucesso.";
$retorno["data"] = [];

echo json_encode($retorno);