const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ REGISTER
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM users_new WHERE email = ?', [email]);
    if (user.length > 0) return res.status(400).json({ msg: 'Email ekziston!' });

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

// ✅ LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Received login data:", email, password); // 👈
  try {
    const [user] = await db.query('SELECT * FROM users_new WHERE email = ?', [email]);
    if (user.length === 0) {
      console.log("User not found");
      return res.status(400).json({ msg: 'Email ose password gabim!' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ msg: 'Email ose password gabim!' });
    }

    const token = jwt.sign(
      { id: user[0].id, email: user[0].email, isAdmin: user[0].role === 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role,
        isAdmin: user[0].role === 'admin'
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ GOOGLE LOGIN
const googleLogin = async (req, res) => {
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
    let role;
    if (user.length === 0) {
      const [last] = await db.query('SELECT MAX(id) as maxId FROM users_new');
      const newId = (last[0].maxId || 0) + 1;
      role = 'user';
      await db.query(
        'INSERT INTO users_new (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [newId, name, email, '', role]
      );
      id = newId;
    } else {
      id = user[0].id;
      role = user[0].role;
    }

    const jwtToken = jwt.sign(
      { id, email, isAdmin: role === 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: jwtToken,
      user: {
        id,
        email,
        name,
        role,
        isAdmin: role === 'admin'
      }
    });
  } catch (err) {
    res.status(400).json({ msg: 'Google Login dështoi', error: err.message });
  }
};

// ✅ EKSPORTO TË TRE
module.exports = {
  register,
  login,
  googleLogin
};
