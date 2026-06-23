const express = require('express');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM testemunhos ORDER BY display_order ASC, created_at DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM testemunhos WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Testemunho não encontrado' });
  res.json(row);
});

router.post('/', authMiddleware, (req, res) => {
  const { name, department, message, image, display_order } = req.body;
  if (!name || !message) return res.status(400).json({ error: 'Nome e mensagem obrigatórios' });
  const result = db.prepare(`
    INSERT INTO testemunhos (name, department, message, image, display_order) VALUES (?, ?, ?, ?, ?)
  `).run(name, department, message, image, display_order || 0);
  res.status(201).json(db.prepare('SELECT * FROM testemunhos WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, department, message, image, display_order } = req.body;
  const existing = db.prepare('SELECT id FROM testemunhos WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Testemunho não encontrado' });
  db.prepare(`
    UPDATE testemunhos SET name=?, department=?, message=?, image=?, display_order=?, updated_at=datetime('now') WHERE id=?
  `).run(name, department, message, image, display_order || 0, req.params.id);
  res.json(db.prepare('SELECT * FROM testemunhos WHERE id = ?').get(req.params.id));
});

router.delete('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM testemunhos WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Testemunho não encontrado' });
  db.prepare('DELETE FROM testemunhos WHERE id = ?').run(req.params.id);
  res.json({ message: 'Eliminado com sucesso' });
});

module.exports = router;
