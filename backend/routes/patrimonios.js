const express = require('express');
const { db } = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const { area_negocio, regiao } = req.query;
  let query = 'SELECT * FROM patrimonios';
  const params = [];
  const conditions = [];

  if (area_negocio) { conditions.push('area_negocio = ?'); params.push(area_negocio); }
  if (regiao) { conditions.push('regiao = ?'); params.push(regiao); }
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY nome ASC';

  const rows = db.prepare(query).all(...params);
  res.json(rows.map(parseGaleria));
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM patrimonios WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Património não encontrado' });
  res.json(parseGaleria(row));
});

router.post('/', authMiddleware, (req, res) => {
  const fields = buildFields(req.body);
  const result = db.prepare(`INSERT INTO patrimonios (${fields.cols}) VALUES (${fields.phs})`).run(...fields.vals);
  res.status(201).json(parseGaleria(db.prepare('SELECT * FROM patrimonios WHERE id = ?').get(result.lastInsertRowid)));
});

router.put('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM patrimonios WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Património não encontrado' });
  const fields = buildFields(req.body);
  db.prepare(`UPDATE patrimonios SET ${fields.sets}, updated_at=datetime('now') WHERE id=?`).run(...fields.vals, req.params.id);
  res.json(parseGaleria(db.prepare('SELECT * FROM patrimonios WHERE id = ?').get(req.params.id)));
});

router.delete('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM patrimonios WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Património não encontrado' });
  db.prepare('DELETE FROM patrimonios WHERE id = ?').run(req.params.id);
  res.json({ message: 'Eliminado' });
});

function parseGaleria(row) {
  if (row && row.galeria && typeof row.galeria === 'string') {
    try { row.galeria = JSON.parse(row.galeria); } catch { row.galeria = []; }
  }
  return row;
}

function buildFields(body) {
  const ALLOWED = ['nome','sigla','area_negocio','tipo','circuito','localizacao','regiao',
    'ano_entrada_servico','potencia_instalada_inicial','potencia_instalada_actual','niveis_tensao',
    'transformadores_potencia','barramento_inicial','barramento_final','capacidade_linha','condutor',
    'comprimento','tipo_postes','tipo_condutor','tipo_isoladores','cabo_guarda','foto','descricao','nota','galeria'];
  const cols = [], phs = [], sets = [], vals = [];
  for (const k of ALLOWED) {
    if (body[k] !== undefined) {
      let v = body[k];
      if (k === 'galeria' && typeof v !== 'string') v = JSON.stringify(v);
      cols.push(k); phs.push('?'); sets.push(`${k}=?`); vals.push(v);
    }
  }
  return { cols: cols.join(','), phs: phs.join(','), sets: sets.join(','), vals };
}

module.exports = router;
