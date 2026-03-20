const fs = require('fs');
const readline = require('readline');
require('dotenv').config({ path: '../.env' });
const { getPool } = require('./config/database');

async function run() {
  const pool = getPool();
  const filePath = '../Dados para inserir/export_All-Exposicoes_2026-03-14_10-15-57.ndjson';
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  console.log('Starting Exposicoes NDJSON import...');

  let count = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;
    
    try {
      const item = JSON.parse(line);
      
      const foto1 = item.foto1 ? (item.foto1.startsWith("//") ? "https:" + item.foto1 : item.foto1) : null;
      const foto2 = item.foto2 ? (item.foto2.startsWith("//") ? "https:" + item.foto2 : item.foto2) : null;
      
      const galeria = JSON.stringify([foto1, foto2].filter(f => f !== null));

      let data_inicio = null;
      if (item.data_inicio) {
        const d = new Date(item.data_inicio);
        if (!isNaN(d.getTime())) data_inicio = d.toISOString().slice(0, 19).replace('T', ' ');
      }

      let data_fim = null;
      if (item.data_fim) {
        const d = new Date(item.data_fim);
        if (!isNaN(d.getTime())) data_fim = d.toISOString().slice(0, 19).replace('T', ' ');
      }

      // Extracting a title from artefatos_expostos or descricao
      let titulo = item.artefatos_expostos || "Exposição EDM";
      if (titulo.length > 100) titulo = titulo.substring(0, 97) + "...";

      await pool.query(
        `INSERT INTO exposicoes (
          curador, descricao, artefatos_expostos, foto1, foto2, data_inicio, data_fim, titulo, galeria
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.curador || "EDM",
          item.descricao || "",
          item.artefatos_expostos || "",
          foto1,
          foto2,
          data_inicio,
          data_fim,
          titulo,
          galeria
        ]
      );
      count++;
    } catch (err) {
      console.error(`Error processing line:`, err.message);
    }
  }

  await pool.end();
  console.log(`Import complete. Total records inserted: ${count}`);
}

run();
