const express = require('express');
const { getPool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/testimonials
router.get('/', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// POST /api/testimonials
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { nome, descricao, foto } = req.body;
        if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });

        const [result] = await pool.query(
            'INSERT INTO testimonials (nome, descricao, foto) VALUES (?, ?, ?)',
            [nome, descricao || '', foto || '']
        );

        const [rows] = await pool.query('SELECT * FROM testimonials WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/testimonials/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
        res.json({ message: 'Testimonial removido' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
