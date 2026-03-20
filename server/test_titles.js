const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('d:\\Sistemas em desenolvimento\\museuedm\\Dados para inserir\\export_All-artefatos-modified_2026-03-14_06-05-02.ndjson', 'utf8');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let idx = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      const keys = Object.keys(obj);
      
      const descKey = keys.find(k => k.startsWith('Descri'));
      const desc = obj[descKey] || '';
      
      let title = "NOT FOUND";
      if (desc.includes('[b]') && desc.includes('[/b]')) {
        title = desc.split('[b]')[1].split('[/b]')[0];
      } else if (desc.includes('\\n')) {
        title = desc.split('\\n')[0];
      } else {
        const sentences = desc.split('.');
        title = sentences[0];
      }
      
      console.log(`[${idx}] Keys: ${keys.join(', ')}`);
      // console.log(`   -> Extracted (max 50 chars): ${title.substring(0,50)}`);
    } catch(e) {
    }
    idx++;
  }
}

processLineByLine();
