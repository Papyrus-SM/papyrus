<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Arquivos de configuração compartilhados da API:
// headers.php -> define cabeçalhos da resposta (JSON, CORS, etc.)
// conexao.php -> cria e retorna a conexão com o banco de dados
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/conexao.php');

session_start();

// Estrutura padrão de resposta da API.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Verifica se o usuário está autenticado.
if (!isset($_SESSION["usuario"]["id"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";
    echo json_encode($retorno);
    exit;
}

// ID do usuário logado (via sessão).
$user_id = $_SESSION["usuario"]["id"];

// Abre conexão com o banco.
$conexao = getConexao();

// Busca todas as conversas do usuário logado, ordenadas pela mais recente.
// Somente conversas do próprio usuário são retornadas (isolamento de dados).
$stmt = $conexao->prepare("
    SELECT id, titulo, criada_em
    FROM chat_conversas
    WHERE user_id = :user_id
    ORDER BY criada_em DESC
");
$stmt->execute([":user_id" => $user_id]);
$conversas = $stmt->fetchAll();

// Retorna a lista de conversas.
$retorno["status"] = "ok";
$retorno["mensagem"] = "Conversas listadas com sucesso.";
$retorno["data"] = $conversas;

echo json_encode($retorno);
