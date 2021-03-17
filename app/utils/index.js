const jwt = require('jsonwebtoken');

/**
 * Generate JSON Web Token
 * param needs user id for payload
 * @param {*} input jwt payload
 * @returns {String} signed jwt token
 */
function generateJWT(input) {
  return jwt.sign(input, process.env.JWT_SECRET);
}

/**
 * get JWT Token from request
 * @param {Express.Request} req request object
 * @returns {String} Bearer token
 */
function parseTokenUserId(req) {
  // Get token from Authorization header
  const token = req.header('Authorization').split(' ')[1];

  // Read userId from token
  const userId = new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) reject();
      resolve(decoded.id);
    });
  });

  return userId;
}

/**
 * get id from token
 * @param {*} input jwt payload
 * @returns {String} user id
 */
function getId(input) {
  
}

/**
 * Filter a object
 * @param {Object} object object to filter
 * @param {Function} predicate filter function
 * @returns {Object} filtered object
 */
const filterObject = (object, predicate) => Object.fromEntries(Object.entries(object).filter(predicate));

/**
 * Delete specific keys from object
 * @param {Array} keys Array of keys to delete
 * @param {Object} object object to delete specific keys
 * @returns {Object} new object
 */
const deleteKeysFromObject = (keys, object) => {
  return filterObject(object, ([key]) => !keys.includes(key));
};

/**
 * Round a number to a specific amount of digit points
 * @param {Number} x number to round
 * @param {Number} dp the amount of digit points to round
 * @returns {Number} rounded number
 */
const round = (x, dp = 2) => Math.round(x * 10 ** dp) / 10 ** dp;

module.exports = {
  generateJWT,
  parseTokenUserId,
  filterObject,
  deleteKeysFromObject,
  round,
};
