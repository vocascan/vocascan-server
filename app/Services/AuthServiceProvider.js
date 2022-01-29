const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { deleteKeysFromObject, hashEmail, generateJWT } = require('../utils');
const { User, Role } = require('../../database');
const ApiError = require('../utils/ApiError.js');
const { bytesLength } = require('../utils/index.js');
const httpStatus = require('http-status');
const { validateInviteCode } = require('../Services/InviteCodeProvider.js');
const config = require('../config/config');
const { tokenTypes } = require('../utils/constants');
const { sendMail } = require('../config/mailer');

// Validate inputs from /register and /login route
function validateAuth(req) {
  if (!req.body.email || !req.body.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'missing parameter');
  }

  return true;
}

// check if user is an admin or not
const checkIfAdmin = async (id) => {
  const user = await User.findOne({
    include: [
      {
        model: Role,
        attributes: ['adminRights'],
      },
    ],
    where: {
      id,
    },
  });

  return user.Role.adminRights;
};

// Validate inputs from /register route
async function validateRegister(req, res) {
  // if server is locked check for invite codes
  if (config.service.invite_code) {
    if (!req.query.inviteCode) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Locked Server! Invite Code is missing');
    }
    await validateInviteCode(req.query.inviteCode);
  }

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
    throw new ApiError(httpStatus.CONFLICT, 'email already in use', 'email');
  }

  // check if username is duplicate
  if (
    await User.count({
      where: {
        username: req.body.username,
      },
    })
  ) {
    throw new ApiError(httpStatus.CONFLICT, 'username is already taken', 'username');
  }

  return true;
}

function validateLogin(req, res) {
  return validateAuth(req, res);
}

function validatePassword(password) {
  const passwordLength = bytesLength(password);

  const length = passwordLength >= 8 && passwordLength <= 72;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonAlphas = /\W/.test(password);

  let passwordComplexity = 0;

  if (length) {
    passwordComplexity = length + hasUpperCase + hasLowerCase + hasNumbers + hasNonAlphas;
  } else if (passwordLength !== 0) {
    passwordComplexity = 1;
  }

  return passwordLength >= 8 && passwordLength <= 72 && passwordComplexity >= 4;
}

// Create new user and store into database
async function createUser({ username, email, password, emailVerified, disabled }) {
  // Hash password
  const hash = await bcrypt.hash(password, config.server.salt_rounds);
  const emailHash = hashEmail(email);

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
    emailVerified,
    disabled,
  });

  // add flag if user is admin
  const isAdmin = await checkIfAdmin(user.id);
  const tempUser = { ...user.toJSON(), isAdmin };

  return deleteKeysFromObject(['roleId', 'email', 'password', 'createdAt', 'updatedAt'], tempUser);
}

// Log user in
async function loginUser({ email, password }) {
  // Get user with email from database
  const emailHash = hashEmail(email);

  const user = await User.findOne({
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
  // add flag if user is admin
  const isAdmin = await checkIfAdmin(user.id);
  const tempUser = { ...user.toJSON(), isAdmin };

  return deleteKeysFromObject(['roleId', 'email', 'password', 'createdAt', 'updatedAt'], tempUser);
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

async function checkPasswordValid(id, password) {
  const user = await User.findOne({
    attributes: ['id', 'password'],
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found', 'email');
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
    const hash = await bcrypt.hash(newPassword, config.server.salt_rounds);
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

const sendAccountVerificationEmail = async (user) => {
  const token = generateJWT(
    {
      id: user.id,
      type: tokenTypes.VERIFY_EMAIL,
    },
    config.server.jwt_secret,
    { expiresIn: config.service.email_confirm_live_time }
  );

  const text = `Hello ${user.username},
you have recently registered an account on ${config.server.base_url}. 
Please verify your Email address by clicking on the link below.
${config.server.base_url}/p/verifyEmail?token=${token}`;

  await sendMail({
    to: `"${user.username}" <${user.email}>`,
    subject: 'Account Verification',
    template: 'accountVerification.ejs',
    text,
    ctx: {
      user,
      token,
      baseUrl: config.server.base_url,
    },
  });
};

const verifyUser = async ({ id }) => {
  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (user.emailVerified) {
    throw new ApiError(httpStatus.GONE, 'User is already verified');
  }

  user.emailVerified = true;

  await user.save();

  return user;
};

module.exports = {
  createUser,
  loginUser,
  validateRegister,
  validateLogin,
  validatePassword,
  destroyUser,
  changePassword,
  checkPasswordValid,
  checkIfAdmin,
  sendAccountVerificationEmail,
  verifyUser,
};
