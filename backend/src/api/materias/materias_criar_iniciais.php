<?php

// Carrega configurações da API e conexão com o banco.
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

// Apenas usuários autenticados podem criar matérias iniciais.
if (!isset($_SESSION["usuario"])) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Usuário não autenticado.";

    echo json_encode($retorno);
    exit;
}

// Lê o corpo da requisição.
$body = getBody();
$materias = $body["materias"] ?? null;

// Validação do array de matérias.
if (!is_array($materias) || count($materias) === 0) {
    $retorno["status"] = "nok";
    $retorno["mensagem"] = "Envie uma lista válida de matérias.";

    echo json_encode($retorno);
    exit;
}

// Abre conexão com o banco.
$conexao = getConexao();

try {
    // Usa transação para garantir consistência:
    // ou todas as matérias iniciais são criadas, ou nenhuma.
    $conexao->beginTransaction();

    $stmt = $conexao->prepare("
        INSERT INTO materias (user_id, nome, descricao, color_hex, horas_semanais)
        VALUES (:user_id, :nome, :descricao, :color_hex, :horas_semanais)
    ");

    $materiasCriadas = [];

    foreach ($materias as $materia) {
        $nome = trim($materia["nome"] ?? "");
        $descricao = trim($materia["descricao"] ?? "");
        $color_hex = trim($materia["color_hex"] ?? "#F8FF97");
        $horas_semanais = $materia["horas_semanais"] ?? 0;

        if (empty($nome)) {
            throw new Exception("Todas as matérias precisam ter um nome.");
        }

        if (strlen($nome) > 100) {
            throw new Exception("O nome da matéria deve ter no máximo 100 caracteres.");
        }

        if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $color_hex)) {
            throw new Exception("Uma das cores informadas é inválida.");
        }

        if (!filter_var($horas_semanais, FILTER_VALIDATE_INT) && $horas_semanais !== 0 && $horas_semanais !== "0") {
            throw new Exception("Horas semanais inválidas em uma das matérias.");
        }

        $horas_semanais = (int) $horas_semanais;

        if ($horas_semanais < 0 || $horas_semanais > 255) {
            throw new Exception("Horas semanais devem estar entre 0 e 255.");
        }

        $stmt->execute([
            ":user_id" => $_SESSION["usuario"]["id"],
            ":nome" => $nome,
            ":descricao" => $descricao ?: null,
            ":color_hex" => $color_hex,
            ":horas_semanais" => $horas_semanais
        ]);

        $materiasCriadas[] = [
            "id" => (int) $conexao->lastInsertId(),
            "nome" => $nome,
            "descricao" => $descricao ?: null,
            "color_hex" => $color_hex,
            "horas_semanais" => $horas_semanais
        ];
    }

    $conexao->commit();

    $retorno["status"] = "ok";
    $retorno["mensagem"] = "Matérias iniciais criadas com sucesso.";
    $retorno["data"] = [
        "materias" => $materiasCriadas
    ];
} catch (Exception $e) {
    if ($conexao->inTransaction()) {
        $conexao->rollBack();
    }

    $retorno["status"] = "nok";
    $retorno["mensagem"] = $e->getMessage();
}

echo json_encode($retorno);