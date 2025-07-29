const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Merr të gjitha garancionet (vetëm admin)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const [warranties] = await db.query('SELECT * FROM warranty ORDER BY id DESC');
    res.json(warranties);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Shto një garancion të ri (mund edhe klienti)
router.post('/', verifyToken, async (req, res) => {
  const {
    emri, mbiemri, telefoni, email, marka, modeli, imei, softInfo,
    kohezgjatja, cmimi, data, komente, llojiPageses, status // status shtuar!
  } = req.body;

  try {
    await db.query(
      `INSERT INTO warranty (emri, mbiemri, telefoni, email, marka, modeli, imei, softInfo, kohezgjatja, cmimi, data, komente, llojiPageses, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [emri, mbiemri, telefoni, email, marka, modeli, imei, softInfo, kohezgjatja, cmimi, data, komente, llojiPageses, status || 'printed']
    );
    res.json({ msg: "Garancioni u shtua me sukses!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Fshi garancion (opsionale, vetem admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM warranty WHERE id = ?', [req.params.id]);
    res.json({ msg: "Garancioni u fshi me sukses!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
