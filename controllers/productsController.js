const db = require('../db');

// Merr të gjitha produktet
exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM product_new');
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Merr produkt me ID
exports.getProductById = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM product_new WHERE id = ?', [req.params.id]);
    if (products.length === 0) return res.status(404).json({ msg: "Produkt nuk u gjet!" });
    res.json(products[0]);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Krijo produkt të ri
exports.createProduct = async (req, res) => {
  const { name, price, description, image, category } = req.body;
  try {
    // Gjej id-n më të madhe ekzistuese
    const [last] = await db.query('SELECT MAX(id) as maxId FROM product_new');
    const newId = (last[0].maxId || 0) + 1;
    await db.query(
      'INSERT INTO product_new (id, name, price, description, image, category) VALUES (?, ?, ?, ?, ?, ?)',
      [newId, name, price, description, image, category]
    );
    res.json({ msg: "Produkti u shtua me sukses!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Ndrysho produkt
exports.updateProduct = async (req, res) => {
  const { name, price, description, image, category } = req.body;
  try {
    await db.query(
      'UPDATE product_new SET name=?, price=?, description=?, image=?, category=? WHERE id=?',
      [name, price, description, image, category, req.params.id]
    );
    res.json({ msg: "Produkti u ndryshua me sukses!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Fshi produkt
exports.deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM product_new WHERE id=?', [req.params.id]);
    res.json({ msg: "Produkti u fshi me sukses!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
