const express = require('express');
const { getPool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/eventos
router.get('/', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM eventos ORDER BY data_inicio DESC');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /api/eventos/:id
router.get('/:id', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM eventos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Evento não encontrado' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// POST /api/eventos
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { nome, subtitulo, foto, local_evento, participantes, data_inicio, data_fim, galeria } = req.body;
        if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });

        const [result] = await pool.query(
            `INSERT INTO eventos (nome, subtitulo, foto, local_evento, participantes, data_inicio, data_fim, galeria)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nome, subtitulo || '', foto || '', local_evento || '', participantes || '', data_inicio || null, data_fim || null, galeria ? JSON.stringify(galeria) : null]
        );

        const [rows] = await pool.query('SELECT * FROM eventos WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// PUT /api/eventos/:id
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { nome, subtitulo, foto, local_evento, participantes, data_inicio, data_fim, galeria } = req.body;

        await pool.query(
            `UPDATE eventos SET nome = ?, subtitulo = ?, foto = ?, local_evento = ?, participantes = ?, data_inicio = ?, data_fim = ?, galeria = ?
       WHERE id = ?`,
            [nome, subtitulo, foto, local_evento, participantes, data_inicio, data_fim, galeria ? JSON.stringify(galeria) : null, req.params.id]
        );

        const [rows] = await pool.query('SELECT * FROM eventos WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/eventos/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM eventos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Evento removido com sucesso' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
