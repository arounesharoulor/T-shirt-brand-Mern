const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getUsers, deleteUser } = require('../controllers/userController');

router.route('/').get(protect, authorize('admin'), getUsers);
router.route('/:id').delete(protect, authorize('admin'), deleteUser);

module.exports = router;
