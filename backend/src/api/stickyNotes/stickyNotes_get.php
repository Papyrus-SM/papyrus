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

$conexao = getConexao();

session_start();

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

try {

    $stmt = $conexao->prepare("SELECT * FROM sticky_notes"); // aqui tem que ser o id do usuario para mostrar somente as notas dele, depois que tiver a sessão funcionando $stmt = $conexao->prepare("SELECT * FROM sticky_notes WHERE user_id = :user_id"); $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute(); // executa a consulta SQL

    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC); // fetchAll() retorna todas as linhas do resultado da consulta como um array associativo. Cada elemento do array é um array associativo representando uma linha da tabela sticky_notes, com as chaves correspondendo aos nomes das colunas (id, titulo, texto, cor, user_id, etc.).

    $retorno["status"] = "ok";
    $retorno["data"] = $resultado;

} catch (Exception $e) { // captura qualquer exceção que possa ocorrer durante a execução do código dentro do bloco try. Se ocorrer um erro, o código dentro do catch será executado, permitindo que você lide com o erro de forma controlada.
    $retorno["status"] = "error";
    $retorno["mensagem"] = $e->getMessage();
}

echo json_encode($retorno); // json_encode() é uma função do PHP que converte um array ou objeto em uma string JSON. Aqui, ela está convertendo o array $retorno em uma string JSON para ser enviada como resposta da API. O resultado será algo como: {"status":"ok","mensagem":"","data":[{"id":1,"titulo":"Nota 1","texto":"Texto da nota 1","cor":"#ffe96d","user_id":1}, ...]}