const express = require('express');
const bcrypt = require('bcryptjs');
const { getPool } = require('../config/database');
const { generateToken, authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e password são obrigatórios' });
        }

        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                bio: user.bio,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT id, email, bio, category, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Utilizador não encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, async (req, res, next) => {
    try {
        const { email, bio, category, address, date_of_birth } = req.body;
        const pool = getPool();

        await pool.query(
            'UPDATE users SET email = ?, bio = ?, category = ?, address = ?, date_of_birth = ? WHERE id = ?',
            [email, bio, category, address, date_of_birth, req.user.id]
        );

        const [rows] = await pool.query(
            'SELECT id, email, bio, category, role FROM users WHERE id = ?',
            [req.user.id]
        );

        res.json({ message: 'Perfil atualizado com sucesso', user: rows[0] });
    } catch (err) {
        next(err);
    }
});

// PUT /api/auth/password
router.put('/password', authMiddleware, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Password atual e nova password são obrigatórias' });
        }

        const pool = getPool();
        const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
        
        const user = rows[0];
        const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Password atual incorreta' });
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);

        res.json({ message: 'Password atualizada com sucesso' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
