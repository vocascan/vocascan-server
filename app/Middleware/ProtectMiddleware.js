const jwt = require('jsonwebtoken');

const { getJWT } = require('../utils');
const { User } = require('../../database');

// Check for Authorization header and add user attribute to request object
async function ProtectMiddleware(req, res, next) {
  // Break if no Authorization header is set
  if (!req.header('Authorization')) {
    return res.status(401).send('Not authorized');
  }

  const token = getJWT(req);

  let userId;

  try {
    // Read userId from token
    userId = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          reject();
        }
        resolve(decoded.id);
      });
    });
  } catch (err) {
    // Handle broken token
    return res.status(400).send('Invalid auth token');
  }

  // Get user from database
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(400).send('Invalid auth token');
  }

  // Inject user into request object
  req.user = user;

  next();
}

module.exports = ProtectMiddleware;
