const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Load dotenv package
const app = express();

// Load environment variables from .env file
dotenv.config();

// Use the MongoDB connection string from .env
const mongoUri = process.env.MONGO_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUri, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
