const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
// In production, these should be in .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey123456',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecret1234567890',
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay
// @access  Private
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`,
    };

    let order;

    // If using the dummy key, Razorpay will throw 401. Let's mock it for dev.
    if (process.env.RAZORPAY_KEY_ID === undefined || process.env.RAZORPAY_KEY_ID === 'rzp_test_dummykey123456') {
      order = {
        id: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created'
      };
    } else {
      order = await razorpay.orders.create(options);
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ success: false, error: 'Failed to create Razorpay order' });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/razorpay/verify
// @access  Private
exports.verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummysecret1234567890';
    
    // Skip signature check if using mock data
    if (!razorpay_order_id.startsWith('order_mock_')) {
      const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ success: false, error: 'Payment verification failed' });
      }
    }

    // Update order status in DB
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'success',
          update_time: Date.now(),
        };
        await order.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    next(error);
  }
};
