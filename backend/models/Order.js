const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  forename: { type: String, required: true },
  surname: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  town: { type: String, required: true },
  country: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  cartItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
