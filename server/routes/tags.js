const express = require('express');
const { getPool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/tags
router.get('/', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM tags ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// POST /api/tags
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { name, creator_email } = req.body;
        if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

        const [result] = await pool.query(
            'INSERT INTO tags (name, creator_email) VALUES (?, ?)',
            [name, creator_email || req.user.email]
        );

        const [rows] = await pool.query('SELECT * FROM tags WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/tags/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM tags WHERE id = ?', [req.params.id]);
        res.json({ message: 'Tag removida' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
