const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { getPool, initDatabase } = require('./config/database');

async function test() {
    await initDatabase();
    const pool = getPool();
    const interval = '30 DAY';
    
    console.log("=== TIME SERIES ===");
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
    console.log(timeSeries);

    console.log("=== MODULE DISTRIBUTION ===");
    const [moduleDistDb] = await pool.query(`
        SELECT entity_type as name, COUNT(*) as value
        FROM page_metrics_logs
        WHERE action = 'view' AND created_at >= DATE_SUB(CURDATE(), INTERVAL ${interval})
        GROUP BY entity_type
        ORDER BY value DESC
    `);
    console.log(moduleDistDb);

    console.log("=== TOTAL VIEWS ===");
    const [[{ total_views }]] = await pool.query(`SELECT COUNT(*) as total_views FROM page_metrics_logs WHERE action='view' AND created_at >= DATE_SUB(CURDATE(), INTERVAL ${interval})`);
    console.log("Total Views:", total_views);

    process.exit(0);
}
test();
