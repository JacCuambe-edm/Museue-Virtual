#!/usr/bin/env node
'use strict';
/**
 * migrate-mysql.js
 * Importa dados do dump MySQL para a base de dados SQLite do Museu Virtual EDM.
 *
 * Uso:
 *   node backend/scripts/migrate-mysql.js [caminho/para/dump.sql]
 *
 * Se o caminho não for fornecido, tenta backend/museu_edm_final.sql
 */

const path = require('path');
const fs   = require('fs');
const { DatabaseSync } = require('node:sqlite');

// ── Caminhos ─────────────────────────────────────────────────────────────────
const SQL_FILE = process.argv[2] || path.join(__dirname, '..', 'museu_edm_final.sql');
const DB_PATH  = path.join(__dirname, '..', 'museu.db');

if (!fs.existsSync(SQL_FILE)) {
  console.error(`\n❌  Ficheiro SQL não encontrado: ${SQL_FILE}`);
  console.error('    Coloque museu_edm_final.sql em backend/ ou passe o caminho:\n');
  console.error('    node backend/scripts/migrate-mysql.js C:\\caminho\\para\\ficheiro.sql\n');
  process.exit(1);
}
if (!fs.existsSync(DB_PATH)) {
  console.error(`\n❌  Base de dados não encontrada: ${DB_PATH}`);
  console.error('    Inicie o backend uma vez para criar o ficheiro museu.db\n');
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode=WAL');
db.exec('PRAGMA foreign_keys=OFF');

// ── Parser MySQL ──────────────────────────────────────────────────────────────

/**
 * Analisa um valor de string MySQL a partir da posição pos (que deve apontar
 * para a aspa de abertura). Devolve { val: string, end: índice após a aspa de fecho }.
 */
function parseMySQLString(src, pos) {
  let i = pos + 1; // salta aspa de abertura
  let out = '';
  const ESC = { n:'\n', r:'\r', t:'\t', '\\':'\\', "'":"'", '"':'"', '0':'\0', Z:'\x1A', b:'\b' };
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') {
      i++;
      out += ESC[src[i]] ?? src[i];
      i++;
    } else if (c === "'" && src[i + 1] === "'") {
      out += "'"; i += 2;        // '' escape duplo
    } else if (c === "'") {
      i++; break;                // fim da string
    } else {
      out += c; i++;
    }
  }
  return { val: out, end: i };
}

/**
 * Analisa as linhas de valores a partir de startPos até encontrar ';'.
 * Devolve { rows: Array<object>, end: posição após o ';' }.
 */
function parseValueRows(src, startPos, cols) {
  const rows = [];
  let i = startPos;
  const n = src.length;

  while (i < n) {
    // Avança até '(' ou ';'
    while (i < n && src[i] !== '(' && src[i] !== ';') i++;
    if (i >= n || src[i] === ';') { i++; break; }
    i++; // salta '('

    const vals = [];
    while (i < n) {
      while (i < n && /[\s]/.test(src[i])) i++;
      if (i >= n) break;
      if (src[i] === ')') { i++; break; }
      if (src[i] === ',') { i++; continue; }

      if (src[i] === "'") {
        const res = parseMySQLString(src, i);
        vals.push(res.val);
        i = res.end;
      } else if (src.slice(i, i + 4) === 'NULL' && /[\W]/.test(src[i + 4] ?? ' ')) {
        vals.push(null);
        i += 4;
      } else {
        // número ou literal
        let lit = '';
        while (i < n && src[i] !== ',' && src[i] !== ')') lit += src[i++];
        lit = lit.trim();
        vals.push(lit === '' ? null : (/^-?\d+(\.\d+)?$/.test(lit) ? Number(lit) : lit));
      }

      while (i < n && /[\s]/.test(src[i])) i++;
      if (i < n && src[i] === ',') i++;
    }

    // Mapear posições para nomes de colunas
    const obj = {};
    cols.forEach((c, ci) => { obj[c] = vals[ci] ?? null; });
    rows.push(obj);

    // Salta vírgulas e espaços entre linhas; pára em ';'
    while (i < n && /[\s,]/.test(src[i])) {
      if (src[i] === ';') { i++; break; }
      i++;
    }
    if (i < n && src[i] === ';') { i++; break; }
  }

  return { rows, end: i };
}

/**
 * Analisa todo o dump MySQL e devolve um objecto com as tabelas encontradas.
 */
function parseDump(content) {
  const result = {};
  const re = /INSERT INTO `(\w+)` \(([^)]+)\) VALUES\s*/g;
  let m;

  while ((m = re.exec(content)) !== null) {
    const tableName = m[1];
    const cols = m[2].split(',').map(c => c.trim().replace(/`/g, ''));
    const startPos = m.index + m[0].length;

    const { rows, end } = parseValueRows(content, startPos, cols);

    if (!result[tableName]) result[tableName] = { cols, rows: [] };
    result[tableName].rows.push(...rows);

    re.lastIndex = end;
  }

  return result;
}

// ── Utilitários ───────────────────────────────────────────────────────────────

/** Adiciona https: a URLs protocol-relative (que começam com //) */
function normalizeUrl(url) {
  if (!url || typeof url !== 'string') return url;
  return url.startsWith('//') ? 'https:' + url : url;
}

/**
 * Extrai a região do campo `nota` do MySQL:
 * "Transmissão Norte" → "Norte"
 * "Geração Centro"    → "Centro"
 */
function extractRegiao(nota) {
  if (!nota) return null;
  const cleaned = nota
    .replace(/Transmiss[aã]o\s*/gi, '')
    .replace(/Gera[cç][aã]o\s*/gi, '')
    .replace(/Distribui[cç][aã]o\s*/gi, '')
    .replace(/\s*,\s*/g, ', ')
    .trim();
  return cleaned || nota;
}

/** Actualiza o contador AUTOINCREMENT de uma tabela */
function syncSequence(tableName) {
  db.exec(`
    INSERT OR REPLACE INTO sqlite_sequence (name, seq)
    VALUES ('${tableName}', (SELECT COALESCE(MAX(id), 0) FROM ${tableName}))
  `);
}

// ── Funções de importação ─────────────────────────────────────────────────────

function importArticles(tbl) {
  if (!tbl || !tbl.rows.length) { console.log('   ⚠  Sem dados de articles no dump'); return; }

  console.log(`\n📰 Artigos — ${tbl.rows.length} registos encontrados`);
  db.exec('DELETE FROM articles');
  db.exec("DELETE FROM metrics WHERE entity_type='article'");

  const ins = db.prepare(`
    INSERT OR IGNORE INTO articles
      (id, title, subtitle, category, author, body_text, image3, created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?)
  `);
  const mIns = db.prepare(`
    INSERT OR IGNORE INTO metrics (entity_type, entity_id, views, likes)
    VALUES ('article',?,?,?)
  `);

  let n = 0;
  for (const r of tbl.rows) {
    // Concatenar body_text + body_text2 + body_text3
    const body = [r.body_text, r.body_text2, r.body_text3]
      .filter(p => p && p.trim())
      .join('\n\n');

    ins.run(
      r.id,
      r.title,
      r.short_description,        // subtitle no SQLite
      r.category,
      r.author_email || 'EDM',   // author no SQLite
      body,
      normalizeUrl(r.image3),
      r.created_at || new Date().toISOString(),
      r.updated_at || new Date().toISOString()
    );

    if ((r.views || 0) > 0 || (r.likes_count || 0) > 0)
      mIns.run(r.id, r.views || 0, r.likes_count || 0);

    n++;
  }

  syncSequence('articles');
  console.log(`   ✅ ${n} artigos importados`);
}

function importArtefatos(tbl) {
  if (!tbl || !tbl.rows.length) { console.log('   ⚠  Sem dados de artefatos no dump'); return; }

  console.log(`\n🏺 Artefatos — ${tbl.rows.length} registos encontrados`);
  db.exec('DELETE FROM artefatos');
  db.exec("DELETE FROM metrics WHERE entity_type='artifact'");

  const ins = db.prepare(`
    INSERT OR IGNORE INTO artefatos
      (id, nome, categoria, area_negocio, data_aquisicao, origem, localizacao,
       estado_conservacao, material, dimensoes, responsavel, descricao, foto, galeria, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  const mIns = db.prepare(`
    INSERT OR IGNORE INTO metrics (entity_type, entity_id, views, likes)
    VALUES ('artifact',?,?,?)
  `);

  let n = 0;
  for (const r of tbl.rows) {
    // MySQL usa 'titulo', SQLite usa 'nome'; MySQL usa 'estado', SQLite usa 'estado_conservacao'
    const nome  = r.titulo || r.nome || '';
    const estado = r.estado || r.estado_conservacao || null;

    ins.run(
      r.id, nome, r.categoria, r.area_negocio, r.data_aquisicao,
      r.origem, r.localizacao, estado, r.material, r.dimensoes,
      r.responsavel, r.descricao,
      normalizeUrl(r.foto),
      r.galeria || '[]',
      r.created_at || new Date().toISOString()
    );

    if ((r.views || 0) > 0 || (r.likes_count || 0) > 0)
      mIns.run(r.id, r.views || 0, r.likes_count || 0);

    n++;
  }

  syncSequence('artefatos');
  console.log(`   ✅ ${n} artefatos importados`);
}

function importExposicoes(tbl) {
  if (!tbl || !tbl.rows.length) { console.log('   ⚠  Sem dados de exposicoes no dump'); return; }

  console.log(`\n🎨 Exposições — ${tbl.rows.length} registos encontrados`);
  db.exec('DELETE FROM exposicoes');
  db.exec("DELETE FROM metrics WHERE entity_type='exhibition'");

  const ins = db.prepare(`
    INSERT OR IGNORE INTO exposicoes
      (id, titulo, curador, responsavel, localizacao, data_inicio, data_fim,
       artefatos_expostos, descricao, foto1, foto2, galeria, created_at, updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  const mIns = db.prepare(`
    INSERT OR IGNORE INTO metrics (entity_type, entity_id, views, likes)
    VALUES ('exhibition',?,?,?)
  `);

  let n = 0;
  for (const r of tbl.rows) {
    ins.run(
      r.id, r.titulo, r.curador, r.responsavel, r.localizacao,
      r.data_inicio, r.data_fim, r.artefatos_expostos, r.descricao,
      normalizeUrl(r.foto1), normalizeUrl(r.foto2),
      r.galeria || '[]',
      r.created_at || new Date().toISOString(),
      r.updated_at || new Date().toISOString()
    );

    if ((r.views || 0) > 0 || (r.likes_count || 0) > 0)
      mIns.run(r.id, r.views || 0, r.likes_count || 0);

    n++;
  }

  syncSequence('exposicoes');
  console.log(`   ✅ ${n} exposições importadas`);
}

function importPatrimonios(tbl) {
  if (!tbl || !tbl.rows.length) { console.log('   ⚠  Sem dados de patrimonios no dump'); return; }

  console.log(`\n🏛️  Patrimónios — ${tbl.rows.length} registos encontrados`);
  db.exec('DELETE FROM patrimonios');
  db.exec("DELETE FROM metrics WHERE entity_type='heritage'");

  const ins = db.prepare(`
    INSERT OR IGNORE INTO patrimonios
      (id, nome, sigla, area_negocio, tipo, circuito, localizacao, regiao,
       ano_entrada_servico, potencia_instalada_inicial, potencia_instalada_actual,
       niveis_tensao, transformadores_potencia, barramento_inicial, barramento_final,
       capacidade_linha, condutor, comprimento, tipo_postes, tipo_condutor,
       tipo_isoladores, cabo_guarda, foto, descricao, nota, galeria, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);
  const mIns = db.prepare(`
    INSERT OR IGNORE INTO metrics (entity_type, entity_id, views, likes)
    VALUES ('heritage',?,?,?)
  `);

  let n = 0;
  for (const r of tbl.rows) {
    // MySQL 'nota' contém a região (ex: "Transmissão Norte") → SQLite 'regiao'
    const regiao = extractRegiao(r.nota);

    ins.run(
      r.id, r.nome, r.sigla, r.area_negocio, r.tipo,
      r.circuito, r.localizacao, regiao,
      r.ano_entrada_servico, r.potencia_instalada_inicial, r.potencia_instalada_actual,
      r.niveis_tensao, r.transformadores_potencia,
      r.barramento_inicial, r.barramento_final, r.capacidade_linha,
      r.condutor, r.comprimento, r.tipo_postes, r.tipo_condutor,
      r.tipo_isoladores, r.cabo_guarda,
      normalizeUrl(r.foto),
      r.descricao,
      r.nota,                    // mantém o valor original em 'nota'
      r.galeria || '[]',
      r.created_at || new Date().toISOString()
    );

    if ((r.views || 0) > 0 || (r.likes_count || 0) > 0)
      mIns.run(r.id, r.views || 0, r.likes_count || 0);

    n++;
  }

  syncSequence('patrimonios');
  console.log(`   ✅ ${n} patrimónios importados`);
}

function importTestemunhos(tbl) {
  if (!tbl || !tbl.rows.length) { console.log('   ⚠  Sem dados de testemunhos no dump'); return; }

  console.log(`\n💬 Testemunhos — ${tbl.rows.length} registos encontrados`);
  db.exec('DELETE FROM testemunhos');

  const ins = db.prepare(`
    INSERT OR IGNORE INTO testemunhos
      (id, name, department, message, image, display_order, created_at)
    VALUES (?,?,?,?,?,?,?)
  `);

  let n = 0;
  for (const r of tbl.rows) {
    // SQLite requer message NOT NULL; se vier vazia, usa fallback
    const message = (r.message && r.message.trim()) ? r.message : '—';

    ins.run(
      r.id, r.name, r.department, message,
      normalizeUrl(r.image),
      r.display_order ?? 0,
      r.created_at || new Date().toISOString()
    );
    n++;
  }

  syncSequence('testemunhos');
  console.log(`   ✅ ${n} testemunhos importados`);
}

function importUsers(tbl) {
  if (!tbl || !tbl.rows.length) { console.log('   ⚠  Sem dados de users no dump'); return; }

  console.log(`\n👤 Utilizadores — ${tbl.rows.length} registos encontrados`);

  // INSERT OR IGNORE por id; se o email já existir, salta (preserva admin existente)
  const ins = db.prepare(`
    INSERT OR IGNORE INTO users (id, name, email, password_hash, role, created_at)
    VALUES (?,?,?,?,?,?)
  `);

  let n = 0;
  for (const r of tbl.rows) {
    if (!r.email || !r.password_hash) continue;

    // Derivar nome do email (MySQL não tem campo 'name')
    const username = r.email.split('@')[0];
    const name = username
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .trim() || 'Utilizador';

    try {
      ins.run(
        r.id, name, r.email, r.password_hash,
        r.role || 'editor',
        r.created_at || new Date().toISOString()
      );
      n++;
    } catch {
      // email duplicado — ignora
    }
  }

  syncSequence('users');
  console.log(`   ✅ ${n} utilizadores importados`);
}

// ── Principal ─────────────────────────────────────────────────────────────────

function main() {
  console.log('\n🏛️  Migração MySQL → SQLite — Museu Virtual EDM');
  console.log('─'.repeat(50));

  // 1. Ler ficheiro
  console.log(`\n📖 A ler: ${path.basename(SQL_FILE)}`);
  let content = fs.readFileSync(SQL_FILE, 'utf8');
  console.log(`   Tamanho: ${(content.length / 1024).toFixed(0)} KB`);

  // 2. Detectar e corrigir dupla codificação UTF-8 (phpMyAdmin com charset errado)
  //    Sintoma: "ã" → "Ã£", "ç" → "Ã§", "é" → "Ã©"
  if (/Ã[\x80-\xBF]/.test(content)) {
    console.log('🔧 A corrigir codificação (UTF-8 lido como Latin-1)...');
    content = Buffer.from(content, 'latin1').toString('utf8');
  }

  // 3. Analisar dump
  console.log('🔍 A analisar SQL...');
  const data = parseDump(content);
  const found = Object.entries(data).map(([t, d]) => `${t}(${d.rows.length})`).join(', ');
  console.log(`   Tabelas: ${found}`);

  // 4. Importar dentro de uma transacção
  console.log('\n📥 A importar dados...');
  db.exec('BEGIN TRANSACTION');

  try {
    importArticles(data.articles);
    importArtefatos(data.artefatos);
    importExposicoes(data.exposicoes);
    importPatrimonios(data.patrimonios);
    importTestemunhos(data.testemunhos);
    importUsers(data.users);

    db.exec('COMMIT');

    // Resumo final
    console.log('\n' + '─'.repeat(50));
    console.log('✅ Migração concluída com sucesso!\n');

    const counts = [
      ['articles',   'Artigos'],
      ['artefatos',  'Artefatos'],
      ['exposicoes', 'Exposições'],
      ['patrimonios','Patrimónios'],
      ['testemunhos','Testemunhos'],
      ['users',      'Utilizadores'],
    ];
    for (const [t, label] of counts) {
      const row = db.prepare(`SELECT COUNT(*) as c FROM ${t}`).get();
      console.log(`   ${label.padEnd(14)}: ${row.c} registos`);
    }

    console.log('\n   Reinicie o backend (node backend/index.js) para ver os dados.\n');

  } catch (err) {
    db.exec('ROLLBACK');
    console.error('\n❌ Erro durante a migração:', err.message);
    if (process.env.DEBUG) console.error(err.stack);
    console.error('   Nenhum dado foi alterado (ROLLBACK efectuado).\n');
    process.exit(1);
  }
}

main();
