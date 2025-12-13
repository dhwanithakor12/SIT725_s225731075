const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const DB_FILE = path.join(__dirname, 'data.db');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to get DB
function openDb() {
  return new sqlite3.Database(DB_FILE);
}

// GET all inventory items
app.get('/api/items', (req, res) => {
  const db = openDb();
  db.all('SELECT * FROM inventory ORDER BY item_id DESC', [], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET single item
app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = openDb();
  db.get('SELECT * FROM inventory WHERE item_id = ?', [id], (err, row) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Item not found' });
    res.json(row);
  });
});

// POST create new item
app.post('/api/items', (req, res) => {
  const { item_name, category, quantity, location, received_on, supplier_email } = req.body;
  if (!item_name || !category || quantity == null || !location || !received_on) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const db = openDb();
  const sql = `INSERT INTO inventory (item_name, category, quantity, location, received_on, supplier_email) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [item_name, category, quantity, location, received_on, supplier_email || null], function(err) {
    if (err) {
      db.close();
      return res.status(500).json({ error: err.message });
    }
    const createdId = this.lastID;
    db.get('SELECT * FROM inventory WHERE item_id = ?', [createdId], (err2, row) => {
      db.close();
      if (err2) return res.status(500).json({ error: err2.message });
      res.status(201).json(row);
    });
  });
});

// PUT update item
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { item_name, category, quantity, location, received_on, supplier_email } = req.body;
  const db = openDb();
  const sql = `UPDATE inventory SET item_name = ?, category = ?, quantity = ?, location = ?, received_on = ?, supplier_email = ? WHERE item_id = ?`;
  db.run(sql, [item_name, category, quantity, location, received_on, supplier_email, id], function(err) {
    if (err) {
      db.close();
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      db.close();
      return res.status(404).json({ error: 'Item not found' });
    }
    db.get('SELECT * FROM inventory WHERE item_id = ?', [id], (err2, row) => {
      db.close();
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(row);
    });
  });
});

// DELETE item
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = openDb();
  db.run('DELETE FROM inventory WHERE item_id = ?', [id], function(err) {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  });
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
