const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { deleteKeysFromObject } = require('../utils');
const { User } = require('../../database');

// Validate inputs from /register and /login route
function validateAuth(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(400).end();
    return false;
  }

  return true;
}

// Validate inputs from /register route
async function validateRegister(req, res) {
  if (!validateAuth(req, res)) {
    return false;
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
    res.status(409).end();
    return false;
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
async function loginUser({ email, password }, res) {
  // Get user with email from database
  let emailHash = crypto.createHash('sha256').update(email).digest('base64');

  const user = await User.findOne({
    attributes: ['id', 'username', 'password'],
    where: {
      email: emailHash,
    },
  });

  if (!user) {
    res.status(404).end();
    return false;
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).end();
    return false;
  }

  return deleteKeysFromObject(['roleId', 'password', 'createdAt', 'updatedAt'], user.toJSON());
}

async function destroyUser(userId) {
  // get user from database
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  await user.destroy();
}

module.exports = {
  createUser,
  loginUser,
  validateRegister,
  validateLogin,
  destroyUser,
};
