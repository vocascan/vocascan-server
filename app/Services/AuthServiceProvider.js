const { v4: uuid } = require("uuid")
const bcrypt = require("bcrypt")
const moment = require("moment")

const { generateJWT } = require("../utils");

const { User } = require('../../database');

// Validate inputs from /register and /login route
function validateAuth(req, res) {
    if(!req.body.email || !req.body.password) {
        res.status(400)
        res.end()
        return false
    }

    return true
}

// Validate inputs from /register route
async function validateRegister(req, res) {
    if (!validateAuth(req, res)) {
        return false
    }

    // Check if email address already exists
    if (await User.count({
        where: {
            email: req.body.email
        }
    })) {
        res.status(409)
        res.end()
        return false
    }

    return true
}

function validateLogin(req, res) {
    return validateAuth(req, res)
}

// Create new user and store into database
async function createUser({ username, email, password }) {
    // Hash password
    const hash = await bcrypt.hash(password, +process.env.SALT)

    // Create new user
    const userId = uuid()
    const resUser = await User.create({
        id: userId,
        username: username,
        email: email,
        password: hash,
        role_id: 1
    })

    //delete unnecessary information
    delete resUser.dataValues.password
    delete resUser.dataValues.updatedAt
    delete resUser.dataValues.createdAt

    return resUser
}

// Log user in
async function loginUser({ email, password }, res) {
    // Get user with email from database
    const resUser = await User.find({
        attributes: ["id", "name", "email", "description", "password"],
        where: {
            email: email
        }
    })

    if(!resUser) {
        res.status(404)
        res.end()
        return
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, resUser.password)

    if(!isPasswordValid) {
        res.status(401)
        res.end()
        return
    }
    
    //delete password from return string
    delete resUser.dataValues.password
    return resUser
}

// Generate JWT for user
function generateToken(user) {
    return generateJWT({ id: user.id })
}

module.exports = {
    createUser,
    loginUser,
    validateRegister,
    validateLogin,
    generateToken
}