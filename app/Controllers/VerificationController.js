const httpStatus = require('http-status');
const config = require('../config/config/index.js');
const ApiError = require('../utils/ApiError.js');
const catchAsync = require('../utils/catchAsync.js');
const { verifyJWT, hashEmail } = require('../utils/index.js');
const { verifyUser, sendAccountVerificationEmail } = require('../Services/AuthServiceProvider.js');
const { tokenTypes } = require('../utils/constants.js');
const logger = require('../config/logger');

const requestEmailVerification = catchAsync(async (req, res) => {
  if (!config.service.email_confirm) {
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  if (req.user.emailVerified) {
    throw new ApiError(httpStatus.GONE, 'User is already verified');
  }

  if (hashEmail(req.body.email) !== req.user.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not valid', 'email');
  }

  await sendAccountVerificationEmail({ ...req.user.toJSON(), email: req.body.email });

  res.status(httpStatus.NO_CONTENT).end();
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.render('accountVerification', {
      status: httpStatus.BAD_REQUEST,
      error: 'No verification token provided',
    });
  }

  let payload = '';

  try {
    payload = await verifyJWT(token, config.server.jwt_secret);

    if (payload.type !== tokenTypes.VERIFY_EMAIL) {
      throw new Error();
    }
  } catch (error) {
    return res.render('accountVerification', {
      status: httpStatus.UNAUTHORIZED,
      error: 'No valid verification token provided',
    });
  }

  let user = null;

  try {
    user = await verifyUser({ id: payload.id });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.render('accountVerification', {
        status: httpStatus.GONE,
        error: 'User is already verified',
      });
    }

    logger.error(error);

    return res.render('accountVerification', {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    });
  }

  return res.render('accountVerification', {
    status: httpStatus.OK,
    error: null,
    user,
  });
});

module.exports = {
  requestEmailVerification,
  verifyEmail,
};
