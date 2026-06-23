const express = require('express');
const { db } = require('../db/database');

const router = express.Router();

function getOrCreate(type, id) {
  let row = db.prepare('SELECT * FROM metrics WHERE entity_type=? AND entity_id=?').get(type, id);
  if (!row) {
    db.prepare('INSERT OR IGNORE INTO metrics (entity_type, entity_id, views, likes) VALUES (?, ?, 0, 0)').run(type, id);
    row = db.prepare('SELECT * FROM metrics WHERE entity_type=? AND entity_id=?').get(type, id);
  }
  return row;
}

router.get('/:type/:id', (req, res) => {
  res.json(getOrCreate(req.params.type, req.params.id));
});

router.post('/:type/:id/view', (req, res) => {
  getOrCreate(req.params.type, req.params.id);
  db.prepare("UPDATE metrics SET views=views+1, updated_at=datetime('now') WHERE entity_type=? AND entity_id=?")
    .run(req.params.type, req.params.id);
  res.json(db.prepare('SELECT * FROM metrics WHERE entity_type=? AND entity_id=?').get(req.params.type, req.params.id));
});

router.post('/:type/:id/like', (req, res) => {
  getOrCreate(req.params.type, req.params.id);
  db.prepare("UPDATE metrics SET likes=likes+1, updated_at=datetime('now') WHERE entity_type=? AND entity_id=?")
    .run(req.params.type, req.params.id);
  res.json(db.prepare('SELECT * FROM metrics WHERE entity_type=? AND entity_id=?').get(req.params.type, req.params.id));
});

module.exports = router;
