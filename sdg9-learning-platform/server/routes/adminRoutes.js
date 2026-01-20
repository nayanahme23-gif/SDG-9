const express = require('express');
const { getUsers, approveUser } = require('../controllers/adminController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

router.route('/users')
    .get(getUsers);

router.route('/users/:id/approve')
    .put(approveUser);

module.exports = router;
