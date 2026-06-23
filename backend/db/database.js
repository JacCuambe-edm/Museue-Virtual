const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'museu.db');
const db = new DatabaseSync(DB_PATH);

function init() {
  db.exec('PRAGMA journal_mode=WAL');
  db.exec('PRAGMA foreign_keys=ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editor',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      category TEXT,
      author TEXT,
      body_text TEXT,
      image3 TEXT,
      views INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS article_tags (
      article_id INTEGER NOT NULL,
      tag_id INTEGER NOT NULL,
      PRIMARY KEY (article_id, tag_id),
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS testemunhos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department TEXT,
      message TEXT NOT NULL,
      image TEXT,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS patrimonios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      sigla TEXT,
      area_negocio TEXT,
      tipo TEXT,
      circuito TEXT,
      localizacao TEXT,
      regiao TEXT,
      ano_entrada_servico TEXT,
      potencia_instalada_inicial TEXT,
      potencia_instalada_actual TEXT,
      niveis_tensao TEXT,
      transformadores_potencia TEXT,
      barramento_inicial TEXT,
      barramento_final TEXT,
      capacidade_linha TEXT,
      condutor TEXT,
      comprimento TEXT,
      tipo_postes TEXT,
      tipo_condutor TEXT,
      tipo_isoladores TEXT,
      cabo_guarda TEXT,
      foto TEXT,
      descricao TEXT,
      nota TEXT,
      galeria TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS exposicoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT,
      curador TEXT,
      responsavel TEXT,
      localizacao TEXT,
      data_inicio TEXT,
      data_fim TEXT,
      artefatos_expostos TEXT,
      descricao TEXT,
      foto1 TEXT,
      foto2 TEXT,
      galeria TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS eventos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      subtitulo TEXT,
      tipo TEXT,
      data_inicio TEXT,
      data_fim TEXT,
      participantes TEXT,
      local_evento TEXT,
      descricao TEXT,
      foto TEXT,
      galeria TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS artefatos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      categoria TEXT,
      area_negocio TEXT,
      data_aquisicao TEXT,
      origem TEXT,
      localizacao TEXT,
      estado_conservacao TEXT,
      material TEXT,
      dimensoes TEXT,
      responsavel TEXT,
      descricao TEXT,
      foto TEXT,
      galeria TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      author_email TEXT,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id INTEGER NOT NULL,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(entity_type, entity_id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT UNIQUE NOT NULL,
      referrer TEXT,
      page_path TEXT,
      page_title TEXT,
      device TEXT,
      ip TEXT,
      started_at TEXT DEFAULT (datetime('now')),
      ended_at TEXT,
      duration_seconds INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      page_path TEXT NOT NULL,
      page_title TEXT,
      prev_page_id INTEGER,
      time_spent_seconds INTEGER DEFAULT 0,
      viewed_at TEXT DEFAULT (datetime('now'))
    );
  `);

  seed();
}

function loadSeedFile(name) {
  const p = path.join(__dirname, 'seeds', `${name}.json`);
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return []; }
}

function seed() {
  const existing = db.prepare('SELECT COUNT(*) as c FROM users').get();
  if (existing.c > 0) return;

  console.log('🌱 A inicializar base de dados com dados de seed...');

  // Admin user
  const hash = bcrypt.hashSync('admin@edm2025', 10);
  db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
    .run('Administrador EDM', 'admin@museu.edm.co.mz', hash, 'admin');

  // Articles
  const articles = loadSeedFile('articles');
  if (articles.length) {
    const stmt = db.prepare(
      'INSERT INTO articles (id, title, subtitle, category, author, body_text, image3, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    for (const r of articles) {
      stmt.run(r.id, r.title, r.subtitle, r.category, r.author, r.body_text, r.image3,
        r.created_at || new Date().toISOString(), r.updated_at || new Date().toISOString());
    }
    console.log(`  ✅ ${articles.length} artigos`);
  }

  // Testemunhos
  const testemunhos = loadSeedFile('testemunhos');
  if (testemunhos.length) {
    const stmt = db.prepare(
      'INSERT INTO testemunhos (id, name, department, message, image, display_order) VALUES (?, ?, ?, ?, ?, ?)'
    );
    for (const r of testemunhos) {
      stmt.run(r.id, r.name, r.department, r.message, r.image, r.display_order || 0);
    }
    console.log(`  ✅ ${testemunhos.length} testemunhos`);
  }

  // Patrimonios
  const patrimonios = loadSeedFile('patrimonios');
  if (patrimonios.length) {
    const stmt = db.prepare(`
      INSERT INTO patrimonios (id, nome, sigla, area_negocio, tipo, circuito, localizacao, regiao,
        ano_entrada_servico, potencia_instalada_inicial, potencia_instalada_actual, niveis_tensao,
        transformadores_potencia, barramento_inicial, barramento_final, capacidade_linha, condutor,
        comprimento, tipo_postes, tipo_condutor, tipo_isoladores, cabo_guarda,
        foto, descricao, nota, galeria) VALUES
      (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `);
    for (const r of patrimonios) {
      stmt.run(r.id, r.nome, r.sigla, r.area_negocio, r.tipo, r.circuito, r.localizacao, r.regiao,
        r.ano_entrada_servico, r.potencia_instalada_inicial, r.potencia_instalada_actual, r.niveis_tensao,
        r.transformadores_potencia, r.barramento_inicial, r.barramento_final, r.capacidade_linha, r.condutor,
        r.comprimento, r.tipo_postes, r.tipo_condutor, r.tipo_isoladores, r.cabo_guarda,
        r.foto, r.descricao, r.nota, r.galeria || '[]');
    }
    console.log(`  ✅ ${patrimonios.length} patrimónios`);
  }

  // Exposicoes
  const exposicoes = loadSeedFile('exposicoes');
  if (exposicoes.length) {
    const stmt = db.prepare(`
      INSERT INTO exposicoes (id, titulo, curador, responsavel, localizacao, data_inicio, data_fim,
        artefatos_expostos, descricao, foto1, foto2, galeria) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `);
    for (const r of exposicoes) {
      stmt.run(r.id, r.titulo, r.curador, r.responsavel, r.localizacao, r.data_inicio, r.data_fim,
        r.artefatos_expostos, r.descricao, r.foto1, r.foto2, r.galeria || '[]');
    }
    console.log(`  ✅ ${exposicoes.length} exposições`);
  }

  // Eventos
  const eventos = loadSeedFile('eventos');
  if (eventos.length) {
    const stmt = db.prepare(`
      INSERT INTO eventos (id, nome, subtitulo, tipo, data_inicio, data_fim, participantes,
        local_evento, descricao, foto, galeria) VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `);
    for (const r of eventos) {
      stmt.run(r.id, r.nome, r.subtitulo, r.tipo, r.data_inicio, r.data_fim, r.participantes,
        r.local_evento, r.descricao, r.foto, r.galeria || '[]');
    }
    console.log(`  ✅ ${eventos.length} eventos`);
  }

  // Artefatos
  const artefatos = loadSeedFile('artefatos');
  if (artefatos.length) {
    const stmt = db.prepare(`
      INSERT INTO artefatos (id, nome, categoria, area_negocio, data_aquisicao, origem, localizacao,
        estado_conservacao, material, dimensoes, responsavel, descricao, foto, galeria) VALUES
      (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `);
    for (const r of artefatos) {
      stmt.run(r.id, r.nome, r.categoria, r.area_negocio, r.data_aquisicao, r.origem, r.localizacao,
        r.estado_conservacao, r.material, r.dimensoes, r.responsavel, r.descricao, r.foto, r.galeria || '[]');
    }
    console.log(`  ✅ ${artefatos.length} artefatos`);
  }

  console.log('✅ Seed concluído. Login: admin@museu.edm.co.mz / admin@edm2025');
}

module.exports = { db, init };
