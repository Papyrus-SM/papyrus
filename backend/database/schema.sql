CREATE DATABASE IF NOT EXISTS papyrus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE papyrus;

-- ------------------------------------------------------------
-- Tabela 1: users
-- Armazena os dados principais do usuário do sistema.
-- Também sustenta as funcionalidades de cadastro, login e perfil.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    genero ENUM(
        'masculino',
        'feminino',
        'prefiro_nao_dizer'
    ) NOT NULL,
    papel ENUM('admin', 'estudante') NOT NULL DEFAULT 'estudante'
);

-- ------------------------------------------------------------
-- Tabela 2: perfil_onboarding
-- Controla se o usuário já concluiu o onboarding inicial.
-- Relação 1:1 com users.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS perfil_onboarding (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL UNIQUE,
    concluido BOOLEAN DEFAULT FALSE,
    concluido_em TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela 3: materias
-- Representa as matérias estudadas pelo usuário.
-- Esta passa a ser a entidade central do domínio de estudos.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS materias (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NULL,
    color_hex CHAR(7) NOT NULL DEFAULT '#F8FF97',
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela 4: horarios_aula
-- Cada linha representa um horário recorrente semanal de uma matéria.
-- Pode ser usada futuramente para calendário/cronograma semanal.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS horarios_aula (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    materia_id INT UNSIGNED NOT NULL,
    dia_da_semana ENUM(
        'segunda',
        'terca',
        'quarta',
        'quinta',
        'sexta',
        'sabado',
        'domingo'
    ) NOT NULL,
    hora_inicia TIME NOT NULL,
    hora_termina TIME NOT NULL,
    lugar VARCHAR(100) NULL,
    FOREIGN KEY (materia_id) REFERENCES materias (id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela 5: tarefas
-- Tarefas vinculadas a uma matéria específica.
-- Cada matéria pode possuir várias tarefas.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tarefas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    materia_id INT UNSIGNED NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    dificuldade ENUM('facil', 'medio', 'dificil') NULL,
    data_entrega DATETIME NULL,
    concluida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (materia_id) REFERENCES materias (id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Para a funcionalidade do usuário colocar "post-its" na tela.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sticky_notes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    titulo TEXT,
    texto TEXT NOT NULL,
    cor VARCHAR(20) DEFAULT '#ffff88', -- A ideia é que a cor será definida pelo usuário
    pos_x INT DEFAULT 0,
    pos_y INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Tabela: cadernos
-- Cadernos vinculados a uma matéria específica.
-- Cada matéria pode possuir vários cadernos.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cadernos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    materia_id INT UNSIGNED NULL,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (materia_id) REFERENCES materias (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS paginas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    caderno_id INT UNSIGNED NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    conteudo LONGTEXT NULL,
    ordem INT UNSIGNED NOT NULL DEFAULT 1,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caderno_id) REFERENCES cadernos (id) ON DELETE CASCADE
);

CREATE TABLE flashcards (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    pergunta TEXT NOT NULL,
    resposta TEXT NOT NULL,
    color_hex CHAR(7) NOT NULL DEFAULT '#F8FF97',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_conversas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    titulo VARCHAR(150) DEFAULT 'Nova conversa',
    criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_mensagens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversa_id INT UNSIGNED NOT NULL,
    tipo ENUM('user', 'assistant') NOT NULL,
    conteudo TEXT NOT NULL,
    criada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversa_id) REFERENCES chat_conversas (id) ON DELETE CASCADE
);

UPDATE users SET papel = 'admin' WHERE email = 'admin@gmail.com';