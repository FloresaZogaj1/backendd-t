const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.get('/', verifyToken, isAdmin, (req, res) => {
  res.json({ msg: "Kjo faqe është e mbrojtur, vetëm për admin." });
});

module.exports = router;
