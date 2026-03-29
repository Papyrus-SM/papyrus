<?php

include_once(__DIR__ . '/../config/headers.php');
include_once(__DIR__ . '/../config/input.php');
include_once(__DIR__ . '/../config/conexao.php');

session_start();

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

$body = getBody();

$email = trim($body["email"] ?? "");
$senha = trim($body["senha"] ?? "");

if (empty($email) || empty($senha)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "E-mail e senha são obrigatórios.";

    echo json_encode($retorno);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "E-mail inválido.";

    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmt = $conexao->prepare("
    SELECT id, nome, email, senha_hash
    FROM users
    WHERE email = :email
    LIMIT 1
");

$stmt->execute([
    ":email" => $email
]);

$usuario = $stmt->fetch();

if (!$usuario) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário ou senha inválidos.";

    echo json_encode($retorno);
    exit;
}

if (!password_verify($senha, $usuario["senha_hash"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário ou senha inválidos.";

    echo json_encode($retorno);
    exit;
}

$_SESSION["usuario"] = [
    "id" => $usuario["id"],
    "nome" => $usuario["nome"],
    "email" => $usuario["email"]
];

$retorno["status"] = "ok";
$retorno["mensagem"] = "Login realizado com sucesso.";
$retorno["data"] = [
    "usuario" => $_SESSION["usuario"]
];

echo json_encode($retorno);