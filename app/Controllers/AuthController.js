const { createUser, loginUser, validateRegister, validateLogin } = require('../Services/AuthServiceProvider');
const { generateJWT, deleteKeysFromObject } = require('../utils');

async function register(req, res) {
  if (!(await validateRegister(req, res))) {
    return;
  }

  const user = await createUser(req.body);
  const token = generateJWT({ id: user.id });

  res.send({ token, user });
}

async function login(req, res) {
  if (!validateLogin(req, res)) {
    return;
  }

  const user = await loginUser(req.body, res);

  if (user) {
    // generate JWT with userId
    const token = generateJWT({ id: user.id });

    res.send({ token, user });
  }
}

async function profile(req, res) {
  res.send(deleteKeysFromObject(['roleId', 'password', 'createdAt', 'updatedAt'], req.user.toJSON()));
}

module.exports = {
  register,
  login,
  profile,
};
