CREATE DATABASE IF NOT EXISTS papyrus
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE papyrus;

-- ------------------------------------------------------------
-- Tabela 1: users
-- Armazena identidade e credenciais de acesso.
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
-- ------------------------------------------------------------
CREATE TABLE assuntos (
                          id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                          user_id          INT UNSIGNED NOT NULL,
                          nome             VARCHAR(100) NOT NULL,
                          color_hex        CHAR(7) NOT NULL DEFAULT '#6366f1',
                          horas_semanais   TINYINT UNSIGNED DEFAULT 0,

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

SELECT * FROM users;