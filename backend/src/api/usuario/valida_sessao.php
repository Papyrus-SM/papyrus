<?php

// Carrega utilitários da API.
// headers.php garante resposta JSON adequada.
// input.php está incluído por padrão do projeto, mesmo que aqui não haja leitura de body.
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/conexao.php');

// Inicia a sessão para consultar se existe usuário autenticado.
session_start();

// Estrutura padrão de resposta da API.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

function encerrarSessaoAtual()
{
    $_SESSION = [];

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }

    session_destroy();
}

// Caso não exista usuário em sessão, informa que não há autenticação ativa.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Nenhum usuário autenticado.";
    $retorno["data"] = [];

    echo json_encode($retorno);
    exit;
}

$usuarioSessao = $_SESSION["usuario"];
$usuarioId = (int)($usuarioSessao["id"] ?? 0);

if ($usuarioId <= 0) {
    encerrarSessaoAtual();

    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Sessão inválida.";
    $retorno["data"] = [];

    echo json_encode($retorno);
    exit;
}

// Consulta o usuário novamente no banco para garantir que a sessão ainda é válida.
// Assim, se o admin bloquear a conta enquanto ela estiver logada, o acesso é encerrado.
$conexao = getConexao();

$stmt = $conexao->prepare("
    SELECT id, nome, email, papel, status_conta
    FROM users
    WHERE id = :id
    LIMIT 1
");

$stmt->execute([
    ":id" => $usuarioId
]);

$usuarioAtual = $stmt->fetch();

if (!$usuarioAtual) {
    encerrarSessaoAtual();

    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não encontrado.";
    $retorno["data"] = [];

    echo json_encode($retorno);
    exit;
}

$statusConta = $usuarioAtual["status_conta"] ?? "ativo";

if ($statusConta === "bloqueado") {
    encerrarSessaoAtual();

    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Esta conta está bloqueada. Entre em contato com um administrador.";
    $retorno["data"] = [];

    echo json_encode($retorno);
    exit;
}

// Atualiza a sessão com os dados atuais do banco.
// Isso mantém nome, papel e status sempre sincronizados.
$_SESSION["usuario"] = [
    "id" => $usuarioAtual["id"],
    "nome" => $usuarioAtual["nome"],
    "email" => $usuarioAtual["email"],
    "papel" => $usuarioAtual["papel"],
    "status_conta" => $statusConta
];

$retorno["status"] = "ok";
$retorno["mensagem"] = "Sessão válida.";
$retorno["data"] = [
    "usuario" => $_SESSION["usuario"]
];

// Retorna a resposta em JSON.
echo json_encode($retorno);
