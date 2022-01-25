const { verifyJWT } = require('../utils');
const { User } = require('../../database');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const { tokenTypes } = require('../utils/constants');

// Check for Authorization header and add user attribute to request object
const ProtectMiddleware = catchAsync(async (req, _res, next) => {
  // Break if no Authorization header is set
  if (!req.header('Authorization')) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Not Authorized');
  }

  let payload = null;

  try {
    // Read userId from token
    const token = req.header('Authorization').split(' ')[1];
    payload = await verifyJWT(token, config.server.jwt_secret);

    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error();
    }
  } catch (err) {
    // Handle broken token
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid auth token');
  }

  // Get user from database
  const user = await User.findOne({
    where: {
      id: payload.id,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid auth token');
  }

  // Inject user into request object
  req.user = user;

  next();
});

module.exports = ProtectMiddleware;
