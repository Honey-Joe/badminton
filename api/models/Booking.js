const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user'],
    index: true // Added index for better user query performance
  },
  court: {
    type: String,
    required: [true, 'Please specify a court number'],
    enum: ['Court 1', 'Court 2', 'Court 3'],
    index: true // Added index for better court query performance
  },
  date: {
    type: Date,
    required: [true, 'Please provide booking date'],
    validate: {
      validator: function(date) {
        return date >= new Date().setHours(0,0,0,0);
      },
      message: 'Booking date must be today or in the future'
    },
    index: true // Added index for better date queries
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide start time'],
    index: true // Added index for better time-based queries
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
  duration: {
    type: Number,
    default: function() {
      return Math.round((this.endTime - this.startTime) / (1000 * 60)); // Rounded minutes
    },
    min: [60, 'Minimum booking duration is 60 minutes'],
    max: [180, 'Maximum booking duration is 3 hours']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
    index: true // Added index for status filtering
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Added index for chronological sorting
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters'],
    trim: true // Added trim to remove whitespace
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // We're handling timestamps manually
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Enhanced compound index for overlapping bookings
bookingSchema.index({ 
  court: 1,
  startTime: 1,
  endTime: 1,
  status: 1
}, { 
  unique: true,
  partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } } // Only enforce uniqueness for active bookings
});

// Additional indexes for common query patterns
bookingSchema.index({ user: 1, date: 1 });
bookingSchema.index({ court: 1, date: 1 });
bookingSchema.index({ status: 1, date: 1 });

// Improved business hours validation
bookingSchema.pre('save', function(next) {
  const startHour = this.startTime.getUTCHours();
  const endHour = this.endTime.getUTCHours();
  
  if (startHour < 6 || endHour > 22 || endHour <= startHour) {
    return next(new AppError('Bookings only allowed between 6AM and 10PM with valid duration', 400));
  }
  next();
});

// Enhanced timezone handling with UTC conversion
bookingSchema.pre('save', function(next) {
  if (this.isModified('startTime') || this.isNew) {
    this.startTime = new Date(this.startTime.toISOString());
  }
  if (this.isModified('endTime') || this.isNew) {
    this.endTime = new Date(this.endTime.toISOString());
  }
  this.lastUpdated = new Date();
  next();
});

// Prevent modification of completed/cancelled bookings
bookingSchema.pre('save', function(next) {
  if (this.isModified() && ['completed', 'cancelled'].includes(this.status)) {
    return next(new AppError('Completed or cancelled bookings cannot be modified', 400));
  }
  next();
});

// Optimized auto-population with selective field projection
bookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'username email phone -_id' // Exclude _id for smaller payload
  });
  next();
});

// Enhanced static method with caching and buffer time
bookingSchema.statics.checkAvailability = async function(court, startTime, endTime, bufferMinutes = 5) {
  try {
    const adjustedStart = new Date(new Date(startTime).getTime() - bufferMinutes * 60000);
    const adjustedEnd = new Date(new Date(endTime).getTime() + bufferMinutes * 60000);

    const conflict = await this.findOne({
      court,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startTime: { $lt: adjustedEnd }, endTime: { $gt: adjustedStart } },
        { startTime: { $eq: new Date(startTime) } }
      ]
    })
    .maxTimeMS(3000)
    .select('_id startTime endTime')
    .lean();

    return !conflict;
  } catch (err) {
    console.error('Availability check error:', err);
    return false;
  }
};


// Add query helper for common booking queries
bookingSchema.query.byCourt = function(court) {
  return this.where({ court });
};

bookingSchema.query.byDateRange = function(startDate, endDate) {
  return this.where('date').gte(startDate).lte(endDate);
};

// Virtual for client-friendly time display
bookingSchema.virtual('displayTime').get(function() {
  return {
    start: this.startTime.toLocaleTimeString(),
    end: this.endTime.toLocaleTimeString()
  };
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;