CREATE DATABASE db_prueba;
USE db_prueba;}

CREATE TABLE users(
    id INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

CREATE TABLE links(
    id INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(150) NOT NULL,
    url VARCHAR(255) NOT NULL,
    descripcion TEXT,
    user_id INT(11), FOREIGN KEY (user_id) REFERENCES users(id),
    create_at timestamp NOT NULL DEFAULT current_timestamp
);

