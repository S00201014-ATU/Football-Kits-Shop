const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Use CORS to allow requests from different origins
app.use(cors());

// Use the MongoDB connection string from .env
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUri, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Middleware to parse JSON requests
app.use(express.json());

// Import the products route
const productsRoute = require('./routes/products');
app.use('/api/products', productsRoute);

// Handle the root route
app.get('/', (req, res) => {
  res.send('Welcome to the Football Kits API');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
