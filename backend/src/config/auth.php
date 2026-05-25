<?php

function ensureSessionStarted(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

function denyJson(array &$retorno, string $mensagem): void
{
    $retorno["status"] = "nok";
    $retorno["mensagem"] = $mensagem;
    $retorno["data"] = [];

    echo json_encode($retorno);
    exit;
}

function requireAuthenticated(array &$retorno): array
{
    ensureSessionStarted();

    if (!isset($_SESSION["usuario"]) || !is_array($_SESSION["usuario"])) {
        denyJson($retorno, "Usuário não autenticado.");
    }

    return $_SESSION["usuario"];
}

function requireStudent(array &$retorno): array
{
    $usuario = requireAuthenticated($retorno);

    if (($usuario["papel"] ?? "") === "admin") {
        denyJson($retorno, "Acesso permitido apenas para estudantes.");
    }

    return $usuario;
}
