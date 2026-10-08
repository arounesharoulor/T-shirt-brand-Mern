const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getUsers } = require('../controllers/userController');

router.route('/').get(protect, authorize('admin'), getUsers);

module.exports = router;
