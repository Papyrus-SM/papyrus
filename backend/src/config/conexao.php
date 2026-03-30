<?php

function getConexao(): PDO
{
    $servidor = $_ENV['DB_HOST'];
    $porta = $_ENV['DB_PORT'];
    $banco = $_ENV['DB_NAME'];
    $usuario = $_ENV['DB_USER'];
    $senha = $_ENV['DB_PASS'];
    $charset = $_ENV['DB_CHARSET'];

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