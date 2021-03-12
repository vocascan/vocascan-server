const { createUser, loginUser, validateRegister, validateLogin, generateToken } = require("../Services/AuthServiceProvider.js")
const { generateJWT } = require("../utils/index.js");

async function register(req, res) {

    if(!(await validateRegister(req, res))) {
        return
    }

    const resUser = await createUser(req.body)
    const token = generateJWT(resUser.id)

    res.send({ token, resUser })
    res.end()
}

async function login(req, res) {
    if(!validateLogin(req, res)) {
        return
    }

    const resUser = await loginUser(req.body, res)

    if(resUser) {
        const token = generateToken(resUser)

        res.send({ token, resUser })
    }
}

async function profile(req, res) {
    res.send(req.user)
}

module.exports = {
    register,
    login,
    profile
}