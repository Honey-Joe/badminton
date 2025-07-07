class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // This is to distinguish operational errors from programming errors

    // This prevents the constructor call from appearing in the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;