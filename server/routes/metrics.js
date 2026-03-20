const express = require('express');
const { getPool } = require('../config/database');
const router = express.Router();

// Helper para traduzir o tipo de entidade para a tabela real
const allowedEntities = {
    'article': 'articles',
    'heritage': 'patrimonios',
    'exhibition': 'exposicoes',
    'event': 'eventos',
    'artifact': 'artefatos'
};

// POST /api/metrics/:type/:id/view - Regista visualização
router.post('/:type/:id/view', async (req, res, next) => {
    try {
        const { type, id } = req.params;
        const sessionId = req.body.session_id || req.ip;
        
        const table = allowedEntities[type];
        if (!table) return res.status(400).json({ error: 'Tipo inválido' });

        const pool = getPool();
        
        // Log the view temporally
        await pool.query(
            'INSERT INTO page_metrics_logs (entity_type, entity_id, action, session_id) VALUES (?, ?, ?, ?)',
            [type, id, 'view', sessionId]
        );
        
        // Atualiza a coluna de cache
        await pool.query(`UPDATE ${table} SET views = views + 1 WHERE id = ?`, [id]);
        
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

// POST /api/metrics/:type/:id/like - Regista gosto
router.post('/:type/:id/like', async (req, res, next) => {
    try {
        const { type, id } = req.params;
        const sessionId = req.body.session_id || req.ip;
        
        const table = allowedEntities[type];
        if (!table) return res.status(400).json({ error: 'Tipo inválido' });

        const pool = getPool();
        
        // Anti-spam: Verifica se esta sessão já deu like nas últimas 24 horas
        const [existing] = await pool.query(
            'SELECT id FROM page_metrics_logs WHERE entity_type = ? AND entity_id = ? AND action = ? AND session_id = ? AND created_at >= NOW() - INTERVAL 1 DAY',
            [type, id, 'like', sessionId]
        );
        
        if (existing.length > 0) {
            return res.status(429).json({ error: 'Já expressou gosto recentemente nesta página.' });
        }

        // Log the like
        await pool.query(
            'INSERT INTO page_metrics_logs (entity_type, entity_id, action, session_id) VALUES (?, ?, ?, ?)',
            [type, id, 'like', sessionId]
        );
        
        // Update cache column
        await pool.query(`UPDATE ${table} SET likes_count = likes_count + 1 WHERE id = ?`, [id]);
        
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

// GET /api/metrics/:type/:id - Retorna totais
router.get('/:type/:id', async (req, res, next) => {
    try {
        const { type, id } = req.params;
        const table = allowedEntities[type];
        if (!table) return res.status(400).json({ error: 'Tipo inválido' });

        const pool = getPool();
        const [rows] = await pool.query(`SELECT views, likes_count FROM ${table} WHERE id = ?`, [id]);
        
        if (rows.length === 0) return res.status(404).json({ error: 'Não encontrado' });
        
        res.json({
            views: rows[0].views || 0,
            likes: rows[0].likes_count || 0
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
