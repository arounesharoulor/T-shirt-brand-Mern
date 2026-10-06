const Review = require('../models/Review');

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    req.body.userName = req.user.name;

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
