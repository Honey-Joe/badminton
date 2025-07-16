const Admin = require('../models/Admin');
const ErrorResponse = require('../utils/appError');
const asyncHandler = require('../utils/catchAsync');
const jwt = require("jsonwebtoken");

// @desc    Register admin
// @route   POST /api/v1/auth/admin/register
// @access  Private (Superadmin only)
exports.registerAdmin = asyncHandler(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  // Check if the requester is a superadmin
  if (req.user.role !== 'superadmin') {
    return next(
      new ErrorResponse('Not authorized to create admin accounts', 401)
    );
  }

  // Create admin
  const admin = await Admin.create({
    username,
    email,
    password,
    role: role || 'admin'
  });

  sendTokenResponse(admin, 200, res);
});

// @desc    Login admin
// @route   POST /api/v1/auth/admin/login
// @access  Public
exports.loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for admin
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  createSendToken(admin, 200, res);
});

// @desc    Get current logged in admin
// @route   GET /api/v1/auth/admin/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: admin
  });
});

// @desc    Logout admin
// @route   GET /api/v1/auth/admin/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('jwt_admin', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: false
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: "30d"
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production'
  };
  
  res.cookie('jwt_admin', token, cookieOptions);
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

