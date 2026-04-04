<?php

// Inicia a sessão para identificar o usuário autenticado.
session_start(); 

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
// trim() remove espaços em branco do começo e do final da string. Exemplo: "  João  " vira "João".
$materia = trim($body["materia"] ?? "");
$titulo = trim($body["titulo"] ?? "");
$descricao = $body["descricao"] ?? null;
$dificuldade = trim($body["dificuldade"] ?? "");
$data_entrega = $body["data_entrega"] ?? null; // pode ser null ou string

// Campos gerenciados pelo sistema:
$concluida = false; // A tarefa nunca sera concluida quando criada.
$data_criacao = date('Y-m-d H:i:s'); // atribui a variavel com data atual.




// Validação dos campos obrigatórios.
// Se qualquer campo vier vazio, a execução é encerrada imediatamente.
if (
    empty($materia) ||    
    empty($titulo) ||
    empty($dificuldade)
) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Materia, titulo e dificuldade são obrigatórios.";

    echo json_encode($retorno);
    exit;
}




// Validação de domínio para o campo dificuldade.
// in_array() verifica se o valor recebido está entre os valores permitidos.
$dificuldadePermitida = ["facil", "medio", "dificil"];

if (!in_array($dificuldade, $dificuldadePermitida)) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Dificuldade invalida.";

    echo json_encode($retorno);
    exit;
}




// Validação da data de entrega (se for preenchida)
if ($data_entrega !== null) {
    // Tenta converter para formato válido
    $data = DateTime::createFromFormat('Y-m-d', $data_entrega);
    if (!$data || $data->format('Y-m-d') !== $data_entrega) {
        $retorno["status"] = "nok";
        $retorno["mensagem"] = "Data de entrega inválida. Use o formato YYYY-MM-DD.";
        echo json_encode($retorno);
        exit;
    }
    // Converte para formato MySQL
    $data_entrega = $data->format('Y-m-d');
} else {
    // Se for null, mantém como null
    $data_entrega = null;
}




// Abre conexão com o banco.
$conexao = getConexao();




// Guarda o ID do usuário 
$user_id = $_SESSION["usuario"] ["id"] ?? 0;

// Se não estiver logado, retorna erro
if ($user_id <= 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Você precisa estar logado para criar uma tarefa.";
    echo json_encode($retorno);
    exit;
}

// Valida a matéria
$id_materia = (int)($body["id_materia"] ?? 0);

// Valida se a matéria existe e pertence ao usuário
$stmtMateria = $conexao->prepare("SELECT id FROM materias WHERE nome = :materia AND user_id = :user_id LIMIT 1");

$stmtMateria->execute([
    ":materia" => $materia,
    ":user_id" => $user_id
]);


$materiaValida = $stmtMateria->fetch();
if (!$materiaValida) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Matéria inválida ou não pertence a você.";
    echo json_encode($retorno);
    exit;
}




// Verifica se já existe uma tarefa com o mesmo título e matéria
$stmt = $conexao->prepare("SELECT id FROM tarefa WHERE titulo = :titulo AND materia = :materia LIMIT 1");
$stmt->execute([
    ":titulo" => $titulo,
    ":materia" => $materia
]);

$tarefaExistente = $stmt->fetch();

if ($tarefaExistente) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Já existe uma tarefa com esse título para essa matéria.";
    echo json_encode($retorno);
    exit;
}




// Prepara o INSERT do novo usuário.
$stmt = $conexao->prepare("
    INSERT INTO tarefa (materia, titulo, descricao, dificuldade, data_entrega, concluida, data_criacao)
    VALUES (:materia, :titulo, :descricao, :dificuldade, :data_entrega, :concluida, :data_criacao)
");

// Executa o INSERT com bind dos valores.
$executou = $stmt->execute([
    ":materia" => $materia,
    ":titulo" => $titulo,
    ":descricao" => $descricao,
    ":dificuldade" => $dificuldade,
    ":data_entrega" => $data_entrega,
    ":concluida" => $concluida,
    ":data_criacao" => $data_criacao
]);

// Define a resposta final conforme o resultado do cadastro.
if ($executou) {
    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Tarefa criada com sucesso.";
} else {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Falha ao criar a tarefa.";
}

// Retorna a resposta da API em JSON.
echo json_encode($retorno);