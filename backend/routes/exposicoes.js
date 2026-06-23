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
  const rows = db.prepare('SELECT * FROM exposicoes ORDER BY data_inicio DESC').all();
  res.json(rows.map(parse));
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM exposicoes WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Exposição não encontrada' });
  res.json(parse(row));
});

router.post('/', authMiddleware, (req, res) => {
  const { titulo, curador, responsavel, localizacao, data_inicio, data_fim, artefatos_expostos, descricao, foto1, foto2, galeria } = req.body;
  const result = db.prepare(`
    INSERT INTO exposicoes (titulo, curador, responsavel, localizacao, data_inicio, data_fim, artefatos_expostos, descricao, foto1, foto2, galeria)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(titulo, curador, responsavel, localizacao, data_inicio, data_fim, artefatos_expostos, descricao, foto1, foto2,
    typeof galeria === 'string' ? galeria : JSON.stringify(galeria || []));
  res.status(201).json(parse(db.prepare('SELECT * FROM exposicoes WHERE id = ?').get(result.lastInsertRowid)));
});

router.put('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM exposicoes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Exposição não encontrada' });
  const { titulo, curador, responsavel, localizacao, data_inicio, data_fim, artefatos_expostos, descricao, foto1, foto2, galeria } = req.body;
  db.prepare(`
    UPDATE exposicoes SET titulo=?, curador=?, responsavel=?, localizacao=?, data_inicio=?, data_fim=?,
    artefatos_expostos=?, descricao=?, foto1=?, foto2=?, galeria=?, updated_at=datetime('now') WHERE id=?
  `).run(titulo, curador, responsavel, localizacao, data_inicio, data_fim, artefatos_expostos, descricao, foto1, foto2,
    typeof galeria === 'string' ? galeria : JSON.stringify(galeria || []), req.params.id);
  res.json(parse(db.prepare('SELECT * FROM exposicoes WHERE id = ?').get(req.params.id)));
});

router.delete('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM exposicoes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Exposição não encontrada' });
  db.prepare('DELETE FROM exposicoes WHERE id = ?').run(req.params.id);
  res.json({ message: 'Eliminada' });
});

module.exports = router;
