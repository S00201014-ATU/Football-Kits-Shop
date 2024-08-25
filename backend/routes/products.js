const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET request to fetch all products from MongoDB
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
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
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err });
  }
});

// GET request to fetch a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err });
  }
});


// PUT request to update an existing product
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
});

module.exports = router;
