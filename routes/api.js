const express = require('express');

// MIDDLEWARE
const ProtectMiddleware = require('../app/Middleware/ProtectMiddleware');

// CONTROLLER
const AuthController = require('../app/Controllers/AuthController.js');

const router = express.Router();

// AUTH
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.get('/auth', ProtectMiddleware, AuthController.profile);

module.exports = router;
