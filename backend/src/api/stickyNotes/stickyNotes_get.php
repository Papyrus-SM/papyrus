<?php

// Arquivos de configuração compartilhados da API:
// headers.php -> define cabeçalhos da resposta (JSON, CORS, etc.)
// input.php -> fornece funções utilitárias para ler o body da requisição
// conexao.php -> cria e retorna a conexão com o banco de dados
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');
include_once(__DIR__ . '/../../config/auth.php');

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

$usuario = requireStudent($retorno);
$conexao = getConexao();

try {

    $stmt = $conexao->prepare("
        SELECT id, titulo, texto, cor, pos_x, pos_y
        FROM sticky_notes
        WHERE user_id = :user_id
        ORDER BY id DESC
    ");
    $stmt->execute([":user_id" => (int) $usuario["id"]]);

    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $retorno["status"] = "ok";
    $retorno["data"] = $resultado;

} catch (Exception $e) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Erro ao buscar notas.";
}

echo json_encode($retorno);
