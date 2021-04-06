const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { deleteKeysFromObject } = require('../utils');
const { User } = require('../../database');

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
    return [{ status: 400, error: 'missing parameter' }];
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
    return [{ status: 409, error: 'email already exists' }];
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

  try {
    const user = await User.create({
      username,
      email: emailHash,
      password: hash,
      roleId: 1,
    });

    return [null, deleteKeysFromObject(['roleId', 'email', 'password', 'createdAt', 'updatedAt'], user.toJSON())];
  } catch (err) {
    return [{ status: 400, error: err.message }];
  }
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
    return [{ status: 404, error: 'account not found' }];
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return [{ status: 401, error: 'wrong password' }];
  }

  return [null, deleteKeysFromObject(['roleId', 'password', 'createdAt', 'updatedAt'], user.toJSON())];
}

async function destroyUser(userId) {
  // get user from database
  await User.destroy({
    where: {
      id: userId,
    },
  })
    .then((deletedUser) => {
      if (deletedUser) {
        return null;
      }
      return [{ status: 404, error: 'account not found' }];
    })
    .catch((err) => {
      return [{ status: 400, error: err.message }];
    });
}

module.exports = {
  createUser,
  loginUser,
  validateRegister,
  validateLogin,
  destroyUser,
};
