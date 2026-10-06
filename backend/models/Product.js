const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description can not be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Men', 'Women', 'Kids', 'Unisex']
  },
  availableColors: [{
    name: String,
    hexCode: String
  }],
  availableSizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }],
  images: [{
    type: String // URLs to images
  }],
  isCustomizable: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);
