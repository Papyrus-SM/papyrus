<?php

include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

session_start();

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";

    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmt = $conexao->prepare("
    DELETE FROM users
    WHERE id = :id
    LIMIT 1
");

$executou = $stmt->execute([
    ":id" => $_SESSION["usuario"]["id"]
]);

if ($executou && $stmt->rowCount() > 0) {
    // rowCount retorna quantas linhas foram afetadas pela operação no banco
    session_unset();
    // session_unset remove todas as variáveis salvas na sessão atual

    session_destroy();
    // session_destroy encerra a sessão atual do usuário no servidor

    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Conta excluída com sucesso.";
    $retorno["data"] = [];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível excluir a conta.";

    echo json_encode($retorno);
    exit;
}

echo json_encode($retorno);
