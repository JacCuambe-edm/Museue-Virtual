const express = require('express');
const { getPool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/artefatos
router.get('/', async (req, res, next) => {
    try {
        const pool = getPool();
        const { area_negocio, categoria } = req.query;

        let query = 'SELECT * FROM artefatos';
        const params = [];
        const where = [];

        if (area_negocio) {
            where.push('area_negocio = ?');
            params.push(area_negocio);
        }
        if (categoria) {
            where.push('categoria = ?');
            params.push(categoria);
        }

        if (where.length > 0) {
            query += ' WHERE ' + where.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /api/artefatos/:id
router.get('/:id', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM artefatos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Artefato não encontrado' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// POST /api/artefatos
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { titulo, categoria, area_negocio, data_aquisicao, origem, localizacao, estado, material, dimensoes, responsavel, descricao, foto, galeria } = req.body;

        const [result] = await pool.query(
            `INSERT INTO artefatos (titulo, categoria, area_negocio, data_aquisicao, origem, localizacao, estado, material, dimensoes, responsavel, descricao, foto, galeria)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [titulo, categoria, area_negocio, data_aquisicao, origem, localizacao, estado, material, dimensoes, responsavel, descricao, foto, galeria ? JSON.stringify(galeria) : null]
        );

        const [rows] = await pool.query('SELECT * FROM artefatos WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// PUT /api/artefatos/:id
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { titulo, categoria, area_negocio, data_aquisicao, origem, localizacao, estado, material, dimensoes, responsavel, descricao, foto, galeria } = req.body;

        await pool.query(
            `UPDATE artefatos SET 
                titulo = ?, categoria = ?, area_negocio = ?, data_aquisicao = ?, 
                origem = ?, localizacao = ?, estado = ?, material = ?, 
                dimensoes = ?, responsavel = ?, descricao = ?, foto = ?, galeria = ?
             WHERE id = ?`,
            [titulo, categoria, area_negocio, data_aquisicao, origem, localizacao, estado, material, dimensoes, responsavel, descricao, foto, galeria ? JSON.stringify(galeria) : null, req.params.id]
        );

        const [rows] = await pool.query('SELECT * FROM artefatos WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/artefatos/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM artefatos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Artefato removido com sucesso' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
