// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1) Lista e origin‐eve që lejohen
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://FRONTEND-IMLIVE.vercel.app'  // ndrysho me domain‐in tënd të prod
];

// 2) Middleware për CORS (duhet PARA express.json() dhe PARA rrugëve)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    // reflekto origin‐in vetëm nëse është në listë
    res.header('Access-Control-Allow-Origin', origin);
  }
  // lejo credential‐at
  res.header('Access-Control-Allow-Credentials', 'true');
  // lejo këto headers
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  // lejo këto metoda
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  // për OPTIONS (preflight) përgjigju menjëherë
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// 3) rrugët e tua  
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funksional!' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
