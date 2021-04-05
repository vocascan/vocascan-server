const {
  createUser,
  loginUser,
  validateRegister,
  validateLogin,
  destroyUser,
} = require('../Services/AuthServiceProvider');
const { generateJWT, deleteKeysFromObject } = require('../utils');

async function register(req, res) {
  if (!(await validateRegister(req, res))) {
    return;
  }

  const [error, user] = await createUser(req.body);
  if (error) {
    res.status(error.status).send({ error: error.error });
  }
  const token = generateJWT({ id: user.id });

  res.send({ token, user });
}

async function login(req, res) {
  if (!validateLogin(req, res)) {
    return;
  }

  const [error, user] = await loginUser(req.body, res);
  if (error) {
    res.status(error.status).send({ error: error.error });
  }

  if (user) {
    // generate JWT with userId
    const token = generateJWT({ id: user.id });

    res.send({ token, user });
  }
}

async function profile(req, res) {
  res.send(deleteKeysFromObject(['roleId', 'password', 'createdAt', 'updatedAt'], req.user.toJSON()));
}

async function deleteUser(req, res) {
  // get userId from request
  const userId = req.user.id;

  const [error] = await destroyUser(userId);
  if (error) {
    res.status(error.status).send({ error: error.error });
  }

  res.status(204).end();
}

module.exports = {
  register,
  login,
  profile,
  deleteUser,
};
