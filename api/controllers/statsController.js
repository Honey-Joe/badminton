const Booking = require('../models/Booking');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Helper function to get the last N months
const getLastMonths = (months) => {
  const dates = [];
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    dates.push(date);
  }
  return dates;
};

exports.getBookingStats = catchAsync(async (req, res, next) => {
  // Calculate booking statistics
  const stats = await Booking.aggregate([
    {
      $match: { status: 'completed' }
    },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$price' },
        avgBookingDuration: { $avg: '$duration' }
      }
    },
    {
      $project: {
        _id: 0,
        totalBookings: 1,
        totalRevenue: 1,
        avgBookingDuration: 1
      }
    }
  ]);

  // Calculate bookings by court
  const bookingsByCourt = await Booking.aggregate([
    {
      $match: { status: 'completed' }
    },
    {
      $group: {
        _id: '$court',
        count: { $sum: 1 },
        revenue: { $sum: '$price' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Calculate bookings by month (last 6 months)
  const last6Months = getLastMonths(6);
  const bookingsByMonth = await Booking.aggregate([
    {
      $match: { 
        status: 'completed',
        createdAt: { $gte: last6Months[0] }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
        revenue: { $sum: '$price' }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);

  // Fill in missing months with zero values
  const completeBookingsByMonth = last6Months.map((date, i) => {
    const month = date.getMonth() + 1;
    const found = bookingsByMonth.find(item => item._id === month);
    return found || { _id: month, count: 0, revenue: 0 };
  });

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0] || { totalBookings: 0, totalRevenue: 0, avgBookingDuration: 0 },
      bookingsByCourt,
      bookingsByMonth: completeBookingsByMonth
    }
  });
});

exports.getUserStats = catchAsync(async (req, res, next) => {
  // Calculate user statistics
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [{ $gt: ['$lastActive', new Date(Date.now() - 30*24*60*60*1000)] }, 1, 0]
          }
        },
        adminUsers: {
          $sum: {
            $cond: [{ $eq: ['$role', 'admin'] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalUsers: 1,
        activeUsers: 1,
        adminUsers: 1
      }
    }
  ]);

  // Calculate user growth by month (last 6 months)
  const last6Months = getLastMonths(6);
  const usersByMonth = await User.aggregate([
    {
      $match: { 
        createdAt: { $gte: last6Months[0] }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);

  // Fill in missing months with zero values
  const completeUsersByMonth = last6Months.map((date, i) => {
    const month = date.getMonth() + 1;
    const found = usersByMonth.find(item => item._id === month);
    return found || { _id: month, count: 0 };
  });

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0] || { totalUsers: 0, activeUsers: 0, adminUsers: 0 },
      usersByMonth: completeUsersByMonth
    }
  });
});

exports.getCombinedStats = catchAsync(async (req, res, next) => {
  // Get both booking and user stats in parallel
  const [bookingStats, userStats] = await Promise.all([
    Booking.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$price' },
          avgBookingDuration: { $avg: '$duration' }
        }
      }
    ]),
    User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: {
              $cond: [{ $gt: ['$lastActive', new Date(Date.now() - 30*24*60*60*1000)] }, 1, 0]
            }
          },
          adminUsers: {
            $sum: {
              $cond: [{ $eq: ['$role', 'admin'] }, 1, 0]
            }
          }
        }
      }
    ])
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      bookings: {
        stats: bookingStats[0] || { totalBookings: 0, totalRevenue: 0, avgBookingDuration: 0 }
      },
      users: {
        stats: userStats[0] || { totalUsers: 0, activeUsers: 0, adminUsers: 0 }
      }
    }
  });
});