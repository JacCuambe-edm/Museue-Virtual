const express = require('express');
const { getPool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/testemunhos
router.get('/', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM testemunhos ORDER BY display_order ASC');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /api/testemunhos/:id
router.get('/:id', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM testemunhos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Testemunho não encontrado' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// POST /api/testemunhos
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { name, message, image, department, display_order } = req.body;
        if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });

        const [result] = await pool.query(
            'INSERT INTO testemunhos (name, message, image, department, display_order) VALUES (?, ?, ?, ?, ?)',
            [name, message || '', image || '', department || '', display_order || 0]
        );

        const [rows] = await pool.query('SELECT * FROM testemunhos WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// PUT /api/testemunhos/:id
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { name, message, image, department, display_order } = req.body;

        await pool.query(
            'UPDATE testemunhos SET name = ?, message = ?, image = ?, department = ?, display_order = ? WHERE id = ?',
            [name, message, image, department, display_order, req.params.id]
        );

        const [rows] = await pool.query('SELECT * FROM testemunhos WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/testemunhos/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM testemunhos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Testemunho removido com sucesso' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
