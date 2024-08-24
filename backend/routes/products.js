const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET request to fetch all products from MongoDB
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();  // Fetch all products from MongoDB
    res.json(products);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST request to add a new product
router.post('/', async (req, res) => {
  const { name, price, imageUrl, description, tags } = req.body;

  const newProduct = new Product({
    name,
    price,
    imageUrl,
    description,
    tags,
  });

  try {
    const savedProduct = await newProduct.save();  // Save product to MongoDB
    res.json(savedProduct);
  } catch (err) {
    res.status(500).send('Failed to add product');
  }
});

module.exports = router;
