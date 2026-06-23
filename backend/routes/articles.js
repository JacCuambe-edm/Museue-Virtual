const express = require('express');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/articles
router.get('/', (req, res) => {
  const { category, limit } = req.query;
  let query = 'SELECT * FROM articles';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC';

  if (limit) {
    query += ' LIMIT ?';
    params.push(parseInt(limit));
  }

  const articles = db.prepare(query).all(...params);
  res.json(articles);
});

// GET /api/articles/:id
router.get('/:id', (req, res) => {
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!article) return res.status(404).json({ error: 'Artigo não encontrado' });
  res.json(article);
});

// POST /api/articles
router.post('/', authMiddleware, (req, res) => {
  const { title, subtitle, category, author, body_text, image3 } = req.body;
  if (!title) return res.status(400).json({ error: 'Título obrigatório' });

  const result = db.prepare(`
    INSERT INTO articles (title, subtitle, category, author, body_text, image3)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, subtitle, category, author, body_text, image3);

  const created = db.prepare('SELECT * FROM articles WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/articles/:id
router.put('/:id', authMiddleware, (req, res) => {
  const { title, subtitle, category, author, body_text, image3 } = req.body;
  const existing = db.prepare('SELECT id FROM articles WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Artigo não encontrado' });

  db.prepare(`
    UPDATE articles SET title=?, subtitle=?, category=?, author=?, body_text=?, image3=?, updated_at=datetime('now')
    WHERE id=?
  `).run(title, subtitle, category, author, body_text, image3, req.params.id);

  const updated = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// DELETE /api/articles/:id
router.delete('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM articles WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Artigo não encontrado' });
  db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  res.json({ message: 'Artigo eliminado' });
});

module.exports = router;
