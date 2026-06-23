const express = require('express');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Admin routes MUST come before /:type/:id to avoid wildcard shadowing

// Admin: pending comments
router.get('/admin/pending', authMiddleware, (req, res) => {
  res.json(db.prepare("SELECT * FROM comments WHERE status='pending' ORDER BY created_at DESC").all());
});

// Admin: all comments
router.get('/admin/all', authMiddleware, (req, res) => {
  res.json(db.prepare('SELECT * FROM comments ORDER BY created_at DESC').all());
});

// Admin: update status
router.put('/admin/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }
  db.prepare('UPDATE comments SET status=? WHERE id=?').run(status, req.params.id);
  res.json(db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id));
});

// Admin: delete
router.delete('/admin/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  res.json({ message: 'Eliminado' });
});

// Public: get approved comments for an entity
router.get('/:type/:id', (req, res) => {
  const rows = db.prepare(
    "SELECT * FROM comments WHERE entity_type=? AND entity_id=? AND status='approved' ORDER BY created_at DESC"
  ).all(req.params.type, req.params.id);
  res.json(rows);
});

// Public: post a comment (goes to pending)
router.post('/:type/:id', (req, res) => {
  const { author_name, author_email, content } = req.body;
  if (!author_name || !content) return res.status(400).json({ error: 'Nome e conteúdo obrigatórios' });
  const result = db.prepare(
    "INSERT INTO comments (entity_type, entity_id, author_name, author_email, content, status) VALUES (?, ?, ?, ?, ?, 'pending')"
  ).run(req.params.type, req.params.id, author_name, author_email, content);
  res.status(201).json(db.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid));
});

module.exports = router;
