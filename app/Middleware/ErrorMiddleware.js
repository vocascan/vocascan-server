const httpStatus = require('http-status');
const { Sequelize } = require('sequelize');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const errorConverter = (err, _req, _res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    let statusCode;

    // handle every possible database error
    if (error.statusCode) {
      statusCode = error.statusCode;
    } else if (
      error instanceof Sequelize.ForeignKeyConstraintError ||
      error instanceof Sequelize.InstanceError ||
      error instanceof Sequelize.UniqueConstraintError
    ) {
      statusCode = httpStatus.CONFLICT;
    } else if (error instanceof Sequelize.ConnectionError || error instanceof Sequelize.TimeoutError) {
      statusCode = httpStatus.SERVICE_UNAVAILABLE;
    } else if (error instanceof Sequelize.DatabaseError || error instanceof Sequelize.ValidationError) {
      statusCode = httpStatus.BAD_REQUEST;
    } else {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  const { statusCode, field, message } = err;

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    ...(field ? { field: field } : null),
    message,
    ...(process.env.DEBUG === 'true' && { stack: err.stack }),
  };

  if (process.env.DEBUG === 'true' || response.code >= 500) {
    logger.error(err);
  }

  return res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
