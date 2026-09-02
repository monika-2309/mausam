# Mausam

Mausam is a weather-first productivity app prototype that helps users make better day-to-day decisions based on local conditions. The app includes a modern auth flow, preference setup, and a dashboard that surfaces weather context and practical recommendations.

## Project Overview

This repository contains:
- A React + Vite frontend for the user experience
- An Express backend for APIs and middleware
- Supabase integration for auth and user preferences
- A weather prototype layer for current conditions, forecast, and suggestions

## Tech Stack

Frontend
- React
- Vite
- CSS

Backend
- Node.js
- Express
- Supabase JS client
- dotenv
- CORS

Data / Services
- Supabase Auth
- Supabase Database
- Weather mock/prototype API layer

## Project Structure

```bash
mausam/
├── backend/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   ├── controllers/
│   │   ├── userController.js
│   │   └── weatherController.js
│   └── routes/
│       ├── auth.js
│       ├── preferences.js
│       └── weather.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── api.js
│       ├── index.css
│       └── main.jsx
├── .gitignore
├── README.md
└── package-lock.json
```

## Prerequisites

Before running the app, install:
- Node.js 18+
- npm
- A Supabase project

## Environment Setup

### Backend environment
Create a `.env` file inside the `backend` folder:

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
WEATHER_API_KEY=your-weather-api-key
FRONTEND_URL=http://localhost:5173
```

### Supabase setup
In your Supabase SQL editor, create the required tables:

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT,
  location TEXT,
  purposes JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own prefs" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prefs" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prefs" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);
```

## Run the App

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Start the backend

```bash
npm run dev
```

The backend runs on:
- http://localhost:5000

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

The frontend runs on:
- http://localhost:5173

## Available API Routes

Authentication
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

Weather
- GET /api/weather/current/:location
- GET /api/weather/forecast/:location
- GET /api/weather/insights

Preferences
- GET /api/preferences/:userId
- POST /api/preferences/:userId
- PUT /api/preferences/:userId

## Current App Flow

1. User lands on the auth screen
2. User signs in or creates an account
3. User sets name, location, and weather use cases
4. Dashboard displays weather and decision-oriented insights

## Notes

This is a working prototype and uses a mock weather layer in the backend. The project is structured so that the weather logic can later be replaced with a real API such as OpenWeatherMap or WeatherAPI.

## Future Improvements

- Real weather API integration
- Password reset flow
- DB-seeded demo data
- Better personalized recommendation logic
- Production-ready auth and validation
- deployment configuration
