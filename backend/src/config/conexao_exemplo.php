<?php
// este é um arquivo de exemplo.
// Crie um arquivo 'conexao.php' e preencha suas credenciais locais.

$host = 'localhost';
$db   = 'nome_do_seu_banco';
$user = 'usuario';
$pass = 'senha';
$port = "3306";

try {
    $conexao = new PDO("mysql:host=$host;port=$port;dbname=$db;charset=utf8", $user, $pass);
    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erro na conexão: " . $e->getMessage());
}