# Papyrus

Aplicação web para organização da rotina acadêmica, reunindo matérias, tarefas, anotações, cadernos, métodos de estudo e calendário em um único ambiente.

## Tecnologias

### Frontend

* React 19
* Vite 8
* Tailwind CSS 4
* React Router
* shadcn/ui e Radix UI

### Backend

* PHP 8.3+
* Composer
* API JSON sem framework
* PDO e sessões PHP

### Banco de dados

* MySQL 8.0
* Docker Compose

## Pré-requisitos

* Git
* PHP 8.3 ou superior
* Extensões PHP `PDO` e `pdo_mysql`
* Composer 2
* Node.js 22.12 ou superior
* npm 10 ou superior
* Docker com Docker Compose

Verifique o ambiente:

```bash
git --version
php --version
php -m | grep -Ei '^PDO$|pdo_mysql'
composer --version
node --version
npm --version
docker --version
docker compose version
```

## Instalação

### 1. Clonar o projeto

```bash
git clone https://github.com/Papyrus-SM/papyrus.git
cd papyrus
```

### 2. Iniciar o banco

```bash
docker compose up -d
```

Na primeira inicialização, o Docker cria automaticamente:

* o banco `papyrus`;
* as tabelas definidas em `backend/database/schema.sql`;
* o volume persistente `papyrus_mysql_data`.

Verifique o container:

```bash
docker compose ps
```

O serviço `mysql` deverá aparecer como `healthy`.

### 3. Configurar o backend

```bash
cp backend/.env.example backend/.env
cd backend
composer install
composer check-platform-reqs
cd ..
```

Configuração local padrão:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=papyrus
DB_USER=root
DB_PASS=papyrus_dev
DB_CHARSET=utf8mb4
GEMINI_API_KEY=
```

Preencha `GEMINI_API_KEY` somente para utilizar o chat com IA.

### 4. Configurar o frontend

```bash
cp frontend/.env.example frontend/.env
cd frontend
npm ci
cd ..
```

Configuração local padrão:

```env
VITE_API_BASE_URL=/api
VITE_BACKEND_URL=http://127.0.0.1:8000
```

## Execução

Mantenha três terminais abertos.

### Banco

```bash
docker compose up -d
```

### Backend

Na raiz do projeto:

```bash
php -S 127.0.0.1:8000 -t backend
```

### Frontend

```bash
cd frontend
npm run dev
```

Acesse:

```text
http://localhost:5173
```

## Administrador

Novos usuários são cadastrados como estudantes. Depois de criar a conta pela interface, promova o usuário pelo banco:

```bash
docker compose exec mysql mysql -uroot -ppapyrus_dev -e "
USE papyrus;
UPDATE users
SET papel = 'admin'
WHERE email = 'admin@gmail.com';
"
```

## Comandos úteis

```bash
# Iniciar os serviços
docker compose up -d

# Parar os serviços sem apagar os dados
docker compose down

# Acompanhar o MySQL
docker compose logs -f mysql

# Verificar o frontend
cd frontend
npm run lint
npm run build

# Verificar o backend
cd backend
composer check-platform-reqs
```

## Estrutura

```text
papyrus/
├── backend/
│   ├── database/
│   ├── src/api/
│   ├── src/config/
│   └── composer.json
├── frontend/
│   ├── src/components/
│   ├── src/pages/
│   ├── src/services/
│   └── package.json
├── compose.yaml
└── README.md
```

## Funcionalidades

* Cadastro, login e logout
* Onboarding do estudante
* Matérias e horários
* Tarefas
* Sticky notes
* Cadernos e páginas
* Flashcards
* Pomodoro
* Chat com IA
* Calendário com criação e consulta de eventos
* Painel administrativo

