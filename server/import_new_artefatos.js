const fs = require('fs');
const readline = require('readline');
require('dotenv').config({ path: '../.env' });
const { getPool } = require('./config/database');

async function run() {
  const pool = getPool();
  const filePath = '../Dados para inserir/export_All-artefatos-modified_2026-03-14_06-05-02.ndjson';
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  console.log('Starting NDJSON import with corrected columns...');

  for await (const line of rl) {
    if (!line.trim()) continue;
    
    try {
      const item = JSON.parse(line);
      
      let titulo = "";
      if (item.Descrição && item.Descrição.includes("[b]") && item.Descrição.includes("[/b]")) {
        titulo = item.Descrição.split("[b]")[1].split("[/b]")[0];
      } else {
        titulo = (item.Descrição || "").substring(0, 50).trim() || "Artefato sem título";
      }

      const foto = item.foto ? (item.foto.startsWith("//") ? "https:" + item.foto : item.foto) : null;
      const galeria = JSON.stringify([
        item.foto1 ? (item.foto1.startsWith("//") ? "https:" + item.foto1 : item.foto1) : null,
        item.foto2 ? (item.foto2.startsWith("//") ? "https:" + item.foto2 : item.foto2) : null
      ].filter(f => f !== null));

      let data_aquisicao = null;
      if (item.data_aquisicao) {
        try {
          const d = new Date(item.data_aquisicao);
          if (!isNaN(d.getTime())) {
            data_aquisicao = d.toISOString().slice(0, 19).replace('T', ' ');
          }
        } catch (e) {}
      }

      await pool.query(
        `INSERT INTO artefatos (
          titulo, categoria, area_negocio, data_aquisicao, origem, 
          localizacao, estado, material, dimensoes, responsavel, 
          descricao, foto, galeria
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          titulo, 
          item.Categoria || "Outros", 
          item.Categoria || "Outros", 
          data_aquisicao, 
          item.Origem || "N/A", 
          item.localizacao_atual || "N/A",
          item["Estado de conservação"] || "N/A", 
          item.Materiais || "N/A", 
          item["Dimensões"] || "N/A", 
          item["Responsável"] || "N/A", 
          item.Descrição || "", 
          foto, 
          galeria
        ]
      );
      console.log(`Inserted: ${titulo}`);
    } catch (err) {
      console.error(`Error processing line:`, err.message);
    }
  }

  await pool.end();
  console.log("Import complete.");
}

run();
