const fs = require('fs');
const readline = require('readline');
require('dotenv').config({ path: '../.env' });
const { getPool } = require('./config/database');

async function run() {
  const pool = getPool();
  // Using the larger modified file which contains full technical fields
  const filePath = '../Dados para inserir/export_All-patrimonios-modified_2026-03-14_05-59-21.ndjson';
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  console.log('Starting Complete Patrimonio NDJSON import...');

  let count = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;
    
    try {
      const item = JSON.parse(line);
      
      const foto = item.Imagem ? (item.Imagem.startsWith("//") ? "https:" + item.Imagem : item.Imagem) : null;
      
      const tipo = item.Transmissao === "Linhas" ? "Linha de Transmissao" : 
                   (item.Transmissao === "Subestação" ? "Substacao" : "Outro");

      // We map "Região" to "nota" column because the frontend uses "nota LIKE %regiao%" for filtering
      const nota = item.Região || "";

      await pool.query(
        `INSERT INTO patrimonios (
          nome, sigla, area_negocio, tipo, localizacao, ano_entrada_servico,
          potencia_instalada_inicial, potencia_instalada_actual, niveis_tensao,
          transformadores_potencia, barramento_inicial, barramento_final,
          capacidade_linha, condutor, circuito, comprimento, tipo_postes,
          tipo_isoladores, cabo_guarda, foto, nota
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.Titulo || "Sem Nome",
          item.Substitulo || "",
          item["Área de Negócio"] || "Outros",
          tipo,
          item["Localização"] || "",
          item["Ano de entrada em serviço"] || "",
          item["Potência instalada aquando entrada em serviço"] || "",
          item["Potência instalada actual"] || "",
          item["Níveis de tensão"] || "",
          item["Transformadores de potência"] || "",
          item["Barramento inicial"] || "",
          item["Barramento final"] || "",
          item["Capacidade da linha"] || "",
          item["Condutor"] || "",
          item["Circuito"] || "",
          item["Comprimento"] || "",
          item["Tipo de postes"] || "",
          item["Tipo de isoladores"] || "",
          item["Cabo de guarda"] || "",
          foto,
          nota
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
