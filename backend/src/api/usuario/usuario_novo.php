<?php

// Arquivos de configuração compartilhados da API:
// headers.php -> define cabeçalhos da resposta (JSON, CORS, etc.)
// input.php -> fornece funções utilitárias para ler o body da requisição
// conexao.php -> cria e retorna a conexão com o banco de dados
include_once(__DIR__ . '/../../config/headers.php');
include_once(__DIR__ . '/../../config/input.php');
include_once(__DIR__ . '/../../config/conexao.php');

// Estrutura padrão de resposta da API.
// Ela será preenchida ao longo da execução e devolvida em JSON no final.
$retorno = [
    "status" => "",
    "mensagem" => "",
    "data" => []
];

// Lê o corpo da requisição HTTP e transforma em array.
// Esse endpoint espera receber os dados do usuário em JSON.
$body = getBody();

// Coleta e sanitização inicial dos dados recebidos.
// trim() remove espaços em branco do começo e do final da string.
// Exemplo: "  João  " vira "João".
$nome = trim($body["nome"] ?? "");
$email = trim($body["email"] ?? "");
$senha = trim($body["senha"] ?? "");
$data_nascimento = trim($body["data_nascimento"] ?? "");
$genero = trim($body["genero"] ?? "");

// Validação dos campos obrigatórios.
// Se qualquer campo vier vazio, a execução é encerrada imediatamente.
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

// Validação do formato do e-mail.
// filter_var com FILTER_VALIDATE_EMAIL verifica se o texto possui formato válido de e-mail.
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "E-mail inválido.";

    echo json_encode($retorno);
    exit;
}

// Regra mínima de segurança para senha.
// strlen() retorna o número de caracteres da string.
if (strlen($senha) < 6) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "A senha deve ter pelo menos 6 caracteres.";

    echo json_encode($retorno);
    exit;
}

// Validação da data de nascimento no formato YYYY-MM-DD.
// DateTime::createFromFormat tenta montar uma data com o formato esperado.
// Depois é feita uma segunda checagem para garantir que o valor original bate com o formatado.
$dataValida = DateTime::createFromFormat('Y-m-d', $data_nascimento);

if (!$dataValida || $dataValida->format('Y-m-d') !== $data_nascimento) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Data de nascimento inválida.";

    echo json_encode($retorno);
    exit;
}

// Validação de domínio para o campo gênero.
// in_array() verifica se o valor recebido está entre os valores permitidos.
$generosPermitidos = ["masculino", "feminino", "prefiro_nao_dizer"];

if (!in_array($genero, $generosPermitidos)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Gênero inválido.";

    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

// Verifica se já existe usuário com o mesmo e-mail.
// Isso evita duplicidade de contas.
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

// Gera o hash da senha antes de salvar no banco.
// password_hash protege a senha real, evitando armazenamento em texto puro.
$senha_hash = password_hash($senha, PASSWORD_DEFAULT);

// Prepara o INSERT do novo usuário.
$stmt = $conexao->prepare("
    INSERT INTO users (nome, email, senha_hash, data_nascimento, genero)
    VALUES (:nome, :email, :senha_hash, :data_nascimento, :genero)
");

// Executa o INSERT com bind dos valores.
$executou = $stmt->execute([
    ":nome" => $nome,
    ":email" => $email,
    ":senha_hash" => $senha_hash,
    ":data_nascimento" => $data_nascimento,
    ":genero" => $genero
]);

// Define a resposta final conforme o resultado do cadastro.
if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Usuário cadastrado com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao cadastrar usuário.";
}

// Retorna a resposta da API em JSON.
echo json_encode($retorno);