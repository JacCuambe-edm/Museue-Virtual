const express = require('express');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const parse = (row) => {
  if (row && row.galeria && typeof row.galeria === 'string') {
    try { row.galeria = JSON.parse(row.galeria); } catch { row.galeria = []; }
  }
  return row;
};

router.get('/', (req, res) => {
  const { area_negocio, categoria } = req.query;
  let query = 'SELECT * FROM artefatos';
  const params = [];
  const conditions = [];

  if (area_negocio) { conditions.push('area_negocio = ?'); params.push(area_negocio); }
  if (categoria) { conditions.push('categoria = ?'); params.push(categoria); }
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY nome ASC';

  res.json(db.prepare(query).all(...params).map(parse));
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM artefatos WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Artefacto não encontrado' });
  res.json(parse(row));
});

router.post('/', authMiddleware, (req, res) => {
  const { nome, categoria, area_negocio, data_aquisicao, origem, localizacao, estado_conservacao, material, dimensoes, responsavel, descricao, foto, galeria } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome obrigatório' });
  const result = db.prepare(`
    INSERT INTO artefatos (nome, categoria, area_negocio, data_aquisicao, origem, localizacao, estado_conservacao, material, dimensoes, responsavel, descricao, foto, galeria)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(nome, categoria, area_negocio, data_aquisicao, origem, localizacao, estado_conservacao, material, dimensoes, responsavel, descricao, foto,
    typeof galeria === 'string' ? galeria : JSON.stringify(galeria || []));
  res.status(201).json(parse(db.prepare('SELECT * FROM artefatos WHERE id = ?').get(result.lastInsertRowid)));
});

router.put('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM artefatos WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Artefacto não encontrado' });
  const { nome, categoria, area_negocio, data_aquisicao, origem, localizacao, estado_conservacao, material, dimensoes, responsavel, descricao, foto, galeria } = req.body;
  db.prepare(`
    UPDATE artefatos SET nome=?, categoria=?, area_negocio=?, data_aquisicao=?, origem=?, localizacao=?,
    estado_conservacao=?, material=?, dimensoes=?, responsavel=?, descricao=?, foto=?, galeria=?, updated_at=datetime('now')
    WHERE id=?
  `).run(nome, categoria, area_negocio, data_aquisicao, origem, localizacao, estado_conservacao, material, dimensoes, responsavel, descricao, foto,
    typeof galeria === 'string' ? galeria : JSON.stringify(galeria || []), req.params.id);
  res.json(parse(db.prepare('SELECT * FROM artefatos WHERE id = ?').get(req.params.id)));
});

router.delete('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM artefatos WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Artefacto não encontrado' });
  db.prepare('DELETE FROM artefatos WHERE id = ?').run(req.params.id);
  res.json({ message: 'Eliminado' });
});

module.exports = router;
