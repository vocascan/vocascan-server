class ApiError extends Error {
  constructor(statusCode, message, field, isOperational = true, stack = '') {
    super(message);
    this.field = field;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
