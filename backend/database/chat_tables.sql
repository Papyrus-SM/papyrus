USE papyrus;

CREATE TABLE IF NOT EXISTS chat_conversas (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    titulo      VARCHAR(150) DEFAULT 'Nova conversa',
    criada_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_mensagens (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversa_id     INT UNSIGNED NOT NULL,
    tipo            ENUM('user', 'assistant') NOT NULL,
    conteudo        TEXT NOT NULL,
    criada_em       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversa_id) REFERENCES chat_conversas(id) ON DELETE CASCADE
);
