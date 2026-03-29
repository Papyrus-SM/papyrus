# Papyrus - Backend (API)

Este é o "cérebro" do Papyrus. Ele funciona como uma **API RESTful**, o que significa que ele apenas processa dados e responde em formato JSON para o nosso Frontend.

## O que estamos usando?
* **PHP Puro:** Sem frameworks pesados, mantendo o código leve e explicável.
* **Composer:** Para gerenciar o Autoload das nossas classes (Padrão PSR-4).
* **PDO/MySQLi:** Para comunicação segura com o banco de dados.

## Configuração Inicial
Certifique-se de ter o **PHP 8.3+** e o **Composer** instalados.

```bash
# Para atualizar o autoload do Composer caso crie classes novas
composer dump-autoload