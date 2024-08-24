const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    league: {
      type: String,
      enum: ['Ligue 1', 'Bundesliga', 'Serie A', 'La Liga', 'Premier League', 'Other Leagues'],
      required: true,
    },
    manufacturer: {
      type: String,
      enum: ['Adidas', 'Nike', 'Castore', 'Umbro', 'Puma', "O'Neills", 'Other Manufacturers'],
      required: true,
    },
    europeanCompetition: {
      type: String,
      enum: ['Champions League', 'Europa League', 'Conference League', 'No European Football'],
      required: true,
    },
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
