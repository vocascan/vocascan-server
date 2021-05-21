const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { deleteKeysFromObject } = require('../utils');
const { User, Role } = require('../../database');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

// Validate inputs from /register and /login route
function validateAuth(req) {
  if (!req.body.email || !req.body.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'missing parameter');
  }

  return true;
}

// Validate inputs from /register route
async function validateRegister(req, res) {
  validateAuth(req, res);

  // check if email address is valid
  if (!req.body.email.match(/^\S+@\S+\.\S+$/)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'email is not valid', 'email');
  }

  // Check if email address already exists
  const emailHash = crypto.createHash('sha256').update(req.body.email).digest('base64');

  if (
    await User.count({
      where: {
        email: emailHash,
      },
    })
  ) {
    throw new ApiError(httpStatus.CONFLICT, 'email already exists', 'email');
  }

  // check if username is duplicate
  if (
    await User.count({
      where: {
        username: req.body.username,
      },
    })
  ) {
    throw new ApiError(httpStatus.CONFLICT, 'username already exists', 'username');
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
  const emailHash = crypto.createHash('sha256').update(email).digest('base64');

  const role = await Role.findOne({
    attributes: ['id'],
    where: {
      name: 'user',
    },
  });

  const user = await User.create({
    username,
    email: emailHash,
    password: hash,
    roleId: role.id,
  });

  return deleteKeysFromObject(['roleId', 'email', 'password', 'createdAt', 'updatedAt'], user.toJSON());
}

// Log user in
async function loginUser({ email, password }) {
  // Get user with email from database
  const emailHash = crypto.createHash('sha256').update(email).digest('base64');

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
    throw new ApiError(httpStatus.UNAUTHORIZED, 'invalid password', 'password');
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found', 'not-found');
  }
}

async function checkPasswordValid(id, password) {
  const user = await User.findOne({
    attributes: ['id', 'password'],
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found', 'not-found');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'invalid password', 'password');
  }
  return true;
}

async function changePassword(id, oldPassword, newPassword) {
  if (await checkPasswordValid(id, oldPassword)) {
    // Hash password
    const hash = await bcrypt.hash(newPassword, +process.env.SALT_ROUNDS);
    const counter = await User.update(
      { password: hash },
      {
        where: {
          id,
        },
      }
    );
    if (counter[0] === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Error updating password');
    }
    return false;
  }
  return true;
}

module.exports = {
  createUser,
  loginUser,
  validateRegister,
  validateLogin,
  destroyUser,
  changePassword,
  checkPasswordValid,
};
