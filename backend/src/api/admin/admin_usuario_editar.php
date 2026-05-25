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

if (($_SESSION["usuario"]["papel"] ?? "") !== "admin") {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Acesso negado.";
    echo json_encode($retorno);
    exit;
}

$body = getBody();

$id = (int)($body["id"] ?? 0);
$nome = trim($body["nome"] ?? "");
$papel = trim($body["papel"] ?? "");
$statusConta = trim($body["status_conta"] ?? "ativo");

if ($id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID do usuário inválido.";
    echo json_encode($retorno);
    exit;
}

if (empty($nome)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O nome é obrigatório.";
    echo json_encode($retorno);
    exit;
}

if (strlen($nome) > 100) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O nome deve ter no máximo 100 caracteres.";
    echo json_encode($retorno);
    exit;
}

$papeisPermitidos = ["admin", "estudante"];
if (!in_array($papel, $papeisPermitidos, true)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Papel inválido.";
    echo json_encode($retorno);
    exit;
}

$statusPermitidos = ["ativo", "bloqueado"];
if (!in_array($statusConta, $statusPermitidos, true)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Status da conta inválido.";
    echo json_encode($retorno);
    exit;
}

if ((int)$_SESSION["usuario"]["id"] === $id && $statusConta === "bloqueado") {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Você não pode bloquear sua própria conta por esta tela.";
    echo json_encode($retorno);
    exit;
}

$conexao = getConexao();

$stmt = $conexao->prepare("
    UPDATE users
    SET nome = :nome,
        papel = :papel,
        status_conta = :status_conta
    WHERE id = :id
    LIMIT 1
");

$executou = $stmt->execute([
    ":nome" => $nome,
    ":papel" => $papel,
    ":status_conta" => $statusConta,
    ":id" => $id
]);

if (!$executou) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Não foi possível atualizar o usuário.";
    echo json_encode($retorno);
    exit;
}

$stmtSelect = $conexao->prepare("
    SELECT id, nome, email, data_nascimento, genero, papel, status_conta
    FROM users
    WHERE id = :id
    LIMIT 1
");
$stmtSelect->execute([":id" => $id]);
$usuarioAtualizado = $stmtSelect->fetch();

if (!$usuarioAtualizado) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não encontrado.";
    echo json_encode($retorno);
    exit;
}

// Se o admin editar a própria conta, atualiza a sessão também.
if ((int)$_SESSION["usuario"]["id"] === $id) {
    $_SESSION["usuario"]["nome"] = $usuarioAtualizado["nome"];
    $_SESSION["usuario"]["papel"] = $usuarioAtualizado["papel"];
    $_SESSION["usuario"]["status_conta"] = $usuarioAtualizado["status_conta"];
}

$retorno["status"] = "ok";
$retorno["mensagem"] = $stmt->rowCount() > 0
    ? "Usuário atualizado com sucesso."
    : "Nenhuma alteração foi realizada.";
$retorno["data"] = [
    "usuario" => $usuarioAtualizado
];

echo json_encode($retorno);
