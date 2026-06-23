const express = require('express');
const { db } = require('../db/database');

const router = express.Router();

// GET /api/search?q=termo
router.get('/', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q || q.length < 2) return res.json([]);

  const like = `%${q}%`;

  const articles = db.prepare(`
    SELECT id, title as name, subtitle as description, category, 'article' as type, image3 as image
    FROM articles
    WHERE title LIKE ? OR subtitle LIKE ? OR body_text LIKE ? OR category LIKE ?
    LIMIT 5
  `).all(like, like, like, like);

  const exposicoes = db.prepare(`
    SELECT id, titulo as name, descricao as description, 'Exposição' as category, 'exposicao' as type, foto1 as image
    FROM exposicoes
    WHERE titulo LIKE ? OR descricao LIKE ? OR artefatos_expostos LIKE ?
    LIMIT 5
  `).all(like, like, like);

  const artefatos = db.prepare(`
    SELECT id, nome as name, descricao as description, area_negocio as category, 'artefato' as type, foto as image
    FROM artefatos
    WHERE nome LIKE ? OR descricao LIKE ? OR area_negocio LIKE ? OR categoria LIKE ?
    LIMIT 5
  `).all(like, like, like, like);

  const patrimonios = db.prepare(`
    SELECT id, nome as name, descricao as description, area_negocio as category, 'patrimonio' as type, foto as image
    FROM patrimonios
    WHERE nome LIKE ? OR descricao LIKE ? OR area_negocio LIKE ? OR localizacao LIKE ?
    LIMIT 5
  `).all(like, like, like, like);

  const eventos = db.prepare(`
    SELECT id, nome as name, descricao as description, tipo as category, 'evento' as type, foto as image
    FROM eventos
    WHERE nome LIKE ? OR descricao LIKE ? OR local_evento LIKE ?
    LIMIT 5
  `).all(like, like, like);

  const results = [
    ...articles.map(r => ({ ...r, url: `/artigo/${r.id}` })),
    ...exposicoes.map(r => ({ ...r, url: `/exposicao/${r.id}` })),
    ...artefatos.map(r => ({ ...r, url: `/artefato/${r.id}` })),
    ...patrimonios.map(r => ({ ...r, url: `/patrimonio/${r.id}` })),
    ...eventos.map(r => ({ ...r, url: `/evento/${r.id}` })),
  ];

  res.json(results);
});

module.exports = router;
