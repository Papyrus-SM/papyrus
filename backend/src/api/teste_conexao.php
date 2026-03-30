<?php

require_once __DIR__ . '/../config/conexao.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $pdo = getConexao();

    $stmt = $pdo->query("SELECT DATABASE() AS banco, NOW() AS agora");

    echo json_encode([
        "status" => "ok",
        "mensagem" => "Conexão realizada com sucesso",
        "data" => $stmt->fetch()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "status" => "nok",
        "mensagem" => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}