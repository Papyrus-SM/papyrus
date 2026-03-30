<?php

function getConexao(): PDO
{
    $servidor = "127.0.0.1";
    $porta = "3306";
    $banco = "papyrus";
    $usuario = "root";
    $senha = "Jv240723.";
    $charset = "utf8mb4";

    try {
        $dsn = "mysql:host=$servidor;port=$porta;dbname=$banco;charset=$charset";

        $conexao = new PDO($dsn, $usuario, $senha);

        $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conexao->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        return $conexao;

    } catch (PDOException $e) {
        header("Content-Type: application/json; charset=utf-8");
        echo json_encode([
            "status" => "nok",
            "mensagem" => $e->getMessage(),
            "data" => []
        ]);
        exit;
    }
}