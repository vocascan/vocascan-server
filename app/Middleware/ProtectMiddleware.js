const jwt = require("jsonwebtoken")
require('dotenv').config()

const User = require("../../database/models/users.js")
const { queryAsync, getJWT } = require("../utils")

// Check for Authorization header and add user attribute to request object
async function ProtectMiddleware(req, res, next) {
    // Break if no Authorization header is set
    if(!req.header("Authorization")) {
        res.status(401)
        res.send("Not authorized")
        return
    }

    const token = getJWT(req);

    let userId
    
    try {
        // Read userId from token
        userId = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
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

    // Get user from database
    const row = await db.users.findAll({
        where: {
            id: userId
        }
    })

    if(!row) {
        res.status(400)
        res.send("Invalid auth token")
        return
    }
    
    // Create user model
    //const user = new User(row)

    // Inject user into request object
    req.user = row[0]

    next()
}

module.exports = ProtectMiddleware 