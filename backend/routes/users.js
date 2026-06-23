const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All user routes require auth
router.use(authMiddleware);

router.get('/', (req, res) => {
  const users = db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

router.post('/', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Nome, email e senha obrigatórios' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(400).json({ error: 'Email já registado' });

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
    .run(name, email, hash, role || 'editor');

  res.status(201).json(db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const { name, email, role, password } = req.body;
  const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Utilizador não encontrado' });

  if (password) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare("UPDATE users SET name=?, email=?, role=?, password_hash=?, updated_at=datetime('now') WHERE id=?")
      .run(name, email, role, hash, req.params.id);
  } else {
    db.prepare("UPDATE users SET name=?, email=?, role=?, updated_at=datetime('now') WHERE id=?")
      .run(name, email, role, req.params.id);
  }

  res.json(db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  if (parseInt(req.params.id) === req.user.id) {
    return res.status(400).json({ error: 'Não pode eliminar a própria conta' });
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.json({ message: 'Eliminado' });
});

module.exports = router;
