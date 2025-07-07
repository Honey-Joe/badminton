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
      validator: function(date) {
        return date >= new Date().setHours(0,0,0,0);
      },
      message: 'Booking date must be today or in the future'
    }
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide end time'],
    validate: {
      validator: function(endTime) {
        return endTime > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  duration: { // in minutes (auto-calculated)
    type: Number,
    default: function() {
      return (this.endTime - this.startTime) / (1000 * 60);
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  }
});

// Compound index to prevent overlapping bookings
bookingSchema.index({ 
  court: 1, 
  startTime: 1, 
  endTime: 1 
}, { 
  unique: true 
});

// Validation for business hours (6AM to 10PM)
bookingSchema.pre('save', function(next) {
  const startHour = this.startTime.getHours();
  const endHour = this.endTime.getHours();
  
  if (startHour < 1 || endHour > 23) {
    return next(new AppError('Bookings only allowed between 1AM and 11PM', 400));
  }

  // Minimum booking duration (30 minutes)
  if (this.duration < 30) {
    return next(new AppError('Minimum booking duration is 30 minutes', 400));
  }

  // Maximum booking duration (3 hours)
  if (this.duration > 180) {
    return next(new AppError('Maximum booking duration is 3 hours', 400));
  }

  next();
});

// Prevent past bookings
bookingSchema.pre('save', function(next) {
  if (this.startTime < new Date()) {
    return next(new AppError('Cannot book time slots in the past', 400));
  }
  next();
});

// Auto-populate user data
bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username email phone'
  });
  next();
});

// Static method to check availability
bookingSchema.statics.checkAvailability = async function(court, startTime, endTime, bookingId = null) {
  const conflict = await this.findOne({
    court,
    $or: [
      { 
        startTime: { $lt: endTime }, 
        endTime: { $gt: startTime } 
      }
    ],
    _id: { $ne: bookingId } // Exclude current booking when updating
  });

  return !conflict;
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;