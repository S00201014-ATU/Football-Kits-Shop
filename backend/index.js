const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Product = require('./models/Product');
const productsRoute = require('./routes/products');
const usersRoute = require('./routes/users');
const ordersRoute = require('./routes/orders');
const checkoutRoute = require('./routes/checkout');
const cartRoute =  require('./routes/cart');
const app = express();

// Load environment variables from .env file
dotenv.config();

// Use CORS to allow requests from different origins
app.use(cors({
  origin:['http://localhost:4200/'],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// Use the MongoDB connection string from .env
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUri, {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/api/products', productsRoute);
app.use('/api/users', usersRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/checkout', checkoutRoute);
app.use('/api/cart', cartRoute);


// Handle the root route
app.get('/', (req, res) => {
  res.send('Welcome to the Football Kits API');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
