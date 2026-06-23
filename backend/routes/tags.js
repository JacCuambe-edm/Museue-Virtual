const express = require('express');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM tags ORDER BY name ASC').all());
});

router.post('/', authMiddleware, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome obrigatório' });
  try {
    const result = db.prepare('INSERT INTO tags (name) VALUES (?)').run(name);
    res.status(201).json(db.prepare('SELECT * FROM tags WHERE id = ?').get(result.lastInsertRowid));
  } catch (err) {
    res.status(400).json({ error: 'Tag já existe' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM tags WHERE id = ?').run(req.params.id);
  res.json({ message: 'Eliminada' });
});

module.exports = router;
