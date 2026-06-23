const express = require('express');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/logs/session — start a session
router.post('/session', (req, res) => {
  const { session_id, referrer, page_path, page_title } = req.body;
  if (!session_id) return res.status(400).json({ error: 'session_id obrigatório' });

  const device = detectDevice(req.headers['user-agent'] || '');
  const ip = req.ip || req.connection.remoteAddress;

  try {
    db.prepare(`
      INSERT OR IGNORE INTO sessions (session_id, referrer, page_path, page_title, device, ip)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(session_id, referrer, page_path, page_title, device, ip);
  } catch (_) {}

  res.json({ ok: true });
});

// POST /api/logs/page — track page view
router.post('/page', (req, res) => {
  const { session_id, page_path, page_title, prev_page_id, time_spent_seconds } = req.body;
  if (!session_id || !page_path) return res.status(400).json({ error: 'session_id e page_path obrigatórios' });

  const result = db.prepare(`
    INSERT INTO page_views (session_id, page_path, page_title, prev_page_id, time_spent_seconds)
    VALUES (?, ?, ?, ?, ?)
  `).run(session_id, page_path, page_title, prev_page_id || null, time_spent_seconds || 0);

  res.json({ id: result.lastInsertRowid });
});

// POST /api/logs/session/end
router.post('/session/end', (req, res) => {
  const { session_id, duration_seconds } = req.body;
  if (!session_id) return res.status(400).json({ error: 'session_id obrigatório' });

  db.prepare(`
    UPDATE sessions SET ended_at=datetime('now'), duration_seconds=? WHERE session_id=?
  `).run(duration_seconds || 0, session_id);

  res.json({ ok: true });
});

// GET /api/logs/summary
router.get('/summary', authMiddleware, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as c FROM sessions').get().c;
  const today = db.prepare("SELECT COUNT(*) as c FROM sessions WHERE date(started_at) = date('now')").get().c;
  const week = db.prepare("SELECT COUNT(*) as c FROM sessions WHERE started_at >= datetime('now', '-7 days')").get().c;
  const avgDuration = db.prepare('SELECT COALESCE(AVG(duration_seconds), 0) as a FROM sessions WHERE duration_seconds > 0').get().a;
  const pageViews = db.prepare('SELECT COUNT(*) as c FROM page_views').get().c;

  res.json({ total, today, week, avgDuration: Math.round(avgDuration), pageViews });
});

// GET /api/logs/sessions
router.get('/sessions', authMiddleware, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const { range, device, search } = req.query;

  let where = [];
  const params = [];

  if (range === '7d') { where.push("started_at >= datetime('now', '-7 days')"); }
  else if (range === '30d') { where.push("started_at >= datetime('now', '-30 days')"); }

  if (device) { where.push('device = ?'); params.push(device); }
  if (search) { where.push('(session_id LIKE ? OR page_path LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const total = db.prepare(`SELECT COUNT(*) as c FROM sessions ${whereClause}`).get(...params).c;
  const sessions = db.prepare(`SELECT * FROM sessions ${whereClause} ORDER BY started_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);

  res.json({ total, page, limit, sessions });
});

// GET /api/logs/session/:session_id/pages
router.get('/session/:session_id/pages', authMiddleware, (req, res) => {
  const pages = db.prepare('SELECT * FROM page_views WHERE session_id = ? ORDER BY viewed_at ASC').all(req.params.session_id);
  res.json(pages);
});

// GET /api/logs/export
router.get('/export', authMiddleware, (req, res) => {
  const range = req.query.range || '30d';
  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
  const sessions = db.prepare(
    `SELECT * FROM sessions WHERE started_at >= datetime('now', '-${days} days') ORDER BY started_at DESC`
  ).all();

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="sessions-${range}.csv"`);

  const header = 'session_id,device,ip,page_path,started_at,ended_at,duration_seconds\n';
  const rows = sessions.map(s =>
    `"${s.session_id}","${s.device || ''}","${s.ip || ''}","${s.page_path || ''}","${s.started_at}","${s.ended_at || ''}","${s.duration_seconds || 0}"`
  ).join('\n');

  res.send(header + rows);
});

function detectDevice(ua) {
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}

module.exports = router;
