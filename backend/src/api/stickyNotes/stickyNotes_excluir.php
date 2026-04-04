<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Arquivos de configuração compartilhados da API:
// headers.php -> define cabeçalhos da resposta (JSON, CORS, etc.)
// input.php -> fornece funções utilitárias para ler o body da requisição
// conexao.php -> cria e retorna a conexão com o banco de dados
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

session_start();

// Estrutura padrão de resposta da API.
// Ela será preenchida ao longo da execução e devolvida em JSON no final.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];


// Abre conexão com o banco.
$conexao = getConexao();

$body = getBody();
$id = $body["id"] ?? null;

if (!$id) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID da nota é obrigatório.";

    echo json_encode($retorno);
    exit;
}

// Prepara o DELETE da anotacao.
try {
    $stmt = $conexao->prepare("
    DELETE FROM sticky_notes 
    WHERE id = :id
    ");
    $executou = $stmt->execute([
        ":id" => $id
    ]);

    // Define a resposta final conforme o resultado do cadastro.
    if ($executou) {
        $retorno["status"] = "ok";
        $retorno["mensagem"] = "Nota excluida com sucesso.";
    } else {
        $retorno["status"] = "nok";
        $retorno["mensagem"] = "Falha ao excluir a nota.";
    }

} catch (Exception $e) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Erro no servidor.";
}


// Retorna a resposta da API em JSON.
echo json_encode($retorno);