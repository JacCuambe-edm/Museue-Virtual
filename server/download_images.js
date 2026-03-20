const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const BASE_DIR = path.join(__dirname, '..', 'public', 'images');

// Track stats
let downloaded = 0;
let skipped = 0;
let failed = 0;
const urlToLocal = {};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function downloadFile(url, dest, retries = 3) {
  if (fs.existsSync(dest)) {
    skipped++;
    return dest;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20 seg timeout

    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      clearTimeout(timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(dest, buffer);
      
      downloaded++;
      // Pequeno timeout para não massacrar a CDN
      await delay(500);
      return dest;
      
    } catch (err) {
      clearTimeout(timeout);
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      
      if (attempt === retries) {
        throw new Error(`${err.name}: ${err.message}`);
      } else {
        console.log(`    (tentativa ${attempt} falhou, a tentar novamente...)`);
        await delay(1000 * attempt);
      }
    }
  }
}

function getFilenameFromUrl(url) {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split('/');
    let filename = decodeURIComponent(pathParts[pathParts.length - 1]);
    // Remove invalid chars for Windows
    filename = filename.replace(/[<>:"|?*]/g, '_');
    return filename;
  } catch {
    return `image_${Date.now()}.jpg`;
  }
}

async function processUrl(url, subDir) {
  if (!url || typeof url !== 'string') return url;
  if (!url.startsWith('http') && !url.startsWith('//')) return url;

  const downloadUrl = url.startsWith('//') ? `https:${url}` : url;

  // Already processed?
  if (urlToLocal[url]) return urlToLocal[url];

  const dir = path.join(BASE_DIR, subDir);
  ensureDir(dir);

  const filename = getFilenameFromUrl(downloadUrl);
  const localPath = path.join(dir, filename);
  const publicPath = `/images/${subDir}/${filename}`;

  try {
    await downloadFile(downloadUrl, localPath);
    urlToLocal[url] = publicPath;
    console.log(`  ✅ ${filename}`);
    return publicPath;
  } catch (err) {
    failed++;
    console.log(`  ❌ ${filename}: ${err.message}`);
    return url; // keep original if download fails
  }
}

function parseGaleria(galeria) {
  if (!galeria) return [];
  try {
    if (typeof galeria === 'string') return JSON.parse(galeria);
    if (Array.isArray(galeria)) return galeria;
    return [];
  } catch { return []; }
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'museu_edm_final',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  console.log('🔄 A iniciar download de imagens...\n');

  // === ARTICLES ===
  console.log('📰 ARTICLES (image3)');
  const [articles] = await conn.query('SELECT id, image3 FROM articles WHERE image3 IS NOT NULL AND image3 != ""');
  for (const art of articles) {
    if (art.image3 && art.image3.startsWith('http')) {
      const localPath = await processUrl(art.image3, 'articles');
      if (localPath !== art.image3) {
        await conn.query('UPDATE articles SET image3 = ? WHERE id = ?', [localPath, art.id]);
      }
    }
  }

  // === PATRIMONIOS ===
  console.log('\n🏛️ PATRIMONIOS (foto + galeria)');
  const [patrimonios] = await conn.query('SELECT id, foto, galeria FROM patrimonios WHERE (foto IS NOT NULL AND foto != "") OR (galeria IS NOT NULL AND galeria != "")');
  for (const p of patrimonios) {
    let updated = false;
    let newFoto = p.foto;
    let newGaleria = p.galeria;

    if (p.foto && p.foto.startsWith('http')) {
      newFoto = await processUrl(p.foto, 'patrimonios');
      if (newFoto !== p.foto) updated = true;
    }

    const galeriaUrls = parseGaleria(p.galeria);
    if (galeriaUrls.length > 0) {
      const newGaleriaUrls = [];
      for (const gUrl of galeriaUrls) {
        const localG = await processUrl(gUrl, 'patrimonios');
        newGaleriaUrls.push(localG);
        if (localG !== gUrl) updated = true;
      }
      newGaleria = JSON.stringify(newGaleriaUrls);
    }

    if (updated) {
      await conn.query('UPDATE patrimonios SET foto = ?, galeria = ? WHERE id = ?', [newFoto, newGaleria, p.id]);
    }
  }

  // === ARTEFATOS ===
  console.log('\n🏺 ARTEFATOS (foto + galeria)');
  const [artefatos] = await conn.query('SELECT id, foto, galeria FROM artefatos WHERE (foto IS NOT NULL AND foto != "") OR (galeria IS NOT NULL AND galeria != "")');
  for (const a of artefatos) {
    let updated = false;
    let newFoto = a.foto;
    let newGaleria = a.galeria;

    if (a.foto && a.foto.startsWith('http')) {
      newFoto = await processUrl(a.foto, 'artefatos');
      if (newFoto !== a.foto) updated = true;
    }

    const galeriaUrls = parseGaleria(a.galeria);
    if (galeriaUrls.length > 0) {
      const newGaleriaUrls = [];
      for (const gUrl of galeriaUrls) {
        const localG = await processUrl(gUrl, 'artefatos');
        newGaleriaUrls.push(localG);
        if (localG !== gUrl) updated = true;
      }
      newGaleria = JSON.stringify(newGaleriaUrls);
    }

    if (updated) {
      await conn.query('UPDATE artefatos SET foto = ?, galeria = ? WHERE id = ?', [newFoto, newGaleria, a.id]);
    }
  }

  // === EXPOSICOES ===
  console.log('\n🖼️ EXPOSICOES (foto1 + foto2 + galeria)');
  const [exposicoes] = await conn.query('SELECT id, foto1, foto2, galeria FROM exposicoes WHERE (foto1 IS NOT NULL AND foto1 != "") OR (foto2 IS NOT NULL AND foto2 != "")');
  for (const e of exposicoes) {
    let updated = false;
    let newFoto1 = e.foto1;
    let newFoto2 = e.foto2;
    let newGaleria = e.galeria;

    if (e.foto1 && e.foto1.startsWith('http')) {
      newFoto1 = await processUrl(e.foto1, 'exposicoes');
      if (newFoto1 !== e.foto1) updated = true;
    }
    if (e.foto2 && e.foto2.startsWith('http')) {
      newFoto2 = await processUrl(e.foto2, 'exposicoes');
      if (newFoto2 !== e.foto2) updated = true;
    }

    const galeriaUrls = parseGaleria(e.galeria);
    if (galeriaUrls.length > 0) {
      const newGaleriaUrls = [];
      for (const gUrl of galeriaUrls) {
        const localG = await processUrl(gUrl, 'exposicoes');
        newGaleriaUrls.push(localG);
        if (localG !== gUrl) updated = true;
      }
      newGaleria = JSON.stringify(newGaleriaUrls);
    }

    if (updated) {
      await conn.query('UPDATE exposicoes SET foto1 = ?, foto2 = ?, galeria = ? WHERE id = ?', [newFoto1, newFoto2, newGaleria, e.id]);
    }
  }

  // === TESTEMUNHOS ===
  console.log('\n💬 TESTEMUNHOS (image)');
  const [testemunhos] = await conn.query('SELECT id, image FROM testemunhos WHERE image IS NOT NULL AND image != ""');
  for (const t of testemunhos) {
    if (t.image && t.image.startsWith('http')) {
      const localPath = await processUrl(t.image, 'testemunhos');
      if (localPath !== t.image) {
        await conn.query('UPDATE testemunhos SET image = ? WHERE id = ?', [localPath, t.id]);
      }
    }
  }

  // === EVENTOS ===
  console.log('\n📅 EVENTOS (foto)');
  const [eventos] = await conn.query('SELECT id, foto FROM eventos WHERE foto IS NOT NULL AND foto != ""');
  for (const ev of eventos) {
    if (ev.foto && ev.foto.startsWith('http')) {
      const localPath = await processUrl(ev.foto, 'eventos');
      if (localPath !== ev.foto) {
        await conn.query('UPDATE eventos SET foto = ? WHERE id = ?', [localPath, ev.id]);
      }
    }
  }

  await conn.end();

  console.log('\n========================================');
  console.log(`✅ Download concluído!`);
  console.log(`   Baixados: ${downloaded}`);
  console.log(`   Já existiam: ${skipped}`);
  console.log(`   Falharam: ${failed}`);
  console.log(`   Total processado: ${downloaded + skipped + failed}`);
  console.log(`   Directório: ${BASE_DIR}`);
  console.log('========================================');
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
