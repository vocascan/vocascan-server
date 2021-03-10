const { createUser, loginUser, validateRegister, validateLogin, generateToken } = require("../Services/AuthServiceProvider.js")

async function register(req, res) {
    console.log("called");
    if(!(await validateRegister(req, res))) {
        return
    }

    const user = await createUser(req.body)

    const token = generateToken(user)

    res.send({ token, user })
    res.end()
}

async function login(req, res) {
    if(!validateLogin(req, res)) {
        return
    }

    const user = await loginUser(req.body, res)

    if(user) {
        const token = generateToken(user)

        res.send({ token, user })
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