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
  const rows = db.prepare('SELECT * FROM eventos ORDER BY data_inicio DESC').all();
  res.json(rows.map(parse));
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM eventos WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Evento não encontrado' });
  res.json(parse(row));
});

router.post('/', authMiddleware, (req, res) => {
  const { nome, subtitulo, tipo, data_inicio, data_fim, participantes, local_evento, descricao, foto, galeria } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome do evento obrigatório' });
  const result = db.prepare(`
    INSERT INTO eventos (nome, subtitulo, tipo, data_inicio, data_fim, participantes, local_evento, descricao, foto, galeria)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(nome, subtitulo, tipo, data_inicio, data_fim, participantes, local_evento, descricao, foto,
    typeof galeria === 'string' ? galeria : JSON.stringify(galeria || []));
  res.status(201).json(parse(db.prepare('SELECT * FROM eventos WHERE id = ?').get(result.lastInsertRowid)));
});

router.put('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM eventos WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Evento não encontrado' });
  const { nome, subtitulo, tipo, data_inicio, data_fim, participantes, local_evento, descricao, foto, galeria } = req.body;
  db.prepare(`
    UPDATE eventos SET nome=?, subtitulo=?, tipo=?, data_inicio=?, data_fim=?, participantes=?,
    local_evento=?, descricao=?, foto=?, galeria=?, updated_at=datetime('now') WHERE id=?
  `).run(nome, subtitulo, tipo, data_inicio, data_fim, participantes, local_evento, descricao, foto,
    typeof galeria === 'string' ? galeria : JSON.stringify(galeria || []), req.params.id);
  res.json(parse(db.prepare('SELECT * FROM eventos WHERE id = ?').get(req.params.id)));
});

router.delete('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM eventos WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Evento não encontrado' });
  db.prepare('DELETE FROM eventos WHERE id = ?').run(req.params.id);
  res.json({ message: 'Eliminado' });
});

module.exports = router;
