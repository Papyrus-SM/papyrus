CREATE DATABASE IF NOT EXISTS papyrus
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE papyrus;

-- ------------------------------------------------------------
-- Tabela 1: users
-- Armazena os dados principais do usuário do sistema.
-- Também sustenta as funcionalidades de cadastro, login e perfil.
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
-- Controla se o usuário já concluiu o onboarding inicial.
-- Relação 1:1 com users.
-- ------------------------------------------------------------
CREATE TABLE perfil_onboarding (
                                   id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                                   user_id          INT UNSIGNED NOT NULL UNIQUE,
                                   concluido        BOOLEAN DEFAULT FALSE,
                                   concluido_em     TIMESTAMP NULL,

                                   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela 3: materias
-- Representa as matérias estudadas pelo usuário.
-- Esta passa a ser a entidade central do domínio de estudos.
-- ------------------------------------------------------------
CREATE TABLE materias (
                          id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                          user_id          INT UNSIGNED NOT NULL,
                          nome             VARCHAR(100) NOT NULL,
                          descricao        TEXT NULL,
                          color_hex        CHAR(7) NOT NULL DEFAULT '#F8FF97',
                          horas_semanais   TINYINT UNSIGNED DEFAULT 0,

                          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela 4: horarios_aula
-- Cada linha representa um horário recorrente semanal de uma matéria.
-- Pode ser usada futuramente para calendário/cronograma semanal.
-- ------------------------------------------------------------
CREATE TABLE horarios_aula (
                               id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                               materia_id       INT UNSIGNED NOT NULL,
                               dia_da_semana    ENUM('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo') NOT NULL,
                               hora_inicia      TIME NOT NULL,
                               hora_termina     TIME NOT NULL,
                               lugar            VARCHAR(100) NULL,

                               FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela 5: tarefas
-- Tarefas vinculadas a uma matéria específica.
-- Cada matéria pode possuir várias tarefas.
-- ------------------------------------------------------------
CREATE TABLE tarefas (
                         id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                         materia_id       INT UNSIGNED NOT NULL,
                         titulo           VARCHAR(150) NOT NULL,
                         descricao        TEXT NULL,
                         dificuldade      ENUM('facil', 'medio', 'dificil') NULL,
                         data_entrega     DATETIME NULL,
                         concluida        BOOLEAN DEFAULT FALSE,
                         data_criacao     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                         FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela 6: stick_notes
-- Post-its/anotações rápidas do usuário no dashboard.
-- ------------------------------------------------------------
CREATE TABLE sticky_notes (
                              id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                              user_id          INT UNSIGNED NOT NULL,
                              titulo			      TEXT,
                              texto            TEXT NOT NULL,
                              cor              VARCHAR(20) DEFAULT '#ffff88', -- A ideia é que a cor será definida pelo usuário
                              pos_x            INT DEFAULT 0,
                              pos_y            INT DEFAULT 0,

                              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Tabela 7: eventos
-- Eventos pontuais do usuário, como provas, trabalhos e revisões.
-- Opcionalmente podem estar vinculados a uma matéria.
-- ------------------------------------------------------------
CREATE TABLE eventos (
                         id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                         user_id          INT UNSIGNED NOT NULL,
                         materia_id       INT UNSIGNED NULL,
                         titulo           VARCHAR(150) NOT NULL,
                         inicio           DATETIME NOT NULL,
                         fim              DATETIME NULL,
                         tipo             VARCHAR(50) NOT NULL,
                         dia_inteiro      BOOLEAN DEFAULT FALSE,

                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                         FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- Tabela 8: lembretes
-- Lembretes independentes do usuário.
-- ------------------------------------------------------------
CREATE TABLE lembretes (
                           id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                           user_id            INT UNSIGNED NOT NULL,
                           titulo             VARCHAR(150) NOT NULL,
                           data_hora          DATETIME NOT NULL,
                           enviado            BOOLEAN DEFAULT FALSE,
                           marcado_concluido  BOOLEAN DEFAULT FALSE,

                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);