# Papyrus — Organizador de Estudos 🎓

> Aplicação web em desenvolvimento para auxiliar estudantes na gestão de suas rotinas acadêmicas.

O **Papyrus** é um sistema web voltado à organização da rotina de estudos, permitindo o gerenciamento de matérias, horários de aula, tarefas e anotações rápidas em um único ambiente digital. A proposta do projeto é centralizar recursos acadêmicos que normalmente ficam dispersos em diferentes ferramentas, oferecendo uma experiência mais integrada, intuitiva e produtiva para o estudante.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![PHP](https://img.shields.io/badge/PHP-8.3+-777BB4?logo=php&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)

---

## 📌 Índice

- [Visão Geral](#-visão-geral)
- [Status do Projeto](#-status-do-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Fluxo da Aplicação](#-fluxo-da-aplicação)
- [Banco de Dados](#️-banco-de-dados)
- [Configuração e Instalação](#️-configuração-e-instalação)
- [Gestão de Usuários e Configuração de Administrador](#-gestão-de-usuários-e-configuração-de-administrador)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Principais Rotas da API](#️-principais-rotas-da-api)
- [Como Contribuir](#-como-contribuir)
- [Autores](#️-autores)

---

## 📖 Visão Geral

O Papyrus foi idealizado para atender estudantes que precisam organizar sua rotina acadêmica de forma mais eficiente. Em vez de depender de múltiplas ferramentas separadas para tarefas, horários, lembretes e organização pessoal, a proposta do sistema é reunir esses recursos em uma única aplicação web.

O projeto está sendo desenvolvido com arquitetura desacoplada entre frontend e backend, priorizando organização de código, escalabilidade e clareza para manutenção em equipe.

---

## 🚧 Status do Projeto

O projeto encontra-se em desenvolvimento e evolução contínua. Atualmente, o Papyrus já contempla ou possui estrutura para as seguintes frentes:

- Autenticação de usuários
- Gerenciamento de matérias
- Organização de tarefas por disciplina
- Anotações rápidas com post-its
- Fluxo inicial de onboarding
- Área administrativa com permissões específicas

> Algumas funcionalidades ainda podem estar em fase de implementação, refinamento visual ou integração entre módulos.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **Core:** React 19 com Vite
- **Estilização:** Tailwind CSS
### Backend
- **Linguagem:** PHP 8.3+ (API JSON sem framework)
- **Gerenciamento de Dependências:** Composer
- **Acesso a Dados:** PDO com consultas parametrizadas
- **Variáveis de Ambiente:** phpdotenv

### Banco de Dados
- **Motor:** MySQL

---

## 📂 Estrutura de Pastas

O projeto segue uma arquitetura desacoplada, com separação clara entre cliente (frontend) e servidor (backend).

### Backend

```text
backend/
├── src/
│   ├── api/                # Endpoints da aplicação e lógica de negócio
│   │   ├── admin/          # Gestão de usuários pelo administrador
│   │   ├── materias/       # CRUD de matérias acadêmicas
│   │   ├── onboarding/     # Lógica de primeiro acesso do usuário
│   │   ├── stickyNotes/    # Gestão de post-its virtuais
│   │   ├── tarefa/         # Controle de prazos e atividades
│   │   └── usuario/        # Autenticação e perfil do usuário
│   ├── config/             # Conexão com banco, CORS e tratamento de entrada
│   └── models/             # Classes e estruturas de representação de dados
├── database/
│   └── schema.sql          # Estrutura completa do banco de dados
├── composer.json           # Dependências e configuração de autoload
└── .env.example            # Modelo de variáveis de ambiente
```

### Frontend

```text
frontend/
├── src/
│   ├── components/         # Componentes reutilizáveis da interface
│   ├── pages/              # Páginas principais da aplicação
│   ├── services/           # Comunicação com a API
│   ├── lib/                # Utilitários e funções auxiliares
│   └── main.jsx            # Ponto de entrada da aplicação React
├── package.json            # Dependências e scripts NPM
└── vite.config.js          # Configuração do Vite
```

---

## 🔄 Fluxo da Aplicação

O ciclo de funcionamento do Papyrus segue, de forma geral, as etapas abaixo:

1. **Interação do usuário:** o usuário realiza uma ação na interface, como criar uma tarefa ou cadastrar uma matéria.
2. **Envio da requisição:** o frontend envia uma requisição assíncrona para a API em PHP.
3. **Processamento no backend:** o servidor valida a sessão, trata os dados recebidos, executa a regra de negócio e acessa o banco de dados.
4. **Retorno da resposta:** o backend responde em formato JSON com o resultado da operação.
5. **Atualização da interface:** o frontend processa a resposta e atualiza a tela dinamicamente, sem recarregar a página.

Esse fluxo permite uma separação clara de responsabilidades entre interface, regras de negócio e persistência de dados.

---

## 🗄️ Banco de Dados

O banco de dados `papyrus` segue o modelo relacional e utiliza chaves estrangeiras para garantir integridade entre as entidades.

### Principais tabelas

| Tabela | Descrição | Relacionamento |
|---|---|---|
| `users` | Dados cadastrais e papel do usuário (`admin` / `estudante`) | Entidade principal |
| `perfil_onboarding` | Armazena o status do fluxo inicial de configuração | 1:1 com `users` |
| `materias` | Disciplinas cadastradas pelo estudante | N:1 com `users` |
| `horarios_aula` | Horários recorrentes vinculados às matérias | N:1 com `materias` |
| `tarefas` | Atividades com prazo e dificuldade | N:1 com `materias` |
| `sticky_notes` | Anotações rápidas do usuário | N:1 com `users` |

### Regras gerais do modelo

- Cada usuário pode possuir várias matérias.
- Cada matéria pode possuir vários horários e várias tarefas.
- Cada usuário pode possuir múltiplos post-its.
- O onboarding é associado individualmente a cada usuário.

---

## ⚙️ Configuração e Instalação

### Pré-requisitos

Antes de executar o projeto localmente, certifique-se de ter instalado:

- PHP 8.3 ou superior
- Composer
- Node.js 18 ou superior
- MySQL 

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd papyrus
```

### 2. Configure o backend

```bash
cd backend
composer install
cp .env.example .env
composer dump-autoload
```

Depois disso, edite o arquivo `.env` com as credenciais corretas do banco de dados e demais configurações do ambiente.

### 3. Configure o banco de dados

Importe o schema no seu servidor MySQL:

```bash
mysql -u root -p < database/schema.sql
```

### 4. Configure e execute o frontend

```bash
cd ../frontend
npm install
npm run dev
```

Por padrão, a aplicação ficará disponível em `http://localhost:5173`.

---

## 👤 Gestão de Usuários e Configuração de Administrador

### Cadastro de usuários

Novos usuários podem ser registrados pela interface da aplicação ou por meio do endpoint de criação de conta. Por padrão, todo usuário cadastrado recebe o papel de `estudante`.

### Promoção manual para administrador

Por questões de segurança, a promoção de um usuário para administrador não é realizada pela interface da aplicação. Para isso, é necessário executar diretamente no banco de dados:

```sql
UPDATE users
SET papel = 'admin'
WHERE email = 'seu-email@exemplo.com';
```

### Permissões do administrador

Usuários com papel `admin` possuem acesso a funcionalidades administrativas específicas, como:

- Visualizar todos os usuários cadastrados
- Editar dados de contas
- Excluir usuários
- Acessar a área administrativa do sistema

---

## ✨ Funcionalidades Principais

- **Autenticação de usuários:** cadastro, login, logout e validação de sessão.
- **Dashboard acadêmico:** organização inicial das informações do estudante.
- **Gestão de matérias:** criação, edição, listagem e remoção de disciplinas.
- **Controle de tarefas:** tarefas vinculadas às matérias com prazos e níveis de dificuldade.
- **Post-its interativos:** anotações rápidas para apoio à rotina de estudos.
- **Onboarding inicial:** fluxo de primeiro acesso para configuração básica do usuário.
- **Área administrativa:** gerenciamento de usuários com permissões específicas.

---

## 🛣️ Principais Rotas da API

Abaixo estão algumas das principais rotas atualmente utilizadas no sistema.

| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| `POST` | `/api/usuario/usuario_novo.php` | Cadastra um novo usuário | Público |
| `POST` | `/api/usuario/usuario_login.php` | Realiza autenticação do usuário | Público |
| `POST` | `/api/usuario/usuario_logout.php` | Encerra a sessão do usuário | Sessão |
| `GET` | `/api/usuario/valida_sessao.php` | Verifica se a sessão está ativa | Sessão |
| `GET` | `/api/materias/materias_listar.php` | Lista as matérias do usuário logado | Sessão |
| `POST` | `/api/tarefa/tarefa_criar.php` | Cria uma nova tarefa vinculada a uma matéria | Sessão |
| `GET` | `/api/stickyNotes/stickyNotes_get.php` | Recupera os post-its do usuário | Sessão |
| `PUT` | `/api/admin/admin_usuario_editar.php` | Edita dados de qualquer usuário | Admin |

> Esta seção pode ser expandida futuramente com a documentação completa de todos os endpoints do sistema.

---

## ✍️ Autores

Projeto desenvolvido em equipe para a disciplina de **Experiência Criativa: Projetando Soluções Computacionais** — PUCPR.

- João Victor dos Reis da Silva
- Eduardo Lopes
- Gabriel Rossi
- Emanuel Henrique
- Julio Miguel
```