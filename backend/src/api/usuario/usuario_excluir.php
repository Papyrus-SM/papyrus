<?php

// Carrega configurações e conexão com o banco.
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

// Inicia a sessão para identificar o usuário autenticado.
session_start();

// Estrutura padrão de resposta da API.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Apenas usuários autenticados podem excluir a própria conta.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";

    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Prepara o DELETE do usuário logado.
// O ID é obtido pela sessão, não pelo frontend.
$stmt = $conexao->prepare("
    DELETE FROM users
    WHERE id = :id
    LIMIT 1
");

// Executa a exclusão.
$executou = $stmt->execute([
    ":id" => $_SESSION["usuario"]["id"]
]);

// Se a exclusão aconteceu de fato, também encerra a sessão atual do usuário.
if ($executou && $stmt->rowCount() > 0) {
    // rowCount() indica quantas linhas foram afetadas.
    session_unset();
    // session_unset() remove as variáveis da sessão atual.

    session_destroy();
    // session_destroy() encerra a sessão do lado do servidor.

    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Conta excluída com sucesso.";
    $retorno["data"] = [];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível excluir a conta.";

    echo json_encode($retorno);
    exit;
}

// Retorna a resposta final em JSON.
echo json_encode($retorno);