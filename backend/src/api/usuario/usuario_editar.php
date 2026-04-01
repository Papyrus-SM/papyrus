<?php

// Carrega configurações da API e acesso ao banco.
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

// Este endpoint só pode ser usado por um usuário logado.
// Se não existir usuário salvo na sessão, a execução é encerrada.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";

    echo json_encode($retorno);
    exit;
}

// Lê o corpo da requisição.
$body = getBody();

// Coleta o novo nome informado pelo frontend.
// trim() remove espaços desnecessários nas bordas do texto.
$nome = trim($body["nome"] ?? "");

// Regra: nome é obrigatório.
if (empty($nome)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O nome é obrigatório.";

    echo json_encode($retorno);
    exit;
}

// Regra: nome pode ter no máximo 100 caracteres.
// strlen() retorna o tamanho da string.
if (strlen($nome) > 100) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "O nome deve ter no máximo 100 caracteres.";

    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Prepara o UPDATE do nome do usuário autenticado.
// O ID vem da sessão, então o frontend não escolhe qual usuário editar.
$stmt = $conexao->prepare("
    UPDATE users
    SET nome = :nome
    WHERE id = :id
    LIMIT 1
");

// Executa o UPDATE com os parâmetros informados.
$executou = $stmt->execute([
    ":nome" => $nome,
    ":id" => $_SESSION["usuario"]["id"]
]);

// Se houve atualização real no banco, atualiza também o dado salvo na sessão.
// rowCount() informa quantas linhas foram afetadas pela operação.
if ($executou && $stmt->rowCount() > 0) {
    $_SESSION["usuario"]["nome"] = $nome;

    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Perfil atualizado com sucesso.";
    $retorno["data"] = [
        "usuario" => $_SESSION["usuario"]
    ];
} else {
    // Caso nenhuma linha tenha sido alterada, a API informa isso ao frontend.
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Nenhuma alteração foi realizada.";
    $retorno["data"] = [
        "usuario" => $_SESSION["usuario"]
    ];
}

// Retorna resposta em JSON.
echo json_encode($retorno);