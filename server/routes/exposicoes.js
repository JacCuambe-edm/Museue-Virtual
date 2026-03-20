const express = require('express');
const { getPool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/exposicoes
router.get('/', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM exposicoes ORDER BY data_inicio DESC');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /api/exposicoes/:id
router.get('/:id', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM exposicoes WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Exposição não encontrada' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// POST /api/exposicoes
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { curador, descricao, artefatos_expostos, foto1, foto2, data_inicio, data_fim, titulo, localizacao, responsavel, galeria } = req.body;

        const [result] = await pool.query(
            `INSERT INTO exposicoes (curador, descricao, artefatos_expostos, foto1, foto2, data_inicio, data_fim, titulo, localizacao, responsavel, galeria)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [curador || '', descricao || '', artefatos_expostos || '', foto1 || '', foto2 || '', data_inicio || null, data_fim || null, titulo || '', localizacao || '', responsavel || '', galeria ? JSON.stringify(galeria) : null]
        );

        const [rows] = await pool.query('SELECT * FROM exposicoes WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// PUT /api/exposicoes/:id
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { curador, descricao, artefatos_expostos, foto1, foto2, data_inicio, data_fim, titulo, localizacao, responsavel, galeria } = req.body;

        await pool.query(
            `UPDATE exposicoes SET curador = ?, descricao = ?, artefatos_expostos = ?, foto1 = ?, foto2 = ?, data_inicio = ?, data_fim = ?, titulo = ?, localizacao = ?, responsavel = ?, galeria = ?
       WHERE id = ?`,
            [curador, descricao, artefatos_expostos, foto1, foto2, data_inicio, data_fim, titulo, localizacao, responsavel, galeria ? JSON.stringify(galeria) : null, req.params.id]
        );

        const [rows] = await pool.query('SELECT * FROM exposicoes WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/exposicoes/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM exposicoes WHERE id = ?', [req.params.id]);
        res.json({ message: 'Exposição removida com sucesso' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
