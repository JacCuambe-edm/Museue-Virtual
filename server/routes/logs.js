const express = require('express');
const { getPool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// ─── helpers ────────────────────────────────────────────────────────────────

function parseUserAgent(ua = '') {
    let browser = 'Desconhecido', browserVersion = '', os = 'Desconhecido', deviceType = 'unknown';

    // Browser
    if (/Edg\/([0-9.]+)/.test(ua))        { browser = 'Edge';    browserVersion = RegExp.$1; }
    else if (/OPR\/([0-9.]+)/.test(ua))   { browser = 'Opera';   browserVersion = RegExp.$1; }
    else if (/Chrome\/([0-9.]+)/.test(ua)){ browser = 'Chrome';  browserVersion = RegExp.$1; }
    else if (/Firefox\/([0-9.]+)/.test(ua)){ browser = 'Firefox'; browserVersion = RegExp.$1; }
    else if (/Safari\/([0-9.]+)/.test(ua)){ browser = 'Safari';  browserVersion = RegExp.$1; }
    else if (/MSIE|Trident/.test(ua))     { browser = 'Internet Explorer'; }

    // OS
    if (/Windows NT 10/.test(ua))       os = 'Windows 10/11';
    else if (/Windows NT 6.3/.test(ua)) os = 'Windows 8.1';
    else if (/Windows NT 6.1/.test(ua)) os = 'Windows 7';
    else if (/Windows/.test(ua))        os = 'Windows';
    else if (/Mac OS X/.test(ua))       os = 'macOS';
    else if (/Android/.test(ua))        os = 'Android';
    else if (/iPhone|iPad/.test(ua))    os = 'iOS';
    else if (/Linux/.test(ua))          os = 'Linux';

    // Device
    if (/Mobi|Android|iPhone/.test(ua)) deviceType = 'mobile';
    else if (/iPad|Tablet/.test(ua))    deviceType = 'tablet';
    else                                 deviceType = 'desktop';

    return { browser, browserVersion, os, deviceType };
}

function getIp(req) {
    return (req.headers['x-forwarded-for'] || req.ip || '').replace('::ffff:', '');
}

function escapeCSV(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
}

// ─── Public routes (no auth needed — called by frontend tracker) ─────────────

// POST /api/logs/session  — start or update session
router.post('/session', async (req, res) => {
    try {
        const { session_id, referrer, page_path, page_title } = req.body;
        if (!session_id) return res.status(400).json({ error: 'session_id required' });

        const pool = getPool();
        const ua = req.headers['user-agent'] || '';
        const ip = getIp(req);
        const { browser, browserVersion, os, deviceType } = parseUserAgent(ua);

        // Upsert session
        await pool.query(`
            INSERT INTO visitor_sessions (session_id, ip_address, user_agent, browser, browser_version, os, device_type, referrer)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE last_seen_at = NOW()
        `, [session_id, ip, ua, browser, browserVersion, os, deviceType, referrer || null]);

        // Log first page
        if (page_path) {
            await pool.query(
                'INSERT INTO page_visit_logs (session_id, page_path, page_title) VALUES (?, ?, ?)',
                [session_id, page_path, page_title || page_path]
            );
            await pool.query(
                'UPDATE visitor_sessions SET total_pages = total_pages + 1 WHERE session_id = ?',
                [session_id]
            );
        }

        res.json({ ok: true });
    } catch (err) {
        res.json({ ok: false });
    }
});

// POST /api/logs/page  — log page visit + time spent on previous page
router.post('/page', async (req, res) => {
    try {
        const { session_id, page_path, page_title, prev_page_id, time_spent_seconds } = req.body;
        if (!session_id || !page_path) return res.status(400).json({ error: 'Missing fields' });

        const pool = getPool();

        // Update time spent on previous page
        if (prev_page_id && time_spent_seconds > 0) {
            await pool.query(
                'UPDATE page_visit_logs SET time_spent_seconds = ? WHERE id = ? AND session_id = ?',
                [Math.min(time_spent_seconds, 3600), prev_page_id, session_id]
            );
        }

        // Insert new page visit
        const [result] = await pool.query(
            'INSERT INTO page_visit_logs (session_id, page_path, page_title) VALUES (?, ?, ?)',
            [session_id, page_path, page_title || page_path]
        );

        // Update total pages on session
        await pool.query(
            'UPDATE visitor_sessions SET total_pages = total_pages + 1, last_seen_at = NOW() WHERE session_id = ?',
            [session_id]
        );

        res.json({ ok: true, page_visit_id: result.insertId });
    } catch (err) {
        res.json({ ok: false });
    }
});

// POST /api/logs/session/end  — close session
router.post('/session/end', async (req, res) => {
    try {
        const { session_id, duration_seconds, last_page_id, last_page_time } = req.body;
        if (!session_id) return res.status(400).json({ error: 'session_id required' });

        const pool = getPool();

        if (last_page_id && last_page_time > 0) {
            await pool.query(
                'UPDATE page_visit_logs SET time_spent_seconds = ? WHERE id = ? AND session_id = ?',
                [Math.min(last_page_time, 3600), last_page_id, session_id]
            );
        }

        await pool.query(
            'UPDATE visitor_sessions SET ended_at = NOW(), duration_seconds = ? WHERE session_id = ?',
            [Math.min(duration_seconds || 0, 86400), session_id]
        );

        res.json({ ok: true });
    } catch (err) {
        res.json({ ok: false });
    }
});

// ─── Admin routes (auth required) ────────────────────────────────────────────

// GET /api/logs/summary
router.get('/summary', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();

        const [[totals]] = await pool.query(`
            SELECT
                COUNT(*) AS total_sessions,
                COUNT(DISTINCT ip_address) AS unique_visitors,
                ROUND(AVG(duration_seconds)) AS avg_duration,
                SUM(total_pages) AS total_pageviews
            FROM visitor_sessions
            WHERE started_at >= NOW() - INTERVAL 30 DAY
        `);

        const [[today]] = await pool.query(`
            SELECT COUNT(*) AS sessions_today
            FROM visitor_sessions
            WHERE DATE(started_at) = CURDATE()
        `);

        const [topPages] = await pool.query(`
            SELECT page_path, page_title,
                COUNT(*) AS visits,
                ROUND(AVG(time_spent_seconds)) AS avg_time
            FROM page_visit_logs
            WHERE visited_at >= NOW() - INTERVAL 30 DAY
            GROUP BY page_path, page_title
            ORDER BY visits DESC
            LIMIT 10
        `);

        const [byDay] = await pool.query(`
            SELECT DATE(started_at) AS day, COUNT(*) AS sessions
            FROM visitor_sessions
            WHERE started_at >= NOW() - INTERVAL 30 DAY
            GROUP BY DATE(started_at)
            ORDER BY day ASC
        `);

        const [byDevice] = await pool.query(`
            SELECT device_type, COUNT(*) AS total
            FROM visitor_sessions
            WHERE started_at >= NOW() - INTERVAL 30 DAY
            GROUP BY device_type
        `);

        const [byBrowser] = await pool.query(`
            SELECT browser, COUNT(*) AS total
            FROM visitor_sessions
            WHERE started_at >= NOW() - INTERVAL 30 DAY
            GROUP BY browser
            ORDER BY total DESC
            LIMIT 6
        `);

        res.json({
            totals: { ...totals, sessions_today: today.sessions_today },
            topPages,
            byDay,
            byDevice,
            byBrowser
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/logs/sessions  — paginated list
router.get('/sessions', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 20);
        const offset = (page - 1) * limit;
        const range = req.query.range || '30d';
        const device = req.query.device || '';
        const search = req.query.search || '';

        let interval = 'INTERVAL 30 DAY';
        if (range === '7d')  interval = 'INTERVAL 7 DAY';
        if (range === '1d')  interval = 'INTERVAL 1 DAY';
        if (range === '90d') interval = 'INTERVAL 90 DAY';
        if (range === 'all') interval = null;

        let where = interval ? `WHERE vs.started_at >= NOW() - ${interval}` : 'WHERE 1=1';
        const params = [];

        if (device) { where += ' AND vs.device_type = ?'; params.push(device); }
        if (search) { where += ' AND (vs.ip_address LIKE ? OR vs.browser LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

        const [[{ total }]] = await pool.query(
            `SELECT COUNT(*) AS total FROM visitor_sessions vs ${where}`, params
        );

        const [rows] = await pool.query(`
            SELECT vs.*,
                (SELECT GROUP_CONCAT(pvl.page_path ORDER BY pvl.visited_at SEPARATOR ' → ' SEPARATOR '')
                 FROM page_visit_logs pvl WHERE pvl.session_id = vs.session_id LIMIT 5) AS pages_visited
            FROM visitor_sessions vs
            ${where}
            ORDER BY vs.started_at DESC
            LIMIT ? OFFSET ?
        `, [...params, limit, offset]);

        res.json({ sessions: rows, total, page, limit, pages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
});

// GET /api/logs/session/:id/pages  — pages visited in a session
router.get('/session/:session_id/pages', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query(
            'SELECT * FROM page_visit_logs WHERE session_id = ? ORDER BY visited_at ASC',
            [req.params.session_id]
        );
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// GET /api/logs/export  — CSV export
router.get('/export', authMiddleware, async (req, res, next) => {
    try {
        const pool = getPool();
        const range = req.query.range || '30d';

        let interval = 'INTERVAL 30 DAY';
        if (range === '7d')  interval = 'INTERVAL 7 DAY';
        if (range === '1d')  interval = 'INTERVAL 1 DAY';
        if (range === '90d') interval = 'INTERVAL 90 DAY';
        if (range === 'all') interval = null;

        const where = interval ? `WHERE vs.started_at >= NOW() - ${interval}` : '';

        const [sessions] = await pool.query(`
            SELECT vs.session_id, vs.ip_address, vs.browser, vs.browser_version, vs.os,
                vs.device_type, vs.referrer, vs.total_pages, vs.duration_seconds,
                vs.started_at, vs.ended_at,
                pvl.page_path, pvl.page_title, pvl.time_spent_seconds, pvl.visited_at
            FROM visitor_sessions vs
            LEFT JOIN page_visit_logs pvl ON pvl.session_id = vs.session_id
            ${where}
            ORDER BY vs.started_at DESC, pvl.visited_at ASC
        `);

        const headers = [
            'session_id','ip_address','browser','versao_browser','sistema_operativo',
            'dispositivo','referrer','total_paginas','duracao_segundos',
            'inicio_sessao','fim_sessao','pagina','titulo_pagina','tempo_pagina_segundos','hora_visita'
        ];

        const csvRows = [headers.join(',')];
        for (const row of sessions) {
            csvRows.push([
                row.session_id, row.ip_address, row.browser, row.browser_version,
                row.os, row.device_type, row.referrer, row.total_pages, row.duration_seconds,
                row.started_at, row.ended_at, row.page_path, row.page_title,
                row.time_spent_seconds, row.visited_at
            ].map(escapeCSV).join(','));
        }

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="logs_museu_${new Date().toISOString().split('T')[0]}.csv"`);
        res.send('\uFEFF' + csvRows.join('\n')); // BOM for Excel
    } catch (err) {
        next(err);
    }
});

module.exports = router;
