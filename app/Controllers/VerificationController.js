const httpStatus = require('http-status');
const config = require('../config/config/index.js');
const ApiError = require('../utils/ApiError.js');
const catchAsync = require('../utils/catchAsync.js');
const { verifyJWT } = require('../utils/index.js');
const { verifyUser } = require('../Services/AuthServiceProvider.js');
const { tokenTypes } = require('../utils/constants.js');

const verifyAccount = catchAsync(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No verification token');
  }

  let payload = '';

  try {
    payload = await verifyJWT(token, config.server.jwt_secret);

    if (payload.type !== tokenTypes.VERIFY_EMAIL) {
      throw new Error();
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'No valid verification token');
  }

  await verifyUser({ id: payload.id });

  res.render('accountVerification');
});

module.exports = {
  verifyAccount,
};
