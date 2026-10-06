const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  product: {
    type: String, // String to match frontend hardcoded IDs, otherwise ObjectId
    required: [true, 'Please provide a product ID']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
