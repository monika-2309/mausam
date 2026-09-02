const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Get current weather for a location
router.get('/current/:location', weatherController.getCurrentWeather);

// Get 5-day forecast for a location
router.get('/forecast/:location', weatherController.getForecast);

// Get weather insights based on user's purposes
router.get('/insights/:location', weatherController.getInsights);

module.exports = router;
