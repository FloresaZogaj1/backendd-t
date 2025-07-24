// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'ndonjë_fjalëkalim_sfhetë';

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Të dhënat mungojnë!' });
  }

  // Kontrollo nëse email-i ekziston
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Gabim DB' });
    if (results.length) {
      return res.status(409).json({ message: 'Email-i ekziston!' });
    }

    // Hash fjalëkalimin
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // Shto user
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Gabim gjatë regjistrimit' });
        res.status(201).json({ message: 'Regjistrim i suksesshëm!' });
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dhe fjalëkalim kërkohen!' });
  }

  // Gjej user
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Gabim DB' });
    if (!results.length) {
      return res.status(401).json({ message: 'Email ose fjalëkalim gabim!' });
    }
    const user = results[0];

    // Komparo fjalëkalimet
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ose fjalëkalim gabim!' });
    }

    // Gjenero JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login i suksesshëm!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  });
};
