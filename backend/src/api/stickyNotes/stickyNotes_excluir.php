<?php

// Arquivos de configuração compartilhados da API:
// headers.php -> define cabeçalhos da resposta (JSON, CORS, etc.)
// input.php -> fornece funções utilitárias para ler o body da requisição
// conexao.php -> cria e retorna a conexão com o banco de dados
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');
include_once(__DIR__ . '/../../config/auth.php');

// Estrutura padrão de resposta da API.
// Ela será preenchida ao longo da execução e devolvida em JSON no final.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

$usuario = requireStudent($retorno);

// Abre conexão com o banco.
$conexao = getConexao();

$body = getBody();
$id = (int)($body["id"] ?? 0);

if ($id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID da nota é obrigatório.";

    echo json_encode($retorno);
    exit;
}

// Prepara o DELETE da anotacao.
try {
    $stmt = $conexao->prepare("
    DELETE FROM sticky_notes
    WHERE id = :id AND user_id = :user_id
    LIMIT 1
    ");
    $executou = $stmt->execute([
        ":id" => $id,
        ":user_id" => (int) $usuario["id"]
    ]);

    // Define a resposta final conforme o resultado do cadastro.
    if ($executou && $stmt->rowCount() > 0) {
        $retorno["status"] = "ok";
        $retorno["mensagem"] = "Nota excluida com sucesso.";
    } else {
        $retorno["status"] = "nok";
        $retorno["mensagem"] = "Nota não encontrada ou não pertence a você.";
    }

} catch (Exception $e) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Erro no servidor.";
}


// Retorna a resposta da API em JSON.
echo json_encode($retorno);
