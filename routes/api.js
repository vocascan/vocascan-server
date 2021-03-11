
const express = require("express")

const ProtectMiddleware = require("../app/Middleware/ProtectMiddleware.js")

const AuthController = require("../app/Controllers/AuthController.js")

const router = express.Router()

router.post("/auth/register", AuthController.register)
router.post("/auth/login", AuthController.login)



module.exports = router