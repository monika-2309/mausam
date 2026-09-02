const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get user preferences
router.get('/:userId', userController.getPreferences);

// Save user preferences
router.post('/:userId', userController.savePreferences);

// Update user preferences
router.put('/:userId', userController.updatePreferences);

module.exports = router;
