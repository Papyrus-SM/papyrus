CREATE DATABASE IF NOT EXISTS papyrus
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE papyrus;

-- ------------------------------------------------------------
-- Tabela 1: users
-- Armazena identidade e credenciais de acesso.
-- NOTA: Esta mesma tabela atende ao CRUD de `Meu Perfil` recém adicionado,
-- englobando nome, email, senha e outros dados visíveis.
-- ------------------------------------------------------------
CREATE TABLE users (
                       id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                       nome             VARCHAR(100) NOT NULL,
                       email            VARCHAR(150) NOT NULL UNIQUE,
                       senha_hash       VARCHAR(255) NOT NULL,
                       data_nascimento  DATE NOT NULL,
                       genero           ENUM('masculino', 'feminino', 'prefiro_nao_dizer') NOT NULL
);

-- ------------------------------------------------------------
-- Tabela 2: perfil_onboarding
-- Armazena o contexto inicial do usuário.
-- Relação 1:1 lógica com users (um usuário pode ter no máximo um perfil).
-- ------------------------------------------------------------
CREATE TABLE perfil_onboarding (
                                   id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                                   user_id          INT UNSIGNED NOT NULL UNIQUE,
                                   contexto_estudo  ENUM('universidade', 'escola', 'auto_didata') NOT NULL,
                                   concluido        BOOLEAN DEFAULT FALSE,
                                   concluido_em     TIMESTAMP NULL,

                                   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela 3: assuntos
-- Cada assunto pertence a um usuário.
-- Pessoal, é importante alinhar como isso funcionará na prática, porque o banco de dados não faz essa criação de forma automática, no banco de dados, não definimos uma "relação" para enviar um valor numérico para criar tabelas/linhas (msm com php puro, n consegui achar nada da forma como foi explicada na reunião), quem fará essa lógica de criar n matérias pelos n assuntos diferentes vai ser o back msm (PHP / API), deu bom de criar as tabelas que serão usadas até segunda [Gabriel]
-- ------------------------------------------------------------
CREATE TABLE assuntos (
                          id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                          user_id          INT UNSIGNED NOT NULL,
                          nome             VARCHAR(100) NOT NULL,
                          color_hex        CHAR(7) NOT NULL DEFAULT '#f8ff97ff',
                          horas_semanais   TINYINT UNSIGNED DEFAULT 0,
                          numero_assuntos INT UNSIGNED NOT NULL,

                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela 4: horarios_aula
-- Cada linha representa um bloco recorrente de aula na semana.
-- ------------------------------------------------------------
CREATE TABLE horarios_aula (
                               id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                               assunto_id       INT UNSIGNED NOT NULL,
                               dia_da_semana    ENUM('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo') NOT NULL,
                               hora_inicia      TIME NOT NULL,
                               hora_termina     TIME NOT NULL,
                               lugar            VARCHAR(100) NULL,

                               FOREIGN KEY (assunto_id) REFERENCES assuntos(id) ON DELETE CASCADE
);


-- Eventos pontuais do usuário (provas, trabalhos, revisões, etc)

CREATE TABLE eventos (
                         id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                         user_id          INT UNSIGNED NOT NULL,
                         assunto_id       INT UNSIGNED NULL,
                         titulo           VARCHAR(150) NOT NULL,
                         inicio           DATETIME NOT NULL,
                         fim              DATETIME NULL,
                         tipo             VARCHAR(50) NOT NULL,
                         dia_inteiro      BOOLEAN DEFAULT FALSE,

                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                         FOREIGN KEY (assunto_id) REFERENCES assuntos(id) ON DELETE SET NULL
);

-- Lembretes associados ao usuário

CREATE TABLE lembretes (
                           id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                           user_id          INT UNSIGNED NOT NULL,
                           titulo           VARCHAR(150) NOT NULL,
                           data_hora        DATETIME NOT NULL,
                           enviado          BOOLEAN DEFAULT FALSE,
                           marcado_concluido BOOLEAN DEFAULT FALSE,

                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cronogramas de estudo criados pelo usuário (revisar para retirar no momento, não iremos entregar o cronograma mensal na primeira sprint [Gabriel])

--CREATE TABLE cronogramas (
--                             id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
--                             user_id          INT UNSIGNED NOT NULL,
--                             titulo           VARCHAR(150) NOT NULL,
--                             data_inicio      DATE NOT NULL,
--                             data_fim         DATE NULL,

--                             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
--);

-- ------------------------------------------------------------
-- Tabela: materias
-- Baseada nos 'assuntos' configurados, cada matéria pertence a um usuário.
-- ------------------------------------------------------------
CREATE TABLE materias (
                          id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                          user_id          INT UNSIGNED NOT NULL,
                          assunto_id       INT UNSIGNED NOT NULL,
                          numero_assuntos INT UNSIGNED NOT NULL,
                          nome             VARCHAR(100) NOT NULL,
                          descricao        TEXT NULL,
                          color_hex        CHAR(7) NOT NULL DEFAULT '#f8ff97ff',
                          FOREIGN KEY (numero_assuntos) REFERENCES assuntos(numero_assuntos) ON DELETE CASCADE,
                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                          FOREIGN KEY (assunto_id) REFERENCES assuntos(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Relação de muitas tarefas para uma matéria (1:N). 
-- Tarefas exclusivas de CADA matéria.
-- Lembrando: Essa tabela será usada para o CRUD de tarefas EXCLUSIVA de cada matéria e não aparecerá na tela de outras tarefas [Gabriel]
-- ------------------------------------------------------------
CREATE TABLE tarefas (
                         id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                         materia_id       INT UNSIGNED NOT NULL,
                         titulo           VARCHAR(150) NOT NULL,
                         descricao        TEXT NULL,
                         concluida        BOOLEAN DEFAULT FALSE,
                         data_criacao     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                         FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Para a funcionalidade do usuário colocar "post-its" na tela.
-- ------------------------------------------------------------
CREATE TABLE stick_notes (
                             id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                             user_id          INT UNSIGNED NOT NULL,
                             texto            TEXT NOT NULL,
                             cor              VARCHAR(20) DEFAULT '#ffff88', -- A ideia é que a cor será definida pelo usuário
                             pos_x            INT DEFAULT 0,
                             pos_y            INT DEFAULT 0,

                             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

