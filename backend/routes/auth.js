const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password_hash, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });
  res.json(user);
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nome e email obrigatórios' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.user.id);
  if (existing) return res.status(400).json({ error: 'Email já em uso' });

  db.prepare('UPDATE users SET name = ?, email = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .run(name, email, req.user.id);

  const updated = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
  const token = jwt.sign(
    { id: updated.id, email: updated.email, role: updated.role, name: updated.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ user: updated, token });
});

// PUT /api/auth/password
router.put('/password', authMiddleware, (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) return res.status(400).json({ error: 'Senha atual e nova são obrigatórias' });

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const valid = bcrypt.compareSync(current_password, user.password_hash);
  if (!valid) return res.status(400).json({ error: 'Senha atual incorreta' });

  const hash = bcrypt.hashSync(new_password, 10);
  db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?').run(hash, req.user.id);
  res.json({ message: 'Senha actualizada com sucesso' });
});

// POST /api/auth/forgot-password  (simple reset — in production would send email)
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email obrigatório' });

  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  // Always return success to avoid email enumeration
  res.json({ message: 'Se o email existir no sistema, receberá instruções em breve.' });
});

module.exports = router;
