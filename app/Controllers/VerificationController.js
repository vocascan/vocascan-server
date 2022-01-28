const httpStatus = require('http-status');
const config = require('../config/config/index.js');
const ApiError = require('../utils/ApiError.js');
const catchAsync = require('../utils/catchAsync.js');
const { verifyJWT } = require('../utils/index.js');
const { verifyUser } = require('../Services/AuthServiceProvider.js');
const { tokenTypes } = require('../utils/constants.js');

const verifyAccount = catchAsync(async (req, res) => {
  const { token } = req.query;
  const { base_url: baseUrl } = config.server;

  if (!token) {
    return res.render('accountVerification', {
      status: httpStatus.BAD_REQUEST,
      error: 'No verification token provided',
      baseUrl,
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
      baseUrl,
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
        baseUrl,
      });
    }
  }

  return res.render('accountVerification', {
    status: httpStatus.OK,
    error: null,
    user,
    baseUrl,
  });
});

module.exports = {
  verifyAccount,
};
