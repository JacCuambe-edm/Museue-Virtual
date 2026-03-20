const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'museu_edm',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(poolConfig);
  }
  return pool;
}

async function initDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306'),
    charset: 'utf8mb4'
  });

  const dbName = process.env.DB_NAME || 'museu_edm';

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.query(`USE \`${dbName}\``);

  // Users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      bio TEXT,
      category VARCHAR(255),
      address VARCHAR(255),
      date_of_birth DATETIME,
      allow_notifications BOOLEAN DEFAULT FALSE,
      role ENUM('admin', 'editor', 'viewer') DEFAULT 'editor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Articles table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      short_description VARCHAR(500),
      body_text LONGTEXT,
      body_text2 LONGTEXT,
      body_text3 LONGTEXT,
      category VARCHAR(100),
      image3 VARCHAR(500),
      views INT DEFAULT 0,
      likes TEXT,
      added_to_favorites TEXT,
      author_email VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Testemunhos table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS testemunhos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      message LONGTEXT,
      image VARCHAR(500),
      department VARCHAR(255),
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Testimonials table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      descricao TEXT,
      foto VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Tags table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS tags (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      creator_email VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Patrimonios table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS patrimonios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255),
      sigla VARCHAR(50),
      area_negocio VARCHAR(100),
      tipo VARCHAR(50) DEFAULT 'Substacao',
      localizacao VARCHAR(500),
      ano_entrada_servico VARCHAR(255),
      potencia_instalada_inicial VARCHAR(255),
      potencia_instalada_actual VARCHAR(255),
      niveis_tensao VARCHAR(255),
      transformadores_potencia VARCHAR(500),
      barramento_inicial VARCHAR(255),
      barramento_final VARCHAR(255),
      capacidade_linha VARCHAR(255),
      condutor VARCHAR(255),
      circuito VARCHAR(255),
      comprimento VARCHAR(255),
      tipo_postes VARCHAR(255),
      tipo_condutor VARCHAR(255),
      tipo_isoladores VARCHAR(255),
      cabo_guarda VARCHAR(255),
      nota LONGTEXT,
      descricao LONGTEXT,
      foto VARCHAR(500),
      galeria JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Exposicoes table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS exposicoes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255),
      curador VARCHAR(255),
      localizacao VARCHAR(255),
      responsavel VARCHAR(255),
      descricao LONGTEXT,
      artefatos_expostos TEXT,
      foto1 VARCHAR(500),
      foto2 VARCHAR(500),
      galeria JSON,
      data_inicio DATETIME,
      data_fim DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Eventos table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS eventos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      subtitulo TEXT,
      foto VARCHAR(500),
      local_evento VARCHAR(255),
      participantes TEXT,
      data_inicio DATETIME,
      data_fim DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Artefatos table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS artefatos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      categoria VARCHAR(100),
      area_negocio VARCHAR(100),
      data_aquisicao VARCHAR(100),
      origem VARCHAR(255),
      localizacao VARCHAR(255),
      estado VARCHAR(100),
      material VARCHAR(255),
      dimensoes TEXT,
      responsavel VARCHAR(255),
      descricao TEXT,
      foto VARCHAR(255),
      galeria LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Page Metrics Logs table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS page_metrics_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      entity_type VARCHAR(50) NOT NULL,
      entity_id INT NOT NULL,
      action ENUM('view', 'like') NOT NULL,
      session_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Comments table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      entity_type VARCHAR(50) NOT NULL,
      entity_id INT NOT NULL,
      author_name VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Replies table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS replies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      comment_id INT,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await connection.end();
  console.log(`✅ Database "${dbName}" initialized with all tables`);
}

module.exports = { getPool, initDatabase };
