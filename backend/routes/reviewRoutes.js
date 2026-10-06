const express = require('express');
const { getReviews, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, addReview);
router.route('/:productId').get(getReviews);

module.exports = router;
