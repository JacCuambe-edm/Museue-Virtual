const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

function extractTrueTitle(desc) {
  if (!desc) return "Sem título";
  
  const d = desc.trim();
  
  // Rule 1: Markdown [b]Title[/b]
  if (d.includes('[b]') && d.includes('[/b]')) {
    return d.split('[b]')[1].split('[/b]')[0].trim();
  }
  
  // Rule 2: "A Subestação de [Nome]" -> "Subestação de [Nome]"
  const subMatch = d.match(/^(A\s+)?(Subesta[çc][ãa]o\s+de\s+[^,.]+)/i);
  if (subMatch) {
    return subMatch[2].trim();
  }
  
  // Rule 3: Short sentence before first period (e.g. "Grupo Gerador. A central...")
  const firstSentence = d.split('.')[0].trim();
  if (firstSentence.length < 50 && firstSentence.split(' ').length <= 8) {
    return firstSentence;
  }
  
  // Rule 4: "O Grupo gerador foi..." -> "Grupo Gerador"
  if (d.toLowerCase().startsWith('o grupo gerador')) {
    return "Grupo Gerador";
  }

  // Fallback: Just take up to 6 words beautifully
  const words = d.split(' ');
  const fallback = words.slice(0, 6).join(' ').replace(/[,.]+$/, '');
  return fallback + (words.length > 6 ? '...' : '');
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'museu_edm_final',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  const [artefatos] = await conn.query('SELECT id, titulo, descricao FROM artefatos');
  
  let updated = 0;
  for (const a of artefatos) {
    const trueTitle = extractTrueTitle(a.descricao);
    
    // Clean up the description to remove the redundant title if it was nicely extracted
    let cleanDesc = a.descricao.trim();
    if (cleanDesc.includes(`[b]${trueTitle}[/b]`)) {
      cleanDesc = cleanDesc.replace(`[b]${trueTitle}[/b]`, '').trim();
      if (cleanDesc.startsWith('\\n') || cleanDesc.startsWith('\n')) {
          cleanDesc = cleanDesc.replace(/^\\n|^\n/, '').trim();
      }
    }
    
    if (a.titulo !== trueTitle || a.descricao !== cleanDesc) {
      await conn.query('UPDATE artefatos SET titulo = ?, descricao = ? WHERE id = ?', [trueTitle, cleanDesc, a.id]);
      console.log(`✅ [ID ${a.id}] Antigo: "${a.titulo.substring(0, 30)}..." -> NOVO: "${trueTitle}"`);
      updated++;
    }
  }

  console.log(`\n🎉 Concluído! ${updated} artefatos tiveram os seus títulos corrigidos com heurística avançada!`);
  await conn.end();
}

main().catch(console.error);
