const { v4: uuid } = require("uuid")
const bcrypt = require("bcrypt")
const moment = require("moment")

const { deleteKeysFromObject } = require("../utils");

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

    const resUser = await User.create({
        username: username,
        email: email,
        password: hash,
        roleId: 1
    })

    const user = deleteKeysFromObject(["roleId", "password", "createdAt", "updatedAt"], resUser.toJSON());

    return user
}

// Log user in
async function loginUser({ email, password }, res) {
    // Get user with email from database
    const user = await User.find({
        attributes: ["id", "username", "email", "password"],
        where: {
            email: email
        }
    })

    if(!user) {
        res.status(404)
        res.end()
        return
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        res.status(401)
        res.end()
        return
    }
    
    //delete password from return string
    delete user.dataValues.password
    return user
}

module.exports = {
    createUser,
    loginUser,
    validateRegister,
    validateLogin,
}