const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const warrantyRoutes = require('./routes/warranty');
const adminRoutes = require('./routes/admin');

const port = process.env.PORT || 5000;

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://tangerine-pegasus-a4a9c4.netlify.app',
    'https://topmobile.store'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// RENDA E SAKTË:
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/warranty', warrantyRoutes); // KJO E TRETA, PARAPARA
app.use('/api/admin', adminRoutes); // KJO PAS!


app.get('/', (req, res) => res.send('API is running 🚀'));
app.listen(port, () => console.log(`Server started on port ${port}`));
