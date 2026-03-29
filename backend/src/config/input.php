<?php

/**
 * Lê e decodifica o body da requisição.
 *
 * Por que não $_POST?
 * O React envia dados como JSON (Content-Type: application/json).
 * O $_POST do PHP só lê application/x-www-form-urlencoded (formulários HTML).
 * Para JSON, precisamos ler o stream bruto da requisição via php://input.
 *
 * @return array Os dados do body decodificados, ou array vazio se inválido.
 */
function getBody(): array
{
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw, true);

    // json_decode retorna null se o body não for um JSON válido
    return is_array($decoded) ? $decoded : [];
}