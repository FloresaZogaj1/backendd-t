const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products'); // ose routes tjera
const port = process.env.PORT || 5000;

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

app.listen(port, () => console.log(`Server started on port ${port}`));
