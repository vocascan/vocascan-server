const jwt = require("jsonwebtoken")
const moment = require("moment")



// Generate JSON Web Token
//param needs user id for payload
function generateJWT(input) {
    return jwt.sign(input, process.env.SECRET_KEY)
}

// get JWT Token from request
function getJWT(req) {
    // Get token from Authorization header
    const token = req.header("Authorization").split(" ")[1];

    return token;
}

//get id from token
async function getId(input) {
    try {
        // Read userId from token
        userId = await new Promise((resolve, reject) => {
            jwt.verify(input, process.env.SECRET_KEY, (error, decoded) => {
                if (error) reject()
                resolve(decoded.id)
            })
        })
    } catch {
        // Handle broken token
        res.status(400)
        res.send("Invalid auth token")
        return
    }

    return userId;
}

// Run db.query promise-based
function queryAsync(query) {
    // Replace "null" and "undefined" with NULL
    query = query.replace(/['"](null|undefined)['"]/g, "NULL")
    
    return new Promise((resolve, reject) => {
        db.query(query, (error, result) => {
            if (error) {
                console.error(error)
                reject()
            }

            resolve(result)
        })
    })
}

// Convert array to list to be used in a SQL query
// Example: [1, 2, 3] => "('1', '2', '3')"
function quotedList(array) {
    return `(${array.map(element => `'${element}'`).join(",")})`
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
 * @param {*} object object to delete specific keys
 * @returns new object
 */
const deleteKeysFromObject = (keys, object) => {
  return filterObject(object, ([key]) => !keys.includes(key));
};

module.exports = {
    generateJWT,
    getJWT,
    getId,
    queryAsync,
    quotedList,
    filterObject,
    deleteKeysFromObject,
}