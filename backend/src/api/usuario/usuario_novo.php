<?php

include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

$body = getBody();

$nome = trim($body["nome"] ?? "");
//trim é responsavel por "apagar" espaços antes e depois na string
//exemplo: " joao ", trim retorna: "joao"

$email = trim($body["email"] ?? "");
$senha = trim($body["senha"] ?? "");
$data_nascimento = trim($body["data_nascimento"] ?? "");
$genero = trim($body["genero"] ?? "");

if (
    empty($nome) ||
    empty($email) ||
    empty($senha) ||
    empty($data_nascimento) ||
    empty($genero)
) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Todos os campos são obrigatórios.";

    echo json_encode($retorno);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "E-mail inválido.";

    echo json_encode($retorno);
    exit;
}

if (strlen($senha) < 6) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "A senha deve ter pelo menos 6 caracteres.";

    echo json_encode($retorno);
    exit;
}

$dataValida = DateTime::createFromFormat('Y-m-d', $data_nascimento);

if (!$dataValida || $dataValida->format('Y-m-d') !== $data_nascimento) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Data de nascimento inválida.";

    echo json_encode($retorno);
    exit;
}

$generosPermitidos = ["masculino", "feminino", "prefiro_nao_dizer"];

if (!in_array($genero, $generosPermitidos)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Gênero inválido.";

    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmt = $conexao->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
$stmt->execute([
    ":email" => $email
]);

$usuarioExistente = $stmt->fetch();

if ($usuarioExistente) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Já existe um usuário cadastrado com este e-mail.";

    echo json_encode($retorno);
    exit;
}

$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

$stmt = $conexao->prepare("
    INSERT INTO users (nome, email, senha_hash, data_nascimento, genero)
    VALUES (:nome, :email, :senha_hash, :data_nascimento, :genero)
");

$executou = $stmt->execute([
    ":nome" => $nome,
    ":email" => $email,
    ":senha_hash" => $senha_hash,
    ":data_nascimento" => $data_nascimento,
    ":genero" => $genero
]);

if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Usuário cadastrado com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao cadastrar usuário.";
}

echo json_encode($retorno);