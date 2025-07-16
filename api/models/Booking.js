const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  court: {
    type: String,
    required: [true, 'Please specify a court number'],
    enum: ['Court 1', 'Court 2', 'Court 3'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide booking date'],
    validate: {
      validator: function (date) {
        // Compare using UTC 00:00 of today
        const todayUTC = new Date();
        todayUTC.setUTCHours(0, 0, 0, 0);
        return date >= todayUTC;
      },
      message: 'Booking date must be today or in the future',
    },
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide start time'],
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide end time'],
    validate: {
      validator: function (endTime) {
        return endTime > this.startTime;
      },
      message: 'End time must be after start time',
    },
  },
  duration: {
    // in minutes (auto-calculated)
    type: Number,
    default: function () {
      return (this.endTime - this.startTime) / (1000 * 60);
    },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters'],
  },
});

// Compound index to prevent overlapping bookings
bookingSchema.index(
  { court: 1, startTime: 1, endTime: 1 },
  { unique: true }
);

// Validate business hours in IST (6AM to 10PM IST)
bookingSchema.pre('save', function (next) {
  const istOffsetMs = 5.5 * 60 * 60 * 1000;

  const startIST = new Date(this.startTime.getTime() + istOffsetMs);
  const endIST = new Date(this.endTime.getTime() + istOffsetMs);

  const startHourIST = startIST.getUTCHours(); // e.g. 6 for 6 AM IST
  const endHourIST = endIST.getUTCHours(); // e.g. 22 for 10 PM IST

  if (startHourIST < 6 || endHourIST > 22) {
    return next(
      new AppError('Bookings only allowed between 6AM and 10PM IST', 400)
    );
  }

  // Minimum duration: 60 minutes
  if (this.duration < 60) {
    return next(new AppError('Minimum booking duration is 60 minutes', 400));
  }

  // Maximum duration: 3 hours
  if (this.duration > 180) {
    return next(new AppError('Maximum booking duration is 3 hours', 400));
  }

  next();
});

// Prevent booking in the past
bookingSchema.pre('save', function (next) {
  if (this.startTime.getTime() < Date.now()) {
    return next(new AppError('Cannot book time slots in the past', 400));
  }
  next();
});

// Auto-populate user data
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'username email phone',
  });
  next();
});

// Static method to check availability
bookingSchema.statics.checkAvailability = async function (
  court,
  startTime,
  endTime
) {
  const conflict = await this.findOne({
    court,
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      },
    ],
  })
    .select('_id')
    .lean();

  return !conflict;
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
