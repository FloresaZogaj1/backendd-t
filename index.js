const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Krijo lidhjen me databazë
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Testo lidhjen me databazë
db.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');
});

// Rute testuese
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funksional!' });
});

// Merr të gjithë produktet
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Merr një produkt të vetëm (by id)
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id=?', [id], (err, results) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
});

// Shto produkt të ri
app.post('/api/products', (req, res) => {
  const { name, price, description } = req.body;
  db.query(
    'INSERT INTO products (name, price, description) VALUES (?, ?, ?)',
    [name, price, description],
    (err, result) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: result.insertId, name, price, description });
    }
  );
});

// Përditëso produkt
app.put('/api/products/:id', (req, res) => {
  const { name, price, description } = req.body;
  const { id } = req.params;
  db.query(
    'UPDATE products SET name=?, price=?, description=? WHERE id=?',
    [name, price, description, id],
    (err) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id, name, price, description });
    }
  );
});

// Fshi produkt
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id=?', [id], (err) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Product deleted', id });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
