const db = require('../models/db');

// GET all products
exports.getAll = (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

// GET product by id
exports.getById = (req, res) => {
  db.query('SELECT * FROM products WHERE id=?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!results.length) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
};

// POST create product
exports.create = (req, res) => {
  const { name, price, description } = req.body;
  db.query('INSERT INTO products (name, price, description) VALUES (?, ?, ?)', [name, price, description], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ id: result.insertId, name, price, description });
  });
};

// PUT update product
exports.update = (req, res) => {
  const { name, price, description } = req.body;
  db.query('UPDATE products SET name=?, price=?, description=? WHERE id=?', [name, price, description, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ id: req.params.id, name, price, description });
  });
};

// DELETE product
exports.remove = (req, res) => {
  db.query('DELETE FROM products WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Product deleted', id: req.params.id });
  });
};
