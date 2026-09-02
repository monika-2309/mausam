import { useState, useEffect } from 'react'
import './App.css'
import { auth, preferences, weather } from './api'

const purposeOptions = [
  { id: 'farming', label: 'Farming', detail: 'Plan irrigation and field work' },
  { id: 'commuting', label: 'Commuting', detail: 'Know when to leave and what to carry' },
  { id: 'outdoors', label: 'Outdoor events', detail: 'Find the clearest window for your plans' },
  { id: 'travel', label: 'Travel', detail: 'Prepare for changing conditions' },
  { id: 'health', label: 'Health', detail: 'Stay ahead of heat and air quality' },
]

function WeatherIcon({ type }) {
  return <span className={`weather-icon weather-icon--${type}`} aria-hidden="true" />
}

function App() {
  const [screen, setScreen] = useState('auth')
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('Bengaluru, Karnataka')
  const [selectedPurposes, setSelectedPurposes] = useState(['commuting'])
  
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [insights, setInsights] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load user on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');
    if (userId && token) {
      setCurrentUser({ id: userId });
      setScreen('home');
      loadUserPreferences(userId);
      loadWeatherData('Bengaluru, Karnataka');
    }
  }, []);

  const loadUserPreferences = async (userId) => {
    try {
      const prefs = await preferences.get(userId);
      if (prefs.name) setName(prefs.name);
      if (prefs.location) setLocation(prefs.location);
      if (prefs.purposes) setSelectedPurposes(prefs.purposes);
    } catch (err) {
      console.error('Failed to load preferences:', err);
    }
  };

  const loadWeatherData = async (loc) => {
    try {
      const current = await weather.getCurrent(loc);
      const forecastData = await weather.getForecast(loc);
      const insightsData = await weather.getInsights(loc, selectedPurposes);
      
      setCurrentWeather(current.current);
      setForecast(forecastData.forecast);
      setInsights(insightsData.insights);
    } catch (err) {
      console.error('Failed to load weather:', err);
      setError('Failed to load weather data');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const result = await auth.signup(email, password);
      setCurrentUser(result.user);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setScreen('personalize');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await auth.login(email, password);
      setCurrentUser(result.user);
      setEmail('');
      setPassword('');
      setScreen('personalize');
      loadUserPreferences(result.user.id);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await preferences.save(currentUser.id, name, location, selectedPurposes);
      await loadWeatherData(location);
      setScreen('home');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const togglePurpose = (id) => {
    setSelectedPurposes((current) =>
      current.includes(id) ? current.filter((purpose) => purpose !== id) : [...current, id],
    )
  }

  const handleLogout = async () => {
    await auth.logout();
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setAuthMode('login');
    setScreen('auth');
  };

  const displayName = name.trim() || 'there'

  // Modern Auth Page (Login/Signup)
  if (screen === 'auth') {
    return (
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-box">
            <div className="auth-header">
              <button 
                className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthMode('login'); setError(''); }}
              >
                Log in
              </button>
              <button 
                className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => { setAuthMode('signup'); setError(''); }}
              >
                Sign up
              </button>
            </div>

            {error && <div className="auth-error">{error}</div>}

            {authMode === 'login' ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="login-email">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">@</span>
                    <input 
                      id="login-email"
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔑</span>
                    <input 
                      id="login-password"
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <a href="#" className="forgot-password">Forgot password?</a>

                <button 
                  className="auth-button auth-button--primary" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleSignup}>
                <div className="form-group">
                  <label htmlFor="signup-email">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">@</span>
                    <input 
                      id="signup-email"
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔑</span>
                    <input 
                      id="signup-password"
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔑</span>
                    <input 
                      id="confirm-password"
                      type="password" 
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <button 
                  className="auth-button auth-button--primary" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </button>
              </form>
            )}

            <div className="divider">or continue with</div>

            <div className="social-buttons">
              <button className="social-button" type="button" disabled>
                <span className="google-icon">G</span> Google
              </button>
              <button className="social-button" type="button" disabled>
                <span className="apple-icon">🍎</span> Apple
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (screen === 'personalize') {
    return (
      <main className="setup-page">
        <header className="topbar"><div className="wordmark"><span className="wordmark-mark">M</span> mausam</div><span className="step-label">01 / 02</span></header>
        <section className="setup-content">
          <p className="eyebrow">Let us make it yours</p>
          <h1>A little context goes a long way.</h1>
          <p className="intro">Tell us where you are and what your weather decisions look like. You can change this anytime.</p>
          
          {error && <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
          
          <form className="setup-form" onSubmit={handleSavePreferences}>
            <label htmlFor="name">What should we call you?</label>
            <input 
              id="name" 
              value={name} 
              onChange={(event) => setName(event.target.value)} 
              placeholder="Your name" 
              autoFocus 
              required 
            />
            <label htmlFor="location">Your usual location</label>
            <div className="location-input">
              <span aria-hidden="true">+</span>
              <input 
                id="location" 
                value={location} 
                onChange={(event) => setLocation(event.target.value)} 
              />
            </div>
            <fieldset>
              <legend>What do you use weather for?</legend>
              <div className="purpose-grid">
                {purposeOptions.map((purpose) => (
                  <button 
                    className={`purpose ${selectedPurposes.includes(purpose.id) ? 'purpose--selected' : ''}`} 
                    type="button" 
                    key={purpose.id} 
                    onClick={() => togglePurpose(purpose.id)}
                  >
                    <span className="purpose-check" aria-hidden="true">
                      {selectedPurposes.includes(purpose.id) ? '✓' : '+'}
                    </span>
                    <strong>{purpose.label}</strong>
                    <small>{purpose.detail}</small>
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="button button--primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'See my forecast →'}
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="wordmark"><span className="wordmark-mark">M</span> mausam</div>
        <nav>
          <button type="button" className="nav-link nav-link--active">Today</button>
          <button type="button" className="nav-link" onClick={() => setScreen('personalize')}>Preferences</button>
        </nav>
        <button className="avatar" type="button" onClick={handleLogout} aria-label="Account settings" title="Click to logout">
          {displayName[0].toUpperCase()}
        </button>
      </header>
      <section className="dashboard-content">
        <div className="location-line"><span className="pin" aria-hidden="true">+</span> {location} <span className="updated">Updated just now</span></div>
        <div className="greeting">
          <div>
            <p className="eyebrow">Thursday, 02 September 2026</p>
            <h1>Good morning, {displayName}.</h1>
            <p className="intro">Here is what the sky has in store, and what it means for your day.</p>
          </div>
          <div className="sunrise">
            <span>Sunrise</span>
            <strong>06:04</strong>
            <span>Sunset &nbsp;18:25</span>
          </div>
        </div>
        
        {insights.length > 0 && (
          <div className="decision-banner">
            <div className="decision-mark">!</div>
            <div>
              <p className="eyebrow">Your call for today</p>
              <h2>{insights[0].title}</h2>
              <p>{insights[0].description}</p>
            </div>
            <span className="decision-arrow" aria-hidden="true">→</span>
          </div>
        )}
        
        {currentWeather && (
          <section className="weather-overview">
            <div className="current-weather">
              <p className="eyebrow">Right now</p>
              <div className="temperature">
                <WeatherIcon type="sun" />
                <strong>{currentWeather.temp}<span>°</span></strong>
              </div>
              <p className="condition">
                {currentWeather.condition} <span>Feels like {currentWeather.feelsLike}°</span>
              </p>
            </div>
            <div className="weather-stats">
              <div><span>Humidity</span><strong>{currentWeather.humidity}%</strong></div>
              <div><span>Wind</span><strong>{currentWeather.windSpeed} km/h</strong></div>
              <div><span>Visibility</span><strong>{currentWeather.visibility} km</strong></div>
              <div><span>Air quality</span><strong className="good">{currentWeather.airQuality}</strong></div>
            </div>
          </section>
        )}
        {forecast.length > 0 && (
          <section className="forecast-section">
            <div className="section-heading">
              <h2>Five day outlook</h2>
              <span>Rain chance</span>
            </div>
            <div className="forecast-list">
              {forecast.map((item) => (
                <div className="forecast-day" key={item.day}>
                  <strong>{item.day}</strong>
                  <WeatherIcon type={item.icon} />
                  <span className="forecast-temp">{item.high}° <small>{item.low}°</small></span>
                  <span className="rain-chance">{item.rain}%</span>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {insights.length > 0 && (
          <section className="insights">
            <div className="section-heading">
              <h2>Worth knowing</h2>
              <button type="button">See all →</button>
            </div>
            <div className="insight-grid">
              {insights.map((insight, idx) => (
                <article key={idx}>
                  <span className={`insight-label ${insight.type === 'green' ? 'insight-label--green' : insight.type === 'blue' ? 'insight-label--blue' : ''}`}>
                    {insight.label}
                  </span>
                  <h3>{insight.title}</h3>
                  <p>{insight.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export default App
