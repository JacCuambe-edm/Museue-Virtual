const express = require('express');
const { getPool } = require('../config/database');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/articles
router.get('/', async (req, res, next) => {
    try {
        const pool = getPool();
        const { category, limit, offset } = req.query;

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

        if (offset) {
            query += ' OFFSET ?';
            params.push(parseInt(offset));
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /api/articles/:id
router.get('/:id', async (req, res, next) => {
    try {
        const pool = getPool();

        // Increment views
        await pool.query('UPDATE articles SET views = views + 1 WHERE id = ?', [req.params.id]);

        const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Artigo não encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// POST /api/articles
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { title, short_description, body_text, body_text2, body_text3, category, image3 } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Título é obrigatório' });
        }

        const [result] = await pool.query(
            `INSERT INTO articles (title, short_description, body_text, body_text2, body_text3, category, image3, author_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, short_description || '', body_text || '', body_text2 || '', body_text3 || '', category || '', image3 || '', req.user.email]
        );

        const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// PUT /api/articles/:id
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { title, short_description, body_text, body_text2, body_text3, category, image3 } = req.body;

        await pool.query(
            `UPDATE articles SET title = ?, short_description = ?, body_text = ?, body_text2 = ?, body_text3 = ?, category = ?, image3 = ?
       WHERE id = ?`,
            [title, short_description, body_text, body_text2, body_text3, category, image3, req.params.id]
        );

        const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/articles/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
        res.json({ message: 'Artigo removido com sucesso' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
