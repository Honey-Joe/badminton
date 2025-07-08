const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

router.post('/check-availability', bookingController.checkAvailability);
router.post('/check-multiple-availabilities', bookingController.checkMultipleAvailabilities)
router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);
router.get('/:id', bookingController.getBooking);
router.patch('/:id', bookingController.updateBooking);
router.delete('/:id/cancel', bookingController.cancelBooking);

// Admin-only routes
router.use(authMiddleware.restrictTo('admin'));

router.get('/', bookingController.getAllBookings);

module.exports = router;