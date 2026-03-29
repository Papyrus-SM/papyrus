<?php

header("Content-Type: application/json; charset=utf-8");

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