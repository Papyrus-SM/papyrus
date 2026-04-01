<?php

// Carrega configurações base da API.
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

// Inicia a sessão para que, em caso de login válido, o usuário autenticado
// possa ficar armazenado no servidor.
session_start();

// Estrutura padrão de resposta da API.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Lê o JSON enviado pelo frontend.
$body = getBody();

// Coleta e limpeza inicial dos dados.
// trim() remove espaços extras do início e do fim.
$email = trim($body["email"] ?? "");
$senha = trim($body["senha"] ?? "");

// Valida se os campos essenciais foram enviados.
if (empty($email) || empty($senha)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "E-mail e senha são obrigatórios.";

    echo json_encode($retorno);
    exit;
}

// Valida o formato do e-mail.
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "E-mail inválido.";

    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Busca no banco o usuário correspondente ao e-mail informado.
// Também traz o hash da senha para comparação segura.
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

// Se nenhum usuário for encontrado, retorna erro genérico.
if (!$usuario) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário ou senha inválidos.";

    echo json_encode($retorno);
    exit;
}

// Verifica se a senha digitada corresponde ao hash salvo no banco.
// password_verify compara a senha em texto puro com o hash armazenado.
if (!password_verify($senha, $usuario["senha_hash"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário ou senha inválidos.";

    echo json_encode($retorno);
    exit;
}

// Se login for válido, salva os dados principais do usuário na sessão.
// Isso permite autenticação nas próximas requisições.
$_SESSION["usuario"] = [
    "id" => $usuario["id"],
    "nome" => $usuario["nome"],
    "email" => $usuario["email"]
];

// Monta resposta de sucesso com os dados do usuário autenticado.
$retorno["status"] = "ok";
$retorno["mensagem"] = "Login realizado com sucesso.";
$retorno["data"] = [
    "usuario" => $_SESSION["usuario"]
];

// Retorna JSON para o frontend.
echo json_encode($retorno);