<?php

include_once(__DIR__ . '/../../config/headers.php');
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

$conexao = getConexao();

/**
 * RESUMO GERAL
 */
$stmtResumo = $conexao->prepare("
    SELECT
        COUNT(*) AS total_usuarios,
        SUM(CASE WHEN papel = 'estudante' THEN 1 ELSE 0 END) AS total_estudantes,
        SUM(CASE WHEN papel = 'admin' THEN 1 ELSE 0 END) AS total_admins
    FROM users
");
$stmtResumo->execute();
$resumo = $stmtResumo->fetch();

/**
 * DISTRIBUIÇÃO POR GÊNERO
 */
$stmtGeneros = $conexao->prepare("
    SELECT
        CASE
            WHEN genero = 'masculino' THEN 'masculino'
            WHEN genero = 'feminino' THEN 'feminino'
            WHEN genero = 'prefiro_nao_dizer' THEN 'prefiro_nao_dizer'
            ELSE 'nao_informado'
        END AS `key`,
        CASE
            WHEN genero = 'masculino' THEN 'Homem'
            WHEN genero = 'feminino' THEN 'Mulher'
            WHEN genero = 'prefiro_nao_dizer' THEN 'Prefiro não informar'
            ELSE 'Não informado'
        END AS label,
        COUNT(*) AS total
    FROM users
    GROUP BY `key`, label
    ORDER BY total DESC
");
$stmtGeneros->execute();
$generos = $stmtGeneros->fetchAll();

/**
 * DISTRIBUIÇÃO POR FAIXA ETÁRIA
 */
$stmtFaixas = $conexao->prepare("
    SELECT
        faixa AS label,
        COUNT(*) AS total
    FROM (
        SELECT
            CASE
                WHEN data_nascimento IS NULL THEN 'Não informado'
                WHEN TIMESTAMPDIFF(YEAR, data_nascimento, CURDATE()) BETWEEN 15 AND 20 THEN '15-20 anos'
                WHEN TIMESTAMPDIFF(YEAR, data_nascimento, CURDATE()) BETWEEN 21 AND 25 THEN '21-25 anos'
                WHEN TIMESTAMPDIFF(YEAR, data_nascimento, CURDATE()) BETWEEN 26 AND 30 THEN '26-30 anos'
                WHEN TIMESTAMPDIFF(YEAR, data_nascimento, CURDATE()) BETWEEN 31 AND 40 THEN '31-40 anos'
                ELSE '41+ anos'
            END AS faixa,
            CASE
                WHEN data_nascimento IS NULL THEN 99
                WHEN TIMESTAMPDIFF(YEAR, data_nascimento, CURDATE()) BETWEEN 15 AND 20 THEN 1
                WHEN TIMESTAMPDIFF(YEAR, data_nascimento, CURDATE()) BETWEEN 21 AND 25 THEN 2
                WHEN TIMESTAMPDIFF(YEAR, data_nascimento, CURDATE()) BETWEEN 26 AND 30 THEN 3
                WHEN TIMESTAMPDIFF(YEAR, data_nascimento, CURDATE()) BETWEEN 31 AND 40 THEN 4
                ELSE 5
            END AS ordem
        FROM users
    ) AS base
    GROUP BY faixa, ordem
    ORDER BY ordem ASC
");
$stmtFaixas->execute();
$faixasEtarias = $stmtFaixas->fetchAll();

/**
 * TOTAL DE USUÁRIOS POR PAPEL
 */
$stmtUsuariosPorPapel = $conexao->prepare("
    SELECT
        papel AS `key`,
        CASE
            WHEN papel = 'admin' THEN 'Administradores'
            WHEN papel = 'estudante' THEN 'Estudantes'
            ELSE 'Outro'
        END AS label,
        COUNT(*) AS total
    FROM users
    GROUP BY papel
    ORDER BY total DESC
");
$stmtUsuariosPorPapel->execute();
$usuariosPorPapel = $stmtUsuariosPorPapel->fetchAll();

$stmtCadastrosPorMes = $conexao->prepare("
    SELECT
        DATE_FORMAT(created_at, '%m/%Y') AS label,
        COUNT(*) AS total
    FROM users
    WHERE created_at IS NOT NULL
    GROUP BY YEAR(created_at), MONTH(created_at), label
    ORDER BY YEAR(created_at), MONTH(created_at)
");
$stmtCadastrosPorMes->execute();
$cadastrosPorMes = $stmtCadastrosPorMes->fetchAll();

$retorno["status"] = "ok";
$retorno["mensagem"] = "Métricas carregadas com sucesso.";
$retorno["data"] = [
    "resumo" => [
        "total_usuarios" => (int) ($resumo["total_usuarios"] ?? 0),
        "total_estudantes" => (int) ($resumo["total_estudantes"] ?? 0),
        "total_admins" => (int) ($resumo["total_admins"] ?? 0)
    ],
    "generos" => $generos,
    "faixas_etarias" => $faixasEtarias,
    "usuarios_por_papel" => $usuariosPorPapel,
    "cadastros_por_mes" => $cadastrosPorMes
];

echo json_encode($retorno);