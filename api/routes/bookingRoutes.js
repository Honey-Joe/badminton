const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require("../middleware/adminMiddleware");
const { updateCompletedBookings } = require('../services/cronJobs');

const router = express.Router();

router.get('/update-bookings', async (req, res) => {
  try {
    await updateCompletedBookings();
    res.status(200).json({ message: 'Bookings updated' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

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