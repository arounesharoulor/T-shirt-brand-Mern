const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate coupon
// @route   GET /api/coupons/:code
// @access  Private
exports.validateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ 
      code: req.params.code.toUpperCase(),
      isActive: true
    });
    
    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Invalid or expired coupon code' });
    }
    
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Coupon not found' });
    }
    await coupon.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
