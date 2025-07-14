const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Protect all routes after this middleware

router.post('/check-availability', authMiddleware.protect, bookingController.checkAvailability);
router.post('/check-multiple-availabilities', authMiddleware.protect, bookingController.checkMultipleAvailabilities)
router.post('/', authMiddleware.protect, bookingController.createBooking);
router.get('/my-bookings', authMiddleware.protect, bookingController.getUserBookings);
router.get('/:id', authMiddleware.protect, bookingController.getBooking);
router.patch('/:id', authMiddleware.protect, bookingController.updateBooking);
router.delete('/:id/cancel', authMiddleware.protect, bookingController.cancelBooking);

// Admin-only routes

router.get('/', adminMiddleware.protect, bookingController.getAllBookings);

module.exports = router;