<?php

// Lista de origens permitidas
$origensPermitidas = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://papyrus.local:5173',
    'http://papyrus.local',
];

// 'Acess-Control-Allow-Origin', é um cabeçalho(header) HTTP do CORS(Cross-Origin-Resource Sharing(Compartilhamento de recursos entre origens cruzadas)
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $origensPermitidas, true)) { //  verifica se a origem da requisição HTTP esta na lista de origens permitidas
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']); //
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}