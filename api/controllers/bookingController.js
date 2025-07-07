const Booking = require('../models/Booking');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create a new booking
exports.createBooking = catchAsync(async (req, res, next) => {
  const { court, date, startTime, endTime, notes } = req.body;
  
  // Check for booking conflicts
  const isAvailable = await Booking.checkAvailability(
    court,
    new Date(startTime),
    new Date(endTime)
  );

  if (!isAvailable) {
    return next(new AppError('This time slot is already booked', 400));
  }

  const booking = await Booking.create({
    user: req.user.id,
    court,
    date: new Date(date),
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    notes
  });

  res.status(201).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// Get all bookings (admin only)
exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find().sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

// Get user's bookings
exports.getUserBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).sort('-startTime');

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: {
      bookings
    }
  });
});

// Get a single booking
exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check if user owns the booking or is admin
  if (booking.user.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this booking', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// Update a booking
exports.updateBooking = catchAsync(async (req, res, next) => {
  const { court, startTime, endTime, status, notes } = req.body;
  
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check ownership
  if (booking.user.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this booking', 403));
  }

  // Check for conflicts if changing time
  if (court || startTime || endTime) {
    const newCourt = court || booking.court;
    const newStartTime = startTime ? new Date(startTime) : booking.startTime;
    const newEndTime = endTime ? new Date(endTime) : booking.endTime;

    const isAvailable = await Booking.checkAvailability(
      newCourt,
      newStartTime,
      newEndTime,
      req.params.id // Exclude current booking from conflict check
    );

    if (!isAvailable) {
      return next(new AppError('This time slot is already booked', 400));
    }
  }

  // Update booking
  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    {
      court: court || booking.court,
      startTime: startTime ? new Date(startTime) : booking.startTime,
      endTime: endTime ? new Date(endTime) : booking.endTime,
      status: status || booking.status,
      notes: notes || booking.notes
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      booking: updatedBooking
    }
  });
});

// Cancel a booking
exports.cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check ownership
  if (booking.user.id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to cancel this booking', 403));
  }

  // Prevent cancelling completed bookings
  if (booking.status === 'completed') {
    return next(new AppError('Completed bookings cannot be cancelled', 400));
  }

  booking.status = 'cancelled';
  await booking.save();

  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

// Check availability
exports.checkAvailability = catchAsync(async (req, res, next) => {
  const { court, startTime, endTime } = req.body;

  if (!court || !startTime || !endTime) {
    return next(new AppError('Please provide court, startTime and endTime', 400));
  }

  const isAvailable = await Booking.checkAvailability(
    court,
    new Date(startTime),
    new Date(endTime)
  );

  res.status(200).json({
    status: 'success',
    data: {
      available: isAvailable
    }
  });
});