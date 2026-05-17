CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    role VARCHAR(50) DEFAULT 'user',
    provider VARCHAR(50) DEFAULT 'local',
    resetPasswordToken VARCHAR(255) DEFAULT NULL,
    resetPasswordExpires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password_reset_sent_at TIMESTAMP NULL,
    gender VARCHAR(10) DEFAULT NULL,
    dob DATE DEFAULT NULL,
    age INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users
(name, email, password, role, provider)
VALUES
(
  'Admin',
  'example@gmail.com',
  '$2b$12$r0fU6U9OKa24BBRawpwY1ueqf48AGsr19TxsG2iptWS988dlB8gMu',
  'admin',
  'local'
);

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) DEFAULT NULL,
    category ENUM('concert', 'sports', 'theater', 'comedy', 'festival') DEFAULT 'concert',
    date DATE NOT NULL,
    time TIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    description TEXT,
    featured TINYINT(1) DEFAULT 0,
    image VARCHAR(255) DEFAULT NULL,
    tags TEXT,
    seat_map_config LONGTEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE ticket_tiers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventId INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    capacity INT NOT NULL DEFAULT 0,
    available INT NOT NULL DEFAULT 0,
    description TEXT,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    eventId INT NOT NULL,
    tierId INT NOT NULL,
    seat VARCHAR(50) DEFAULT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    active TINYINT(1) DEFAULT 1,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (tierId) REFERENCES ticket_tiers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;