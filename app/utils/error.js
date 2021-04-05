// app/utils/error.js
const { ValidationErrorItem } = require('sequelize');

/**
 * Generate a client error from a sequelize error
 *
 * Example Sequelize error
 * errors: [
 *    ValidationErrorItem {
 *      message: 'Validation len on username failed',
 *      type: 'Validation error',
 *      path: 'username',
 *      value: '',
 *      origin: 'FUNCTION',
 *      instance: [User],
 *      validatorKey: 'len',
 *      validatorName: 'len',
 *      validatorArgs: [Array],
 *      original: [Error]
 *    }
 *  ]
 * @param {Error} err sequelize error
 * @returns {Object}
 */
const formatSequelizeError = (err) => {
  if (err && err.errors) {
    const [type, errorFields] = err.errors.reduce(
      (_otherErrors, errorItem) => {
        const [errorTypes, otherErrors] = _otherErrors;

        // validation error
        if (errorItem instanceof ValidationErrorItem) {
          otherErrors[errorItem.path] = { message: errorItem.message };
          errorTypes.add(errorItem.type);
        }

        return [errorTypes, otherErrors];
      },
      [new Set(), {}]
    );

    return { error: [...type][0], fields: errorFields };
  }

  return null;
};

/**
 * Get status code from sequelize formatted error
 * @param {Object} formattedError error
 * @returns {Number} status code
 */
const getStatusCode = (formattedError) => {
  if (formattedError.error === 'unique violation') {
    return 409;
  }

  return 400;
};

module.exports = {
  formatSequelizeError,
  getStatusCode,
};
