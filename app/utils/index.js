const jwt = require("jsonwebtoken")
const moment = require("moment")



// Generate JSON Web Token
function generateJWT(input) {
    return jwt.sign(input, process.env.JWT_SECRET)
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
            jwt.verify(input, process.env.JWT_SECRET, (error, decoded) => {
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

module.exports = {
    generateJWT,
    getJWT,
    getId,
    queryAsync,
    quotedList
}