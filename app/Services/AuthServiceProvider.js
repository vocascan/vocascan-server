const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { deleteKeysFromObject } = require('../utils');
const { User } = require('../../database');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

// Validate inputs from /register and /login route
function validateAuth(req) {
  if (!req.body.email || !req.body.password) {
    return false;
  }

  return true;
}

// Validate inputs from /register route
async function validateRegister(req, res) {
  if (!validateAuth(req, res)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'missing parameter');
  }

  // Check if email address already exists
  let emailHash = crypto.createHash('sha256').update(req.body.email).digest('base64');

  if (
    await User.count({
      where: {
        email: emailHash,
      },
    })
  ) {
    throw new ApiError(httpStatus.CONFLICT, 'email already exists');
  }

  return true;
}

function validateLogin(req, res) {
  return validateAuth(req, res);
}

// Create new user and store into database
async function createUser({ username, email, password }) {
  // Hash password
  const hash = await bcrypt.hash(password, +process.env.SALT_ROUNDS);
  let emailHash = crypto.createHash('sha256').update(email).digest('base64');

  const user = await User.create({
    username,
    email: emailHash,
    password: hash,
    roleId: 1,
  });

  return deleteKeysFromObject(['roleId', 'email', 'password', 'createdAt', 'updatedAt'], user.toJSON());
}

// Log user in
async function loginUser({ email, password }) {
  // Get user with email from database
  let emailHash = crypto.createHash('sha256').update(email).digest('base64');

  const user = await User.findOne({
    attributes: ['id', 'username', 'password'],
    where: {
      email: emailHash,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'invalid password');
  }

  return deleteKeysFromObject(['roleId', 'password', 'createdAt', 'updatedAt'], user.toJSON());
}

async function destroyUser(userId) {
  // get user from database
  const counter = await User.destroy({
    where: {
      id: userId,
    },
  });
  if (counter === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
}

module.exports = {
  createUser,
  loginUser,
  validateRegister,
  validateLogin,
  destroyUser,
};
