const express = require('express');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', (req, res) => {
  const counts = {
    historias: db.prepare('SELECT COUNT(*) as c FROM articles').get().c,
    artefatos: db.prepare('SELECT COUNT(*) as c FROM artefatos').get().c,
    exposicoes: db.prepare('SELECT COUNT(*) as c FROM exposicoes').get().c,
    patrimonios: db.prepare('SELECT COUNT(*) as c FROM patrimonios').get().c,
    eventos: db.prepare('SELECT COUNT(*) as c FROM eventos').get().c,
    pending_comments: db.prepare("SELECT COUNT(*) as c FROM comments WHERE status='pending'").get().c,
    visitantes: db.prepare('SELECT COUNT(*) as c FROM sessions WHERE date(started_at) = date(\'now\')').get().c,
    visualizacoes: db.prepare('SELECT COALESCE(SUM(views), 0) as c FROM metrics').get().c,
  };

  const recentActivity = db.prepare(`
    SELECT 'article' as type, title as label, created_at FROM articles
    UNION ALL
    SELECT 'artefato', nome, created_at FROM artefatos
    UNION ALL
    SELECT 'exposicao', titulo, created_at FROM exposicoes
    UNION ALL
    SELECT 'evento', nome, created_at FROM eventos
    ORDER BY created_at DESC LIMIT 10
  `).all();

  res.json({ counts, recentActivity });
});

router.get('/chart-data', (req, res) => {
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const d = date.toISOString().split('T')[0];
    const sessions = db.prepare("SELECT COUNT(*) as c FROM sessions WHERE date(started_at) = ?").get(d);
    last7.push({ date: d, visitantes: sessions.c });
  }
  res.json(last7);
});

router.get('/analytics-details', (req, res) => {
  const range = req.query.range || '7d';
  const days = range === '30d' ? 30 : range === '90d' ? 90 : 7;

  const totalSessions = db.prepare(
    `SELECT COUNT(*) as c FROM sessions WHERE started_at >= datetime('now', '-${days} days')`
  ).get().c;

  const totalViews = db.prepare(
    `SELECT COALESCE(SUM(views), 0) as c FROM metrics`
  ).get().c;

  const topPages = db.prepare(`
    SELECT page_path, COUNT(*) as views
    FROM page_views
    WHERE viewed_at >= datetime('now', '-${days} days')
    GROUP BY page_path
    ORDER BY views DESC
    LIMIT 10
  `).all();

  res.json({ totalSessions, totalViews, topPages });
});

module.exports = router;
