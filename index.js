const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products'); // ose routes tjera

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',           // për development
    'https://topmobile.vercel.app',    // për prodhim
    'https://backendd-t-production.up.railway.app' // opsional
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => res.send('API is running 🚀'));

app.listen(5000, () => console.log('Server started on port 5000'));
