const express = require('express');
const { getPool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// --- ADMIN ROUTES (Auth Required) ---

// GET /api/comments/admin/pending
router.get('/admin/pending', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM comments WHERE status = ? ORDER BY created_at DESC',
            ['pending']
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /api/comments/admin/all
router.get('/admin/all', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM comments ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// PUT /api/comments/admin/:id/status
router.put('/admin/:id/status', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Status inválido' });
        }

        await pool.query('UPDATE comments SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true, message: `Comentário atualizado para ${status}` });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/comments/admin/:id
router.delete('/admin/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
        res.json({ message: 'Comentário removido' });
    } catch (err) {
        next(err);
    }
});

// --- PUBLIC ROUTES (No Auth) ---

// GET /api/comments/:type/:id
router.get('/:type/:id', async (req, res, next) => {
    try {
        const pool = getPool();
        const { type, id } = req.params;

        const [rows] = await pool.query(
            'SELECT id, author_name, content, created_at FROM comments WHERE entity_type = ? AND entity_id = ? AND status = ? ORDER BY created_at DESC',
            [type, id, 'approved']
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// POST /api/comments/:type/:id
router.post('/:type/:id', async (req, res, next) => {
    try {
        const pool = getPool();
        const { type, id } = req.params;
        const { author_name, content } = req.body;
        
        if (!author_name || !content) {
            return res.status(400).json({ error: 'Nome e texto do comentário são obrigatórios' });
        }

        const [result] = await pool.query(
            "INSERT INTO comments (entity_type, entity_id, author_name, content, status) VALUES (?, ?, ?, ?, 'pending')",
            [type, id, author_name, content]
        );

        res.status(201).json({ id: result.insertId, message: 'Comentário submetido e aguarda aprovação.' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
