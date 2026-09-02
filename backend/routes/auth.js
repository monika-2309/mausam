const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User signup
router.post('/signup', userController.signup);

// User login
router.post('/login', userController.login);

// Get current user
router.get('/me', userController.getCurrentUser);

// User logout
router.post('/logout', userController.logout);

module.exports = router;
