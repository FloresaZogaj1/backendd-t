const express = require("express");
const router = express.Router();
const orderCtrl = require("../controllers/orderController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Static routes BEFORE param routes!
router.get("/all", verifyToken, isAdmin, orderCtrl.getAllOrders);
 router.get("/user", verifyToken, orderCtrl.getUserOrders);
 router.post("/", verifyToken, orderCtrl.createOrder);

// router.get("/:id", protect, orderCtrl.getOrderById); // Nëse të duhet byId më vonë

module.exports = router;
