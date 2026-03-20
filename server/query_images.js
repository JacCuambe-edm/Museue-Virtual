const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'museu_edm_final',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  // Articles images
  const [articles] = await conn.query('SELECT id, title, image3 FROM articles WHERE image3 IS NOT NULL AND image3 != ""');
  console.log('=== ARTICLES ===');
  console.log(JSON.stringify(articles, null, 2));

  // Patrimonios images
  const [patrimonios] = await conn.query('SELECT id, nome, foto, galeria FROM patrimonios WHERE foto IS NOT NULL AND foto != ""');
  console.log('\n=== PATRIMONIOS ===');
  console.log(JSON.stringify(patrimonios, null, 2));

  // Artefatos images
  const [artefatos] = await conn.query('SELECT id, titulo, foto, galeria FROM artefatos WHERE foto IS NOT NULL AND foto != ""');
  console.log('\n=== ARTEFATOS ===');
  console.log(JSON.stringify(artefatos, null, 2));

  // Exposicoes images
  const [exposicoes] = await conn.query('SELECT id, titulo, foto1, foto2, galeria FROM exposicoes WHERE foto1 IS NOT NULL AND foto1 != ""');
  console.log('\n=== EXPOSICOES ===');
  console.log(JSON.stringify(exposicoes, null, 2));

  // Testemunhos images
  const [testemunhos] = await conn.query('SELECT id, name, image FROM testemunhos WHERE image IS NOT NULL AND image != ""');
  console.log('\n=== TESTEMUNHOS ===');
  console.log(JSON.stringify(testemunhos, null, 2));

  // Eventos images
  const [eventos] = await conn.query('SELECT id, nome, foto FROM eventos WHERE foto IS NOT NULL AND foto != ""');
  console.log('\n=== EVENTOS ===');
  console.log(JSON.stringify(eventos, null, 2));

  await conn.end();
})();
