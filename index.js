const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const productRoutes = require('./routes/products'); // Kujdes: products, jo product

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://topmobile.vercel.app', // nëse ke deploy, shto edhe domainin e frontend-it
  ],
  credentials: true // nëse përdor cookie për auth
}));
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes); // Po ashtu products

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
