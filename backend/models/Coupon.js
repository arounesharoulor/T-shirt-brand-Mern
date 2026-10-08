const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a coupon code'],
    unique: true,
    trim: true,
    uppercase: true
  },
  discountPercent: {
    type: Number,
    required: [true, 'Please add a discount percentage'],
    min: 1,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Coupon', CouponSchema);
