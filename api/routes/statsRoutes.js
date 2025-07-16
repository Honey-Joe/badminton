const express = require('express');
const statsController = require('../controllers/statsController');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Admin-only routes
router.use(adminMiddleware.protect);

// Booking statistics
router.get('/bookings', statsController.getBookingStats);

// User statistics
router.get('/users', statsController.getUserStats);

// Combined statistics
router.get('/overview', statsController.getCombinedStats);

module.exports = router;