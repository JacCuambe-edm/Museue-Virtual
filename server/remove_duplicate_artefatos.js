const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function removeDuplicates() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'museu_edm_final',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  console.log("Analyzing 'artefatos' table for duplicates...");
  
  // Find all artifacts
  const [rows] = await conn.query('SELECT id, titulo, SUBSTRING(descricao, 1, 100) as desc_prefix FROM artefatos ORDER BY id ASC');
  
  // Keep track of what we've seen
  const seen = new Set();
  const duplicateIds = [];
  
  for (const row of rows) {
    // Generate a unique fingerprint based on exact title and the first 100 characters of the description
    const fingerprint = `${row.titulo}||${row.desc_prefix}`;
    
    if (seen.has(fingerprint)) {
      duplicateIds.push(row.id);
    } else {
      seen.add(fingerprint);
    }
  }
  
  console.log(`Found ${rows.length} total artifacts.`);
  console.log(`Identified ${duplicateIds.length} duplicate artifacts.`);
  
  if (duplicateIds.length > 0) {
    console.log("Deleting duplicated records...");
    const [result] = await conn.query('DELETE FROM artefatos WHERE id IN (?)', [duplicateIds]);
    console.log(`✅ successfully deleted ${result.affectedRows} duplicates!`);
  } else {
    console.log("No duplicates found to delete.");
  }

  await conn.end();
}

removeDuplicates().catch(console.error);
