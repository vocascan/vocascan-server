const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

// Check for Authorization header and add user attribute to request object
const AdminMiddleware = catchAsync(async (req, _res, next) => {
  // Break if no Authorization header is set
  const role = await req.user.getRole();

  if (role.adminRights) {
    return next();
  }

  throw new ApiError(httpStatus.FORBIDDEN, 'user is not an admin');
});

module.exports = AdminMiddleware;
