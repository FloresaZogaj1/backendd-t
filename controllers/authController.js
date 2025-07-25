const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM users_new WHERE email = ?', [email]);
    if (user.length > 0) return res.status(400).json({ msg: 'Email ekziston!' });

    // Gjej id-n me te madh ekzistues
    const [last] = await db.query('SELECT MAX(id) as maxId FROM users_new');
    const newId = (last[0].maxId || 0) + 1;

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users_new (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [newId, name, email, hashedPassword, 'user']
    );
    res.json({ msg: 'Regjistrimi me sukses!' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM users_new WHERE email = ?', [email]);
    if (user.length === 0) return res.status(400).json({ msg: 'Email ose password gabim!' });

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) return res.status(400).json({ msg: 'Email ose password gabim!' });

    const token = jwt.sign({ id: user[0].id, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user[0].id, name: user[0].name, email: user[0].email, role: user[0].role } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// =================== GOOGLE LOGIN ===================
exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    let [user] = await db.query('SELECT * FROM users_new WHERE email = ?', [email]);
    let id;
    if (user.length === 0) {
      // Shto user të ri nëse nuk ekziston
      const [last] = await db.query('SELECT MAX(id) as maxId FROM users_new');
      const newId = (last[0].maxId || 0) + 1;
      await db.query(
        'INSERT INTO users_new (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [newId, name, email, '', 'user']
      );
      id = newId;
    } else {
      id = user[0].id;
    }

    const jwtToken = jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: { id, email, name } });
  } catch (err) {
    res.status(400).json({ msg: 'Google Login dështoi', error: err.message });
  }
};
