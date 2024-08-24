const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET request to fetch all products from MongoDB
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();  // Fetch all products from MongoDB
    res.status(200).json(products);  // Respond with the fetched products
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err });
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
    res.status(201).json(savedProduct);  // Respond with the saved product
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err });
  }
});

module.exports = router;
