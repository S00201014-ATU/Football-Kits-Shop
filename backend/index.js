const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Product = require('./models/Product');
const productsRoute = require('./routes/products');
const app = express();

// Load environment variables from .env file
dotenv.config();

// Use CORS to allow requests from different origins
app.use(cors());

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

// Handle the root route
app.get('/', (req, res) => {
  res.send('Welcome to the Football Kits API');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
