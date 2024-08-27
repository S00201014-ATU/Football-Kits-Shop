const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// Fetch user's cart
router.get('/cart', async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  res.json(cart ? cart.items : []);
});

// Add item to cart
router.post('/cart', async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex !== -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.status(200).json(cart);
});


module.exports = router;
