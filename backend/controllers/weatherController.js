// Mock weather data - replace with real API calls
const mockWeatherData = {
  'Bengaluru, Karnataka': {
    current: {
      temp: 29,
      condition: 'Mostly sunny',
      feelsLike: 31,
      humidity: 64,
      windSpeed: 12,
      visibility: 8,
      airQuality: 'Good'
    },
    forecast: [
      { day: 'Today', icon: 'sun', high: 31, low: 24, rain: 10 },
      { day: 'Fri', icon: 'cloud', high: 30, low: 23, rain: 20 },
      { day: 'Sat', icon: 'rain', high: 28, low: 22, rain: 60 },
      { day: 'Sun', icon: 'cloud', high: 29, low: 22, rain: 30 },
      { day: 'Mon', icon: 'sun', high: 32, low: 24, rain: 10 }
    ]
  }
};

// Get current weather for a location
exports.getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.params;

    // TODO: Integrate with a real weather API (OpenWeatherMap, WeatherAPI, etc.)
    const weather = mockWeatherData[location] || mockWeatherData['Bengaluru, Karnataka'];

    res.status(200).json({
      location,
      current: weather.current,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Get current weather error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get 5-day forecast for a location
exports.getForecast = async (req, res) => {
  try {
    const { location } = req.params;

    // TODO: Integrate with a real weather API
    const weather = mockWeatherData[location] || mockWeatherData['Bengaluru, Karnataka'];

    res.status(200).json({
      location,
      forecast: weather.forecast,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Get forecast error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get weather insights based on user's purposes
exports.getInsights = async (req, res) => {
  try {
    const { location } = req.query;
    const purposes = req.query.purposes ? req.query.purposes.split(',') : [];

    // Generate insights based on purposes
    const allInsights = {
      farming: {
        label: 'FARMING',
        title: 'Irrigation window today',
        description: 'Low rain risk until evening. Safe to irrigate now.',
        type: 'default'
      },
      commuting: {
        label: 'COMMUTE',
        title: 'Traffic may slow down later',
        description: 'Rain is unlikely, but visibility could dip after sunset.',
        type: 'default'
      },
      outdoors: {
        label: 'OUTDOORS',
        title: 'Comfortable after 16:00',
        description: 'Temperatures ease to 27° with a gentle breeze.',
        type: 'green'
      },
      travel: {
        label: 'TRAVEL',
        title: 'Good day for travel',
        description: 'Clear skies and moderate temperatures throughout the day.',
        type: 'default'
      },
      health: {
        label: 'HEALTH',
        title: 'Hydrate through noon',
        description: 'UV levels are high between 11:00 and 14:00.',
        type: 'blue'
      }
    };

    let insights = [];
    if (purposes && purposes.length > 0) {
      insights = purposes
        .filter(p => allInsights[p])
        .map(p => allInsights[p]);
    }

    // Default insights if none selected
    if (insights.length === 0) {
      insights = [
        allInsights.commuting,
        allInsights.outdoors,
        allInsights.health
      ];
    }

    res.status(200).json({
      location,
      insights,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Get insights error:', err);
    res.status(500).json({ error: err.message });
  }
};
