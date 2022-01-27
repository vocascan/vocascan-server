const config = require('../config/config');
const {
  createUser,
  loginUser,
  validateRegister,
  validateLogin,
  validatePassword,
  destroyUser,
  changePassword,
} = require('../Services/AuthServiceProvider');
const { useInviteCode } = require('../Services/InviteCodeProvider');
const { generateJWT, deleteKeysFromObject } = require('../utils');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  await validateRegister(req, res);

  const user = await createUser(req.body);
  const token = generateJWT({ id: user.id }, config.server.jwt_secret);

  if (!validatePassword(req.body.password)) {
    res.status(400).end();
  }
  res.send({ token, user });

  // after everything is registered redeem the code
  if (config.server.registration_locked) {
    await useInviteCode(req.query.inviteCode);
  }
});

const login = catchAsync(async (req, res) => {
  validateLogin(req, res);

  const user = await loginUser(req.body, res);

  if (user) {
    // generate JWT with userId
    const token = generateJWT({ id: user.id }, config.server.jwt_secret);

    res.send({ token, user });
  }
});

const profile = catchAsync(async (req, res) => {
  res.send(deleteKeysFromObject(['roleId', 'password', 'createdAt', 'updatedAt'], req.user.toJSON()));
});

const deleteUser = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;

  await destroyUser(userId);

  res.status(204).end();
});


const resetPassword = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!validatePassword(req.body.newPassword)) {
    res.status(400).end();
  }
  res.status(200).end();
  await changePassword(userId, oldPassword, newPassword);
});

module.exports = {
  register,
  login,
  profile,
  deleteUser,
  resetPassword,
};
