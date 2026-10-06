const express = require('express');
const { createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/razorpay', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

router.get('/config', (req, res) => {
  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey123456'
  });
});

module.exports = router;
