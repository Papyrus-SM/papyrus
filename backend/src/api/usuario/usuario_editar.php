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

$body = getBody();

$nome = trim($body["nome"] ?? "");
// trim remove os espaços em branco do começo e do final da string
// exemplo: "  João  " passa a ser "João"

if (empty($nome)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O nome é obrigatório.";

    echo json_encode($retorno);
    exit;
}

if (strlen($nome) > 100) {
    // strlen retorna a quantidade de caracteres da string
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O nome deve ter no máximo 100 caracteres.";

    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmt = $conexao->prepare("
    UPDATE users
    SET nome = :nome
    WHERE id = :id
    LIMIT 1
");

$executou = $stmt->execute([
    ":nome" => $nome,
    ":id" => $_SESSION["usuario"]["id"]
]);

if ($executou && $stmt->rowCount() > 0) {
    // rowCount retorna quantas linhas foram afetadas pela operação no banco
    $_SESSION["usuario"]["nome"] = $nome;

    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Perfil atualizado com sucesso.";
    $retorno["data"] = [
        "usuario" => $_SESSION["usuario"]
    ];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Nenhuma alteração foi realizada.";
    $retorno["data"] = [
        "usuario" => $_SESSION["usuario"]
    ];
}

echo json_encode($retorno);
