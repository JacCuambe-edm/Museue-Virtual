const express = require('express');
const { getPool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', async (req, res, next) => {
  try {
    const pool = getPool();
    
    // Get simple entity counts
    const [[{ total_historias }]] = await pool.query('SELECT COUNT(*) as total_historias FROM articles');
    const [[{ total_artefatos }]] = await pool.query('SELECT COUNT(*) as total_artefatos FROM artefatos');
    const [[{ total_exposicoes }]] = await pool.query('SELECT COUNT(*) as total_exposicoes FROM exposicoes');
    const [[{ total_patrimonios }]] = await pool.query('SELECT COUNT(*) as total_patrimonios FROM patrimonios');
    
    // Get metrics dynamically
    const [[{ total_page_views }]] = await pool.query("SELECT COUNT(*) as total_page_views FROM page_metrics_logs WHERE action = 'view'");
    const [[{ total_likes }]] = await pool.query("SELECT COUNT(*) as total_likes FROM page_metrics_logs WHERE action = 'like'");
    const [[{ pending_comments }]] = await pool.query("SELECT COUNT(*) as pending_comments FROM comments WHERE status = 'pending'");

    // Get recent activity
    const [recent] = await pool.query(`
      SELECT id, 'História' as type, title as title, created_at, 'published' as status FROM articles
      UNION ALL
      SELECT id, 'Artefato' as type, titulo as title, created_at, 'updated' as status FROM artefatos
      UNION ALL
      SELECT id, 'Exposição' as type, curador as title, created_at, 'published' as status FROM exposicoes
      UNION ALL
      SELECT id, 'Comentário' as type, author_name as title, created_at, 'new' as status FROM comments WHERE status = 'pending'
      ORDER BY created_at DESC
      LIMIT 30
    `);

    res.json({
      counts: {
        historias: total_historias,
        artefatos: total_artefatos,
        exposicoes: total_exposicoes,
        patrimonios: total_patrimonios,
        visualizacoes: total_page_views || 0,
        likes: total_likes || 0,
        pending_comments: pending_comments || 0
      },
      recentActivity: recent
    });

  } catch (err) {
    next(err);
  }
});

router.get('/chart-data', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        // Return metrics from the last 30 days grouped by date
        const [rows] = await pool.query(`
            SELECT 
                DATE_FORMAT(DATE(created_at), '%d/%m') as date,
                SUM(CASE WHEN action='view' THEN 1 ELSE 0 END) as views,
                SUM(CASE WHEN action='like' THEN 1 ELSE 0 END) as likes
            FROM page_metrics_logs
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) ASC
        `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

router.get('/analytics-details', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const { range = '30d' } = req.query;
        
        let interval = '30 DAY';
        if (range === '7d') interval = '7 DAY';
        else if (range === '1y') interval = '1 YEAR';
        else if (range === 'all') interval = '100 YEAR';

        // 1. Time Series Data (Views/Likes over time)
        const [timeSeries] = await pool.query(`
            SELECT 
                DATE_FORMAT(DATE(created_at), '%d/%m/%Y') as date,
                SUM(CASE WHEN action='view' THEN 1 ELSE 0 END) as views,
                SUM(CASE WHEN action='like' THEN 1 ELSE 0 END) as likes
            FROM page_metrics_logs
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ${interval})
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) ASC
        `);

        // 2. Module Distribution (Views by entity_type)
        const [moduleDistDb] = await pool.query(`
            SELECT entity_type as name, COUNT(*) as value
            FROM page_metrics_logs
            WHERE action = 'view' AND created_at >= DATE_SUB(CURDATE(), INTERVAL ${interval})
            GROUP BY entity_type
            ORDER BY value DESC
        `);
        
        // Map English keys to Portuguese labels
        const typeLabels = {
            'article': 'Histórias',
            'heritage': 'Património',
            'exhibition': 'Exposições',
            'event': 'Eventos',
            'artifact': 'Artefatos'
        };
        const moduleDistribution = moduleDistDb.map(row => ({
            name: typeLabels[row.name] || row.name,
            value: row.value
        }));

        // 3. Top Performing Items (Top 5 overall)
        const [articles] = await pool.query('SELECT id, title as titulo, views, likes_count as likes, "História" as type FROM articles ORDER BY views DESC LIMIT 5');
        const [artefatos] = await pool.query('SELECT id, titulo, views, likes_count as likes, "Artefato" as type FROM artefatos ORDER BY views DESC LIMIT 5');
        const [exposicoes] = await pool.query('SELECT id, titulo, views, likes_count as likes, "Exposição" as type FROM exposicoes ORDER BY views DESC LIMIT 5');
        const [patrimonios] = await pool.query('SELECT id, nome as titulo, views, likes_count as likes, "Património" as type FROM patrimonios ORDER BY views DESC LIMIT 5');
        const [eventos] = await pool.query('SELECT id, nome as titulo, views, likes_count as likes, "Evento" as type FROM eventos ORDER BY views DESC LIMIT 5');

        let allItems = [...articles, ...artefatos, ...exposicoes, ...patrimonios, ...eventos];
        allItems.sort((a, b) => (b.views || 0) - (a.views || 0));
        const topPerforming = allItems.slice(0, 5);

        // 4. Totals for the period
        const [[{ total_views }]] = await pool.query(`SELECT COUNT(*) as total_views FROM page_metrics_logs WHERE action='view' AND created_at >= DATE_SUB(CURDATE(), INTERVAL ${interval})`);
        const [[{ total_likes }]] = await pool.query(`SELECT COUNT(*) as total_likes FROM page_metrics_logs WHERE action='like' AND created_at >= DATE_SUB(CURDATE(), INTERVAL ${interval})`);
        const [[{ total_comments }]] = await pool.query(`SELECT COUNT(*) as total_comments FROM comments WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ${interval})`);

        res.json({
            timeSeries,
            moduleDistribution,
            topPerforming,
            totals: {
                views: total_views || 0,
                likes: total_likes || 0,
                comments: total_comments || 0
            }
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router;
