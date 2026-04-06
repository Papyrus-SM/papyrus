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

$conexao = getConexao();

$stmt = $conexao->prepare("
    UPDATE users
    SET nome = :nome,
        papel = :papel
    WHERE id = :id
    LIMIT 1
");

$executou = $stmt->execute([
    ":nome" => $nome,
    ":papel" => $papel,
    ":id" => $id
]);

if ($executou && $stmt->rowCount() > 0) {
    // Se o admin editar o próprio nome/papel, atualiza a sessão também.
    if ((int)$_SESSION["usuario"]["id"] === $id) {
        $_SESSION["usuario"]["nome"] = $nome;
        $_SESSION["usuario"]["papel"] = $papel;
    }

    $stmtSelect = $conexao->prepare("
        SELECT id, nome, email, data_nascimento, genero, papel
        FROM users
        WHERE id = :id
        LIMIT 1
    ");
    $stmtSelect->execute([":id" => $id]);
    $usuarioAtualizado = $stmtSelect->fetch();

    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Usuário atualizado com sucesso.";
    $retorno["data"] = [
        "usuario" => $usuarioAtualizado
    ];
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Nenhuma alteração foi realizada.";
}

echo json_encode($retorno);