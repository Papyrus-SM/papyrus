<?php

$servidor = "localhost";
$banco = "papyrus";
$usuario = "root";
$senha = "";
$charset = "utf8mb4";

try {
    $conexao = new PDO(
        "mysql:host=$servidor;dbname=$banco;charset=$charset",
        $usuario,
        $senha
    );

    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexao->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode([
        "status" => "nok",
        "mensagem" => "Erro na conexão com o banco de dados.",
        "data" => []
    ]);
    exit;
}