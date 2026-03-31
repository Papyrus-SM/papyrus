# Documentação do Projeto: Papyrus

Bem-vindo(a) ao repositório do **Papyrus**! Este documento serve como o guia definitivo para novos desenvolvedores entenderem, configurarem e executarem o projeto localmente.

---

## 1. Visão Geral do Projeto

**Nome do Projeto:** Papyrus
**Descrição:** O Papyrus é um sistema de gerenciamento estudantil projetado para ajudar alunos a organizarem suas rotinas acadêmicas.
**Público-alvo:** Estudantes universitários, alunos de escolas e autodidatas.
**Principais Funcionalidades:**
* Cadastro e autenticação de usuários.
* Configuração de perfil de "onboarding" (contexto de estudo).
* Criação e gerenciamento de assuntos/matérias (com cores e carga horária semanal).
* Gerenciamento de horários de aula recorrentes (grade semanal).

---

## 2. Arquitetura do Sistema

O sistema utiliza uma arquitetura **Cliente-Servidor (Client-Server)** com o frontend e o backend totalmente desacoplados:

* **Frontend (Cliente):** Uma aplicação Single Page Application (SPA) construída com React e Vite. Ele é responsável por toda a interface de usuário e roteamento visual.
* **Backend (Servidor):** Uma API desenvolvida em PHP (modelo procedural/scripts diretos) que se conecta a um banco de dados MySQL via PDO.
* **Comunicação:** O frontend faz requisições HTTP (REST-like) para o backend. Para evitar problemas de CORS e simplificar as URLs durante o desenvolvimento, o frontend utiliza o sistema de **Proxy do Vite**. Toda requisição feita para `/api` no frontend é interceptada e redirecionada internamente para o servidor backend.

**Fluxo de Exemplo (Login):**
1. O usuário preenche o formulário e o React chama `loginUser()` enviando um JSON para `/api/usuario_login.php`.
2. O servidor Vite intercepta a chamada `/api` e a reescreve para `http://papyrus.local/src/api/usuario_login.php`.
3. O script PHP recebe o JSON, valida no banco de dados MySQL, inicia uma sessão nativa do PHP e retorna uma resposta JSON de sucesso.
4. O frontend lê a resposta e libera o acesso ao dashboard.

---

## 3. Estrutura de Pastas

A organização do repositório reflete a separação entre o cliente e o servidor:

```text
/
├── backend/                  # Código fonte da API em PHP
│   ├── database/             # Scripts do banco de dados (schema.sql)
│   ├── src/                  # Lógica central da API
│   │   ├── api/              # Endpoints da aplicação (ex: usuario_login.php)
│   │   └── config/           # Arquivos de configuração (conexão com DB, CORS, headers)
│   ├── vendor/               # Dependências do PHP (geradas pelo Composer)
│   ├── .env.example          # Template de variáveis de ambiente do backend
│   └── composer.json         # Manifesto de dependências do PHP
│
└── frontend/                 # Código fonte da interface em React
    ├── public/               # Arquivos estáticos (favicon, ícones)
    ├── src/                  # Componentes e lógica do React
    │   ├── components/       # Componentes visuais isolados (UI, Auth, Dashboard)
    │   ├── pages/            # Telas completas da aplicação
    │   ├── services/         # Arquivos de comunicação com a API (ex: auth.js)
    │   └── main.jsx          # Ponto de entrada do React
    ├── .env.example          # Template de variáveis de ambiente do frontend
    ├── package.json          # Dependências do Node.js
    └── vite.config.js        # Configurações do empacotador e do Proxy
```

---

## 4. Configuração do Ambiente

### Configuração do Banco de Dados
O sistema utiliza MySQL/MariaDB.
1. Crie um banco de dados vazio.
2. Execute o script contido em `backend/database/schema.sql` para criar as tabelas necessárias (`users`, `perfil_onboarding`, `assuntos`, `horarios_aula`).

### Configuração do Backend
O backend utiliza o pacote `vlucas/phpdotenv` para ler configurações.
1. Na pasta `backend/`, duplique o arquivo `.env.example` e renomeie a cópia para `.env`.
2. Preencha as credenciais do seu banco de dados local:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=papyrus
   DB_USER=root
   DB_PASS=sua_senha
   DB_CHARSET=utf8mb4
   ```

### Configuração do Frontend
1. Na pasta `frontend/`, duplique o arquivo `.env.example` e renomeie a cópia para `.env`.
2. Verifique as variáveis:
   ```env
   VITE_API_BASE_URL=/api
   VITE_BACKEND_URL=[http://papyrus.local](http://papyrus.local)
   ```
   *Dica:* A variável `VITE_BACKEND_URL` deve apontar para o servidor Apache/Nginx (ou servidor embutido do PHP) que está rodando a pasta do backend.

---

## 5. Como Rodar o Projeto

### Passo 1: Inicializar o Backend (PHP)
1. Abra o terminal na pasta `backend`.
2. Instale as dependências executando:
   ```bash
   composer install
   ```
3. Suba o servidor PHP. Você pode configurar um Host Virtual no Apache apontando para a pasta `backend` (com o domínio `papyrus.local`, conforme o `.env`) **OU** rodar o servidor embutido do PHP:
   ```bash
   php -S localhost:8000
   ```
   *(Se usar o servidor embutido, lembre-se de alterar o `VITE_BACKEND_URL` no `.env` do frontend para `http://localhost:8000`).*

### Passo 2: Inicializar o Frontend (React/Vite)
1. Abra um novo terminal na pasta `frontend`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse o frontend no seu navegador (geralmente em `http://localhost:5173`).

---

## 6. 🔗 Comunicação Frontend ↔ Backend

A comunicação é feita através da API `fetch` nativa do JavaScript, centralizada na pasta `frontend/src/services/`.

* **Sessões e Cookies:** O backend utiliza o gerenciamento nativo de sessão do PHP (`session_start()`). Para que as sessões funcionem em uma arquitetura separada, as requisições do frontend enviam a propriedade `credentials: 'include'`. Isso garante que o cookie de sessão (`PHPSESSID`) seja trafegado entre o navegador e o servidor.
* **Proxy do Vite:** Ao invés do frontend tentar acessar o PHP diretamente e ser bloqueado pelo CORS, o Vite age como um intermediário. Configurado em `vite.config.js`, ele pega requisições feitas para `/api/...` e redireciona (Proxy) para o backend, alterando internamente a URL para `/src/api/...`.

---

## 7. 🧠 Principais Conceitos do Projeto

* **Autenticação Baseada em Sessão:** Ao contrário de muitas SPAs modernas que usam JWT (JSON Web Tokens), este projeto optou por manter o controle de acesso com **Sessões PHP tradicionais**. A rota `valida_sessao.php` é usada pelo frontend para descobrir se o usuário já está logado ao atualizar a página.
* **Estrutura Procedural da API:** O backend não utiliza um framework complexo (como Laravel). Os endpoints são arquivos físicos individuais (ex: `usuario_novo.php`, `usuario_excluir.php`) que recebem o input via `getBody()`, executam as queries com `PDO` e imprimem os resultados em formato JSON.
* **Segurança:** As senhas dos usuários nunca são salvas em texto limpo. O banco de dados armazena um hash gerado nativamente pelo PHP (verificado com `password_verify` no login).

---

## 8. 📌 Pontos de Atenção (IMPORTANTE)

Para não ter dor de cabeça ao rodar este projeto pela primeira vez, preste atenção nestes detalhes:

1. **Requisitos de Sistema:** Você precisa ter o PHP versão `8.0` ou superior instalado e a extensão PDO (`ext-pdo_mysql`) habilitada no seu `php.ini`.
2. **Resolução de DNS Local:** Se o seu `.env` do frontend usa `VITE_BACKEND_URL=http://papyrus.local`, você **precisa** garantir que este domínio exista no seu arquivo de `hosts` do sistema operacional apontando para `127.0.0.1`, e que seu servidor web (Apache) o reconheça. Se achar muito complexo para o ambiente de dev, mude no `.env` para o endereço real do seu PHP (ex: `http://localhost:8000`).
---

## 9. 🛠️ Tecnologias Utilizadas

**Frontend:**
* **React 19** com **Vite**
* **Tailwind CSS v4** (Para estilização e layout responsivo)
* **React Router v7** (Para navegação entre telas)
* **Shadcn UI / Radix UI** (Componentes acessíveis e customizáveis)
* **Phosphor Icons** (Pacote de iconografia)

**Backend:**
* **PHP >= 8.0**
* **MySQL** (Banco de dados relacional)
* **PDO** (Para comunicação segura com o banco e prevenção de SQL Injection)
* **Composer** (Gerenciador de pacotes do ecossistema PHP)
* **vlucas/phpdotenv** (Para gerenciar variáveis `.env` no PHP)

--- 