const chalk = require('chalk');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const readline = require('readline');

/**
 * Generate JSON Web Token
 * @param {*} input jwt payload
 * @param {String} secret jwt secret used to verify the token
 * @param {Object} options jwt.sign extra options
 * @param {String|Number} options.expiresIn expiration date
 * @returns {String} signed jwt token
 */
function generateJWT(input, secret, options) {
  return jwt.sign(input, secret, options);
}

/**
 * Verify a jwt token and parse data
 * @param {String} token jwt token to verify
 * @param {String} secret jwt secret used to verify the token
 * @returns {*} parsed data
 */
function verifyJWT(token, secret) {
  return new Promise((res, rej) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        rej(err);
      } else {
        res(decoded);
      }
    });
  });
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

/**
 * Zip arrays
 * See: https://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function
 * @example
 *    zip([[1,2],[11,22],[111,222]])
 *    // returns [[1,11,111],[2,22,222]]]
 *
 * @param  {...Array} arrays arrays to zip
 * @returns {Array} zipped array
 */
const zip = (...arrays) => arrays[0].map((_, i) => arrays.map((array) => array[i]));

/**
 * Resolve all Promises in keys in an object
 * See: https://stackoverflow.com/questions/29292921/how-to-use-promise-all-with-an-object-as-input
 * @param {Object} obj object
 * @returns {Promise<Object>} promise with object
 */
const promiseAllValues = async (obj) =>
  Object.fromEntries(zip(Object.keys(obj), await Promise.all(Object.values(obj))));

/**
 * Shift date
 * @param {Date} date input date
 * @param {Number} numDays amount of days
 * @returns {Date} new date object
 */
const shiftDate = (date, numDays) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
};

/**
 * Calculate day difference between two dates
 * See: https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
 * @param {Date} date1 first date
 * @param {Date} date2 second date
 * @returns {Number}
 */
const dayDateDiff = (date1, date2) => {
  const timeDiff = date2.getTime() - date1.getTime();

  return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
};

/**
 * Check if given date is today
 * @param {Date} date date to check
 * @returns {Boolean}
 */
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * Deep merge two objects.
 * @see https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 * @param target
 * @param ...sources
 */
const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

/**
 * Mutate a object by path
 * @param {Object} source
 * @param {String[]} path
 * @param {Any} value
 */
const mutateByPath = (source, path, value) => {
  const key = path.shift();

  if (!(key in source)) {
    // eslint-disable-next-line no-param-reassign
    source[key] = {};
  }

  if (path.length === 0) {
    // eslint-disable-next-line no-param-reassign
    source[key] = value;
  } else {
    mutateByPath(source[key], path, value);
  }
};

/**
 * Parse a chalk template
 * @param {String} template
 * @returns {String} colorized template
 */
const parseChalkTemplate = (template) => {
  const tagArray = [template];
  tagArray.raw = tagArray;
  return chalk(tagArray);
};

/**
 * Escapes template literal breaking characters
 * @param {String} string string
 * @returns {String} escaped string
 */
const escapeString = (string) => {
  const stringEscapes = {
    '\\': '\\',
    '`': '`',
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029',
  };

  return string.replace(/[`\n\r\u2028\u2029\\]/g, (chr) => {
    return '\\' + stringEscapes[chr];
  });
};

/**
 * Render mustache like templates
 * @param {String} templateString template string
 * @returns {Function} compiled template function to call with context
 */
const template = (templateString) => {
  let templateLiteralString = '';
  let lastOffset = 0;

  templateString.replace(/{{(.*?)}}/g, (match, value, offset) => {
    templateLiteralString += escapeString(templateString.slice(lastOffset, offset));

    templateLiteralString += `\${(() => {
      try {
        return ${value} || "";
      } catch {
        return '';
      }
    })()}`;

    lastOffset = offset + match.length;
  });

  templateLiteralString += escapeString(templateString.slice(lastOffset, templateLiteralString.length - 1));

  const functionStr = `with(ctx) {
    return \`${templateLiteralString}\`;
  }`;

  // eslint-disable-next-line no-new-func
  const compiledFunction = new Function('ctx', functionStr);
  compiledFunction.source = functionStr;

  return compiledFunction;
};

/**
 * Generate a random string
 * @param {Number} length Length of the generated string
 * @returns {String} Random string
 */
const generateRandomString = (length = 64) => crypto.randomBytes(length).toString('hex');

/**
 * Truncate a string to a specific length
 * @param {String} str string to truncate
 * @param {Number} maxLength maximum length before truncate
 * @param {String} truncateChar char to append on a truncated string
 * @returns {String} truncated string
 */
const truncateString = (str, maxLength = 10, truncateChar = '...') =>
  str.length > maxLength ? str.substr(0, maxLength - 1) + truncateChar : str;

/**
 * Hashes an email to store in the database
 * @param {String} email  email
 * @returns {String} hashed email
 */
const hashEmail = (email) => crypto.createHash('sha256').update(email).digest('base64');

/**
 * Prompts a confirm dialog to the console
 * @param {String} question question to ask
 * @returns {Promise} confirmed
 */
const askToConfirm = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} [y/n]:`, (input) => {
      rl.close();

      const confirmed = /^(y|yes)$/.test(input.toLocaleLowerCase().trim());
      resolve(confirmed);
    });
  });
};

module.exports = {
  generateJWT,
  verifyJWT,
  filterObject,
  deleteKeysFromObject,
  round,
  zip,
  promiseAllValues,
  shiftDate,
  dayDateDiff,
  isToday,
  isObject,
  mergeDeep,
  mutateByPath,
  parseChalkTemplate,
  escapeString,
  template,
  generateRandomString,
  truncateString,
  hashEmail,
  askToConfirm,
};
