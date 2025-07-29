const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/auth");
const productsController = require("../controllers/productsController");

// CRUD Produktet
router.get("/products", verifyToken, isAdmin, productsController.getAllProducts);
router.get("/products/:id", verifyToken, isAdmin, productsController.getProductById);
router.post("/products", verifyToken, isAdmin, productsController.createProduct);
router.put("/products/:id", verifyToken, isAdmin, productsController.updateProduct);
router.delete("/products/:id", verifyToken, isAdmin, productsController.deleteProduct);

// Orders - Shembull i thjeshtë (duhet ta krijosh/freskosh ordersController)
const db = require("../db");
// Shfaq të gjitha porositë
router.get("/orders", verifyToken, isAdmin, async (req, res) => {
  try {
    const [orders] = await db.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
// Ndrysho statusin e porosisë
router.patch("/orders/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await db.query("UPDATE orders SET status=? WHERE id=?", [status, req.params.id]);
    res.json({ msg: "Statusi i porosisë u ndryshua me sukses!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
router.get("/users_new", verifyToken, isAdmin, async (req, res) => { 
  try {
    const [users] = await db.query("SELECT id, name, email, role FROM users_new ORDER BY id DESC");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// Statistikat
router.get("/stats", verifyToken, isAdmin, async (req, res) => {
  try {
    const [[{ count: totalProducts }]] = await db.query("SELECT COUNT(*) as count FROM product_new");
    const [[{ count: totalOrders }]] = await db.query("SELECT COUNT(*) as count FROM orders");
    const [[{ total: totalSales }]] = await db.query("SELECT SUM(total) as total FROM orders");
    const [[{ count: totalUsers }]] = await db.query("SELECT COUNT(*) as count FROM users");
    res.json({
      totalProducts,
      totalOrders,
      totalSales: totalSales || 0,
      totalUsers
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Warranty endpoints for admin
router.get("/warranty", verifyToken, isAdmin, async (req, res) => {
  try {
    const [warranties] = await db.query('SELECT * FROM warranty ORDER BY id DESC');
    res.json(warranties);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/warranty", verifyToken, async (req, res) => {
  const {
    emri, mbiemri, telefoni, email, marka, modeli, imei, softInfo,
    kohezgjatja, cmimi, data, komente, llojiPageses, status
  } = req.body;

  try {
    await db.query(
      `INSERT INTO warranty (emri, mbiemri, telefoni, email, marka, modeli, imei, softInfo, kohezgjatja, cmimi, data, komente, llojiPageses, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [emri, mbiemri, telefoni, email, marka, modeli, imei, softInfo, kohezgjatja, cmimi, data, komente, llojiPageses, status || 'printed']
    );
    res.json({ msg: "Garancioni u shtua me sukses!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/warranty/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM warranty WHERE id = ?', [req.params.id]);
    res.json({ msg: "Garancioni u fshi me sukses!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;