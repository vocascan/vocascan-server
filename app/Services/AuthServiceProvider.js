const bcrypt = require('bcrypt');

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
  if (
    await User.count({
      where: {
        email: req.body.email,
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

  const user = await User.create({
    username,
    email,
    password: hash,
    roleId: 1,
  });

  return deleteKeysFromObject(['roleId', 'password', 'createdAt', 'updatedAt'], user.toJSON());
}

// Log user in
async function loginUser({ email, password }, res) {
  // Get user with email from database
  const user = await User.findOne({
    attributes: ['id', 'username', 'email', 'password'],
    where: {
      email,
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

module.exports = {
  createUser,
  loginUser,
  validateRegister,
  validateLogin,
};
