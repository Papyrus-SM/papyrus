<?php

//inclui o aquivo "autoload", que detecta automaticamente as bibliotecas instaladas
require_once __DIR__ . '/../../vendor/autoload.php';

//localiza o arquivo .env na raiz do projeto backend,
//createImmutable garante que uma vez carregadas, as variaveis presentes no .env não vão ser alteradas enquanto estão rodando
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
// le as definições dentro do arquivo .env e carregam elas para o php
$dotenv->load();

function getConexao(): PDO
{
    $servidor = $_ENV['DB_HOST'] ?? 'localhost';
    $porta = $_ENV['DB_PORT'] ?? '3306';
    $banco = $_ENV['DB_NAME'] ?? '';
    $usuario = $_ENV['DB_USER'] ?? '';
    $senha = $_ENV['DB_PASS'] ?? '';
    $charset = $_ENV['DB_CHARSET'] ?? 'utf8mb4';

    try {
        $dsn = "mysql:host={$servidor};port={$porta};dbname={$banco};charset={$charset}";

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