const express = require('express');
const router = express.Router();
const { register, login, googleLogin } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin); // Ky është endpointi për Google Login

module.exports = router;
