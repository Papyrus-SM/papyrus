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

// Lê o corpo da requisição HTTP e transforma em array.
// Esse endpoint espera receber os dados do usuário em JSON.
$body = getBody();

$id = (int)($body["id"] ?? 0);
// Coleta e sanitização inicial dos dados recebidos.
// trim() remove espaços em branco do começo e do final da string.
$titulo = trim($body["titulo"] ?? "");
$anotacao = $body["anotacao"] ?? "";
// Escolha de cores para as notas
$cor = $body["cor"] ?? "#ffffff";

if ($id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "ID da nota é obrigatório.";

    echo json_encode($retorno);
    exit;
}

if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $cor)) {
    $cor = "#ffffff";
}

// Validação dos campos obrigatórios.
// Se qualquer campo vier vazio, a execução é encerrada imediatamente.
if (
    empty($titulo) && empty($anotacao) // empty() verifica se a string é vazia ou contém apenas espaços em branco
) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Informe um título ou uma anotação.";

    echo json_encode($retorno);
    exit;
}


// Abre conexão com o banco.
$conexao = getConexao();


// Prepara o INSERT do novo usuário.
$stmt = $conexao->prepare("
    UPDATE sticky_notes
    SET titulo = :titulo, texto = :anotacao, cor = :cor
    WHERE id = :id AND user_id = :user_id
    LIMIT 1
");

// Executa o INSERT com bind dos valores.
$executou = $stmt->execute([
    ":id" => $id,
    ":user_id" => (int) $usuario["id"],
    ":titulo" => $titulo,
    ":anotacao" => $anotacao,
    ":cor" => $cor ?? "#ffffff"
]);

// Define a resposta final conforme o resultado do cadastro.
if ($executou && $stmt->rowCount() > 0) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Nota atualizada com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Nota não encontrada ou não pertence a você.";
}

// Retorna a resposta da API em JSON.
echo json_encode($retorno);
