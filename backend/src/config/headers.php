<?php

/**
 * Configuração central de headers HTTP.
 * Todo arquivo da API inclui este arquivo ANTES de qualquer output.
 *
 * Por que CORS? O React roda em localhost:5173 (Vite) e o PHP em
 * localhost:80. Origens diferentes = o navegador bloqueia por padrão.
 * Esses headers dizem ao navegador: "esta API aceita chamadas desta origem".
 */

// Origem permitida: apenas o frontend React em desenvolvimento
// Em produção, trocar pelo domínio real (ex: https://papyrus.com.br)
header('Access-Control-Allow-Origin: http://localhost:5173');

// Métodos HTTP que a API aceita
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Headers que o React pode enviar (Content-Type é obrigatório para JSON)
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Permite envio de cookies de sessão entre origens (necessário para $_SESSION)
header('Access-Control-Allow-Credentials: true');

// Resposta sempre em JSON com charset UTF-8
header('Content-Type: application/json; charset=utf-8');

/**
 * Preflight: antes de todo POST/PUT, o navegador envia um OPTIONS "de teste".
 * Se não respondermos 204, ele bloqueia a requisição real.
 */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}