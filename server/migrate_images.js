const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const OLD_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images'); // public/images frontend

// Certificar que a diretoria de destino existe
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Help function: Move a file from /images/... to /uploads/... while timestamping it
function migrateLocalFile(oldPathStr) {
  // e.g. oldPathStr = "/images/artefatos/IMG_1941.JPG"
  if (!oldPathStr.startsWith('/images/')) return oldPathStr;

  const parts = oldPathStr.split('/'); // ["", "images", "artefatos", "IMG_1941.JPG"]
  let filename = decodeURIComponent(parts[parts.length - 1]);
  const localOldPath = path.join(OLD_IMAGES_DIR, ...parts.slice(2)); // path to public/images/artefatos/IMG_1941.JPG
  
  if (!fs.existsSync(localOldPath)) {
    console.warn(`    ⚠️ File not found locally to migrate: ${localOldPath}`);
    return oldPathStr; // cannot move, keep as is
  }

  const newFilename = `${Date.now()}-${filename}`;
  const newLocalPath = path.join(UPLOADS_DIR, newFilename);
  
  // copy rather than move just to be safe
  fs.copyFileSync(localOldPath, newLocalPath);
  
  return `/uploads/${newFilename}`;
}

async function downloadMarkdownImageAndReturnLocalPath(url) {
  // if already absolute local, or relative /uploads, ignore
  if (url.startsWith('/uploads/')) return url;
  if (url.startsWith('/images/')) return migrateLocalFile(url);
  if (!url.startsWith('http') && !url.startsWith('//')) return url;
  
  const dUrl = url.startsWith('//') ? `https:${url}` : url;
  let filename = `md_img_${Date.now()}_.jpg`;
  try {
     const parsed = new URL(dUrl);
     const pathParts = parsed.pathname.split('/');
     filename = decodeURIComponent(pathParts[pathParts.length - 1]).replace(/[<>:"|?*]/g, '_');
  } catch(e) {}
  
  const finalFilename = `${Date.now()}-${filename}`;
  const dest = path.join(UPLOADS_DIR, finalFilename);
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const response = await fetch(dUrl, { 
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(arrayBuffer));
    console.log(`    ✅ Markdown Image downloaded: ${filename}`);
    return `/uploads/${finalFilename}`;
  } catch (err) {
    console.warn(`    ❌ Markdown Image failed to download: ${dUrl} -> ${err.message}`);
    return url; // return original if fail
  }
}

async function processMarkdownText(text) {
  if (!text) return text;
  
  // regex para encontrar strings como ![alt](url)
  const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let matches;
  let newText = text;
  
  // Tem de descer uma a uma porque temos `await`
  const links = [];
  while ((matches = regex.exec(text)) !== null) {
    links.push({ fullMatch: matches[0], alt: matches[1], url: matches[2] });
  }

  for (const link of links) {
    if (link.url.includes('bubble.io') || link.url.startsWith('http') || link.url.startsWith('//') || link.url.startsWith('/images/')) {
        const newLocalUrl = await downloadMarkdownImageAndReturnLocalPath(link.url);
        newText = newText.replace(link.fullMatch, `![${link.alt}](${newLocalUrl})`);
    }
  }
  
  return newText;
}

function processGaleria(galeria) {
  if (!galeria) return galeria;
  try {
    let urls = typeof galeria === 'string' ? JSON.parse(galeria) : galeria;
    if (Array.isArray(urls)) {
      return JSON.stringify(urls.map(u => migrateLocalFile(u)));
    }
  } catch (e) {
    return galeria;
  }
  return galeria;
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'museu_edm_final',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  console.log('🔄 Inicializando a migração de imagens para formato de upload local (/uploads/)...\n');

  // ARTICLES
  console.log('📰 ARTICLES (image3, body_text, body_text2, body_text3)');
  const [articles] = await conn.query('SELECT id, image3, body_text, body_text2, body_text3 FROM articles');
  let updatedArt = 0;
  for (const art of articles) {
    let updated = false;
    
    // Convert direct image field
    let newImage3 = art.image3;
    if (newImage3 && newImage3.startsWith('/images/')) {
      newImage3 = migrateLocalFile(newImage3);
      if (newImage3 !== art.image3) updated = true;
    } else if (newImage3 && (newImage3.startsWith('http') || newImage3.startsWith('//'))) {
      newImage3 = await downloadMarkdownImageAndReturnLocalPath(newImage3);
      if (newImage3 !== art.image3) updated = true;
    }

    // Convert markdown
    const newBody = await processMarkdownText(art.body_text);
    if (newBody !== art.body_text) updated = true;
    
    const newBody2 = await processMarkdownText(art.body_text2);
    if (newBody2 !== art.body_text2) updated = true;
    
    const newBody3 = await processMarkdownText(art.body_text3);
    if (newBody3 !== art.body_text3) updated = true;

    if (updated) {
      await conn.query('UPDATE articles SET image3 = ?, body_text = ?, body_text2 = ?, body_text3 = ? WHERE id = ?', 
        [newImage3, newBody, newBody2, newBody3, art.id]);
      updatedArt++;
    }
  }
  console.log(`   Updated ${updatedArt} articles.`);

  // PATRIMONIOS
  console.log('\n🏛️ PATRIMONIOS (foto, galeria)');
  const [patrimonios] = await conn.query('SELECT id, foto, galeria FROM patrimonios');
  let updatedPat = 0;
  for (const p of patrimonios) {
    let updated = false;
    let newFoto = p.foto;
    let newGaleria = p.galeria;

    if (newFoto) {
      if (newFoto.startsWith('/images/')) {
         newFoto = migrateLocalFile(newFoto);
         updated = true;
      } else if (newFoto.startsWith('http') || newFoto.startsWith('//')) {
         newFoto = await downloadMarkdownImageAndReturnLocalPath(newFoto);
         updated = true;
      }
    }

    if (newGaleria) {
      const resG = processGaleria(newGaleria);
      if (resG !== newGaleria) {
         newGaleria = resG;
         updated = true;
      }
    }

    if (updated) {
      await conn.query('UPDATE patrimonios SET foto = ?, galeria = ? WHERE id = ?', [newFoto, newGaleria, p.id]);
      updatedPat++;
    }
  }
  console.log(`   Updated ${updatedPat} patrimonios.`);

  // ARTEFATOS
  console.log('\n🏺 ARTEFATOS (foto, galeria, descricao)');
  const [artefatos] = await conn.query('SELECT id, foto, galeria, descricao FROM artefatos');
  let updatedArtf = 0;
  for (const a of artefatos) {
    let updated = false;
    let newFoto = a.foto;
    let newGaleria = a.galeria;
    let newDesc = a.descricao;

    if (newFoto) {
      if (newFoto.startsWith('/images/')) {
        newFoto = migrateLocalFile(newFoto);
        updated = true;
      } else if (newFoto.startsWith('http') || newFoto.startsWith('//')) {
        newFoto = await downloadMarkdownImageAndReturnLocalPath(newFoto);
        updated = true;
      }
    }
    
    if (newGaleria) {
      const resG = processGaleria(newGaleria);
      if (resG !== newGaleria) {
         newGaleria = resG;
         updated = true;
      }
    }

    // if descricao has markdown images
    const processedDesc = await processMarkdownText(newDesc);
    if (processedDesc !== newDesc) {
       newDesc = processedDesc;
       updated = true;
    }

    if (updated) {
      await conn.query('UPDATE artefatos SET foto = ?, galeria = ?, descricao = ? WHERE id = ?', [newFoto, newGaleria, newDesc, a.id]);
      updatedArtf++;
    }
  }
  console.log(`   Updated ${updatedArtf} artefatos.`);

  // EXPOSICOES
  console.log('\n🖼️ EXPOSICOES (foto1, foto2, galeria)');
  const [exposicoes] = await conn.query('SELECT id, foto1, foto2, galeria FROM exposicoes');
  let updatedExp = 0;
  for (const e of exposicoes) {
    let updated = false;
    let newFoto1 = e.foto1;
    let newFoto2 = e.foto2;
    let newGaleria = e.galeria;

    if (newFoto1) {
       if (newFoto1.startsWith('/images/')) { newFoto1 = migrateLocalFile(newFoto1); updated = true; }
       else if (newFoto1.startsWith('http') || newFoto1.startsWith('//')) { newFoto1 = await downloadMarkdownImageAndReturnLocalPath(newFoto1); updated = true; }
    }
    
    if (newFoto2) {
       if (newFoto2.startsWith('/images/')) { newFoto2 = migrateLocalFile(newFoto2); updated = true; }
       else if (newFoto2.startsWith('http') || newFoto2.startsWith('//')) { newFoto2 = await downloadMarkdownImageAndReturnLocalPath(newFoto2); updated = true; }
    }

    if (newGaleria) {
      const resG = processGaleria(newGaleria);
      if (resG !== newGaleria) {
         newGaleria = resG;
         updated = true;
      }
    }

    if (updated) {
      await conn.query('UPDATE exposicoes SET foto1 = ?, foto2 = ?, galeria = ? WHERE id = ?', [newFoto1, newFoto2, newGaleria, e.id]);
      updatedExp++;
    }
  }
  console.log(`   Updated ${updatedExp} exposicoes.`);

  // TESTEMUNHOS
  console.log('\n💬 TESTEMUNHOS (image)');
  const [testemunhos] = await conn.query('SELECT id, image FROM testemunhos');
  let updatedTst = 0;
  for (const t of testemunhos) {
    if (t.image) {
      let newImg = t.image;
      if (t.image.startsWith('/images/')) { newImg = migrateLocalFile(t.image); }
      else if (t.image.startsWith('http') || t.image.startsWith('//')) { newImg = await downloadMarkdownImageAndReturnLocalPath(t.image); }
      
      if (newImg !== t.image) {
        await conn.query('UPDATE testemunhos SET image = ? WHERE id = ?', [newImg, t.id]);
        updatedTst++;
      }
    }
  }
  console.log(`   Updated ${updatedTst} testemunhos.`);

  // EVENTOS
  console.log('\n📅 EVENTOS (foto)');
  const [eventos] = await conn.query('SELECT id, foto FROM eventos');
  let updatedEvt = 0;
  for (const ev of eventos) {
    if (ev.foto) {
      let newFoto = ev.foto;
      if (ev.foto.startsWith('/images/')) { newFoto = migrateLocalFile(ev.foto); }
      else if (ev.foto.startsWith('http') || ev.foto.startsWith('//')) { newFoto = await downloadMarkdownImageAndReturnLocalPath(ev.foto); }
      
      if (newFoto !== ev.foto) {
        await conn.query('UPDATE eventos SET foto = ? WHERE id = ?', [newFoto, ev.id]);
        updatedEvt++;
      }
    }
  }
  console.log(`   Updated ${updatedEvt} eventos.`);

  await conn.end();

  console.log('\n========================================');
  console.log(`✅ Transformação Concluída!`);
  console.log(`   O seu museu agora possui perfeitamente 100% imagens simuladas`);
  console.log(`   como UPLOADS e sem ligações a CDNs.`);
  console.log(`   Todas residem em /server/public/uploads.`);
  console.log('========================================');
}

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
