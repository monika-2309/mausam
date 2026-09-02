import { useState } from 'react'
import './App.css'

const purposes = [
  { id: 'farming', label: 'Farming', detail: 'Plan irrigation and field work' },
  { id: 'commuting', label: 'Commuting', detail: 'Know when to leave and what to carry' },
  { id: 'outdoors', label: 'Outdoor events', detail: 'Find the clearest window for your plans' },
  { id: 'travel', label: 'Travel', detail: 'Prepare for changing conditions' },
  { id: 'health', label: 'Health', detail: 'Stay ahead of heat and air quality' },
]

const forecast = [
  { day: 'Today', icon: 'sun', high: '31', low: '24', rain: '10%' },
  { day: 'Fri', icon: 'cloud', high: '30', low: '23', rain: '20%' },
  { day: 'Sat', icon: 'rain', high: '28', low: '22', rain: '60%' },
  { day: 'Sun', icon: 'cloud', high: '29', low: '22', rain: '30%' },
  { day: 'Mon', icon: 'sun', high: '32', low: '24', rain: '10%' },
]

function WeatherIcon({ type }) {
  return <span className={`weather-icon weather-icon--${type}`} aria-hidden="true" />
}

function App() {
  const [screen, setScreen] = useState('account')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('Bengaluru, Karnataka')
  const [selectedPurposes, setSelectedPurposes] = useState(['commuting'])

  const togglePurpose = (id) => {
    setSelectedPurposes((current) =>
      current.includes(id) ? current.filter((purpose) => purpose !== id) : [...current, id],
    )
  }

  const displayName = name.trim() || 'there'

  if (screen === 'account') {
    return (
      <main className="account-page">
        <div className="account-art" aria-hidden="true"><span>°</span></div>
        <section className="account-panel">
          <div className="wordmark"><span className="wordmark-mark">M</span> mausam</div>
          <div className="account-copy">
            <p className="eyebrow">Weather, made useful</p>
            <h1>Make a better call about your day.</h1>
            <p>Clear forecasts and practical guidance, shaped around the things you actually do.</p>
          </div>
          <form className="account-form" onSubmit={(event) => { event.preventDefault(); setScreen('personalize') }}>
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@example.com" required />
            <button className="button button--primary" type="submit">Continue <span aria-hidden="true">-&gt;</span></button>
          </form>
          <p className="account-note">Already have an account? <button type="button" onClick={() => setScreen('personalize')}>Sign in</button></p>
        </section>
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
          <form className="setup-form" onSubmit={(event) => { event.preventDefault(); setScreen('home') }}>
            <label htmlFor="name">What should we call you?</label>
            <input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoFocus required />
            <label htmlFor="location">Your usual location</label>
            <div className="location-input"><span aria-hidden="true">+</span><input id="location" value={location} onChange={(event) => setLocation(event.target.value)} /></div>
            <fieldset>
              <legend>What do you use weather for?</legend>
              <div className="purpose-grid">
                {purposes.map((purpose) => (
                  <button className={`purpose ${selectedPurposes.includes(purpose.id) ? 'purpose--selected' : ''}`} type="button" key={purpose.id} onClick={() => togglePurpose(purpose.id)}>
                    <span className="purpose-check" aria-hidden="true">{selectedPurposes.includes(purpose.id) ? 'x' : '+'}</span>
                    <strong>{purpose.label}</strong><small>{purpose.detail}</small>
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="button button--primary" type="submit">See my forecast <span aria-hidden="true">-&gt;</span></button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="dashboard">
      <header className="topbar"><div className="wordmark"><span className="wordmark-mark">M</span> mausam</div><nav><button type="button" className="nav-link nav-link--active">Today</button><button type="button" className="nav-link" onClick={() => setScreen('personalize')}>Preferences</button></nav><button className="avatar" type="button" onClick={() => setScreen('account')} aria-label="Account settings">{displayName[0].toUpperCase()}</button></header>
      <section className="dashboard-content">
        <div className="location-line"><span className="pin" aria-hidden="true">+</span> {location} <span className="updated">Updated just now</span></div>
        <div className="greeting"><div><p className="eyebrow">Thursday, 02 September 2026</p><h1>Good morning, {displayName}.</h1><p className="intro">Here is what the sky has in store, and what it means for your day.</p></div><div className="sunrise"><span>Sunrise</span><strong>06:04</strong><span>Sunset &nbsp;18:25</span></div></div>
        <div className="decision-banner"><div className="decision-mark">!</div><div><p className="eyebrow">Your call for today</p><h2>Good day for a commute</h2><p>Low rain risk until evening. Leave with a light layer; roads may be busy after 18:00.</p></div><span className="decision-arrow" aria-hidden="true">-&gt;</span></div>
        <section className="weather-overview"><div className="current-weather"><p className="eyebrow">Right now</p><div className="temperature"><WeatherIcon type="sun" /><strong>29<span>°</span></strong></div><p className="condition">Mostly sunny <span>Feels like 31°</span></p></div><div className="weather-stats"><div><span>Humidity</span><strong>64%</strong></div><div><span>Wind</span><strong>12 km/h</strong></div><div><span>Visibility</span><strong>8 km</strong></div><div><span>Air quality</span><strong className="good">Good</strong></div></div></section>
        <section className="forecast-section"><div className="section-heading"><h2>Five day outlook</h2><span>Rain chance</span></div><div className="forecast-list">{forecast.map((item) => <div className="forecast-day" key={item.day}><strong>{item.day}</strong><WeatherIcon type={item.icon} /><span className="forecast-temp">{item.high}° <small>{item.low}°</small></span><span className="rain-chance">{item.rain}</span></div>)}</div></section>
        <section className="insights"><div className="section-heading"><h2>Worth knowing</h2><button type="button">See all -&gt;</button></div><div className="insight-grid"><article><span className="insight-label">COMMUTE</span><h3>Traffic may slow down later</h3><p>Rain is unlikely, but visibility could dip after sunset.</p></article><article><span className="insight-label insight-label--green">OUTDOORS</span><h3>Comfortable after 16:00</h3><p>Temperatures ease to 27° with a gentle breeze.</p></article><article><span className="insight-label insight-label--blue">HEALTH</span><h3>Hydrate through noon</h3><p>UV levels are high between 11:00 and 14:00.</p></article></div></section>
      </section>
    </main>
  )
}

export default App
