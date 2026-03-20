const express = require('express');
const { getPool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/patrimonios
router.get('/', async (req, res, next) => {
    try {
        const pool = getPool();
        const { area_negocio, tipo, regiao } = req.query;

        let query = 'SELECT * FROM patrimonios';
        const params = [];
        const where = [];

        if (area_negocio) {
            where.push('area_negocio = ?');
            params.push(area_negocio);
        }
        if (tipo) {
            where.push('tipo = ?');
            params.push(tipo);
        }
        if (regiao) {
            where.push('nota LIKE ?');
            params.push(`%${regiao}%`);
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

// GET /api/patrimonios/:id
router.get('/:id', async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM patrimonios WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Património não encontrado' });
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// POST /api/patrimonios
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { 
            nome, sigla, area_negocio, tipo, localizacao, ano_entrada_servico,
            potencia_instalada_inicial, potencia_instalada_actual, niveis_tensao,
            transformadores_potencia, barramento_inicial, barramento_final,
            capacidade_linha, condutor, circuito, comprimento, tipo_postes,
            tipo_condutor, tipo_isoladores, cabo_guarda, nota, descricao, foto, galeria
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO patrimonios (nome, sigla, area_negocio, tipo, localizacao, ano_entrada_servico,
             potencia_instalada_inicial, potencia_instalada_actual, niveis_tensao,
             transformadores_potencia, barramento_inicial, barramento_final,
             capacidade_linha, condutor, circuito, comprimento, tipo_postes,
             tipo_condutor, tipo_isoladores, cabo_guarda, nota, descricao, foto, galeria)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nome || '', sigla || '', area_negocio || '', tipo || 'Substacao',
                localizacao || '', ano_entrada_servico || '',
                potencia_instalada_inicial || '', potencia_instalada_actual || '',
                niveis_tensao || '', transformadores_potencia || '',
                barramento_inicial || '', barramento_final || '',
                capacidade_linha || '', condutor || '', circuito || '',
                comprimento || '', tipo_postes || '', tipo_condutor || '',
                tipo_isoladores || '', cabo_guarda || '', nota || '',
                descricao || '', foto || '',
                galeria ? JSON.stringify(galeria) : null
            ]
        );

        const [rows] = await pool.query('SELECT * FROM patrimonios WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// PUT /api/patrimonios/:id
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { 
            nome, sigla, area_negocio, tipo, localizacao, ano_entrada_servico,
            potencia_instalada_inicial, potencia_instalada_actual, niveis_tensao,
            transformadores_potencia, barramento_inicial, barramento_final,
            capacidade_linha, condutor, circuito, comprimento, tipo_postes,
            tipo_condutor, tipo_isoladores, cabo_guarda, nota, descricao, foto, galeria
        } = req.body;

        await pool.query(
            `UPDATE patrimonios SET 
                nome = ?, sigla = ?, area_negocio = ?, tipo = ?, localizacao = ?,
                ano_entrada_servico = ?, potencia_instalada_inicial = ?,
                potencia_instalada_actual = ?, niveis_tensao = ?,
                transformadores_potencia = ?, barramento_inicial = ?,
                barramento_final = ?, capacidade_linha = ?, condutor = ?,
                circuito = ?, comprimento = ?, tipo_postes = ?,
                tipo_condutor = ?, tipo_isoladores = ?, cabo_guarda = ?,
                nota = ?, descricao = ?, foto = ?, galeria = ?
             WHERE id = ?`,
            [
                nome, sigla, area_negocio, tipo, localizacao,
                ano_entrada_servico, potencia_instalada_inicial,
                potencia_instalada_actual, niveis_tensao,
                transformadores_potencia, barramento_inicial,
                barramento_final, capacidade_linha, condutor,
                circuito, comprimento, tipo_postes,
                tipo_condutor, tipo_isoladores, cabo_guarda,
                nota, descricao, foto,
                galeria ? JSON.stringify(galeria) : null,
                req.params.id
            ]
        );

        const [rows] = await pool.query('SELECT * FROM patrimonios WHERE id = ?', [req.params.id]);
        res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// DELETE /api/patrimonios/:id
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM patrimonios WHERE id = ?', [req.params.id]);
        res.json({ message: 'Património removido com sucesso' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
