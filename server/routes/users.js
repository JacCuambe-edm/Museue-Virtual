const express = require('express');
const bcrypt = require('bcryptjs');
const { getPool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Middleware para verificar se é master admin
const requireMasterAdmin = (req, res, next) => {
    if (req.user.email !== 'admin@museu.cd') {
        return res.status(403).json({ error: 'Acesso negado. Apenas o administrador master pode realizar esta ação.' });
    }
    next();
};

// GET /api/users
router.get('/', authMiddleware, requireMasterAdmin, async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT id, email, bio, category, address, role, created_at FROM users ORDER BY id ASC'
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /api/users/:id
router.get('/:id', authMiddleware, requireMasterAdmin, async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT id, email, bio, category, address, role, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Utilizador não encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// POST /api/users
router.post('/', authMiddleware, requireMasterAdmin, async (req, res, next) => {
    try {
        const { email, password, bio, category, role } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e password são obrigatórios' });
        }

        const pool = getPool();
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Este email já está registado' });
        }

        const newHash = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (email, password_hash, bio, category, role) VALUES (?, ?, ?, ?, ?)',
            [email, newHash, bio || null, category || null, role || 'viewer']
        );

        res.status(201).json({ id: result.insertId, email, role, message: 'Utilizador criado com sucesso' });
    } catch (err) {
        next(err);
    }
});

// PUT /api/users/:id
router.put('/:id', authMiddleware, requireMasterAdmin, async (req, res, next) => {
    try {
        const { email, password, bio, category, role } = req.body;
        const pool = getPool();
        
        // Prevent changing admin@museu.cd email or role from master
        if (parseInt(req.params.id) === 1) {
            // Master admin update
            // Can update password, bio, category, but NOT email or role to non-admin
            let updateQuery = 'UPDATE users SET bio = ?, category = ?';
            const params = [bio || null, category || null];
            
            if (password) {
                const newHash = await bcrypt.hash(password, 10);
                updateQuery += ', password_hash = ?';
                params.push(newHash);
            }
            
            updateQuery += ' WHERE id = 1';
            await pool.query(updateQuery, params);
            return res.json({ message: 'Master Admin atualizado com sucesso' });
        }

        // For other users
        let updateQuery = 'UPDATE users SET email = ?, bio = ?, category = ?, role = ?';
        const params = [email, bio || null, category || null, role || 'viewer'];

        if (password) {
            const newHash = await bcrypt.hash(password, 10);
            updateQuery += ', password_hash = ?';
            params.push(newHash);
        }

        updateQuery += ' WHERE id = ?';
        params.push(req.params.id);

        await pool.query(updateQuery, params);
        res.json({ message: 'Utilizador atualizado com sucesso' });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/users/:id
router.delete('/:id', authMiddleware, requireMasterAdmin, async (req, res, next) => {
    try {
        if (parseInt(req.params.id) === 1) {
            return res.status(403).json({ error: 'O administrador master não pode ser apagado.' });
        }
        
        const pool = getPool();
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'Utilizador apagado com sucesso' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
