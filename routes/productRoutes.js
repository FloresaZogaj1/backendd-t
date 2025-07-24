const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Static routes para dynamic
// router.get("/all", verifyToken, isAdmin, productController.getAllAdmin); // vetem nese ke veçante per admin
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.post("/", verifyToken, isAdmin, productController.create);
router.put("/:id", verifyToken, isAdmin, productController.update);
router.delete("/:id", verifyToken, isAdmin, productController.remove);

module.exports = router;
