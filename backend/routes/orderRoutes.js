const express = require('express');
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  cancelOrder,
  returnOrder,
  updateOrderToDelivered,
  updateOrderStatus,
  submitRefundRequest
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, authorize('admin'), getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/pay').put(protect, updateOrderToPaid);

router.route('/:id/cancel').put(protect, cancelOrder);

router.route('/:id/return').put(protect, returnOrder);

router.route('/:id/refund-request').post(protect, submitRefundRequest);

router.route('/:id/deliver').put(protect, authorize('admin'), updateOrderToDelivered);

router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;
