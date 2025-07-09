const cron = require('node-cron');
const Booking = require('../models/Booking'); // Import your Booking model

// Function to update completed bookings
const updateCompletedBookings = async () => {
  try {
    const now = new Date();
    
    // Find all bookings where endTime is in the past and status is not 'completed'
    const bookingsToUpdate = await Booking.find({
      endTime: { $lt: now },
      status: { $ne: 'completed' }
    });

    if (bookingsToUpdate.length > 0) {
      // Update all matching bookings
      const result = await Booking.updateMany(
        {
          _id: { $in: bookingsToUpdate.map(b => b._id) }
        },
        {
          $set: { status: 'completed' }
        }
      );

      console.log(`Updated ${result.modifiedCount} bookings to completed status`);
    } else {
      console.log('No bookings to mark as completed');
    }
  } catch (error) {
    console.error('Error updating completed bookings:', error);
  }
};

// Schedule the job to run every 30 minutes
const initCompletedBookingsJob = () => {
  // Runs at minute 0 and 30 past every hour
  cron.schedule('*/30 * * * *', () => {
    console.log('Running completed bookings check...');
    updateCompletedBookings();
  });
};

module.exports = {
  initCompletedBookingsJob
};