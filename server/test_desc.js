const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('d:\\Sistemas em desenolvimento\\museuedm\\Dados para inserir\\export_All-artefatos-modified_2026-03-14_06-05-02.ndjson', 'utf8');

  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let idx = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      const descKey = Object.keys(obj).find(k => k.startsWith('Descri'));
      const desc = obj[descKey] || '';
      console.log(`\n--- ITEM ${idx} ---`);
      console.log(desc.substring(0, 200).replace(/\n/g, '\\n'));
    } catch(e) {}
    idx++;
    if (idx >= 15) break;
  }
}

processLineByLine();
