const express = require('express');
const authRoute = express.Router();
const AuthController = require('../controllers/AuthController');

authRoute.post('/login', AuthController.login);
authRoute.post('/register', AuthController.register);

module.exports = authRoute;