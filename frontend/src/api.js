const API_BASE_URL = 'http://localhost:5000/api';

let authToken = localStorage.getItem('authToken');
let currentUser = null;

// Auth API
export const auth = {
  signup: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    
    const data = await response.json();
    authToken = data.session.access_token;
    currentUser = data.user;
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userId', data.user.id);
    return data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    authToken = data.session.access_token;
    currentUser = data.user;
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userId', data.user.id);
    return data;
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    return response.json();
  },

  getCurrentUser: () => currentUser
};

// Preferences API
export const preferences = {
  get: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/preferences/${userId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get preferences');
    }
    
    return response.json();
  },

  save: async (userId, name, location, purposes) => {
    const response = await fetch(`${API_BASE_URL}/preferences/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, location, purposes })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save preferences');
    }
    
    return response.json();
  },

  update: async (userId, name, location, purposes) => {
    const response = await fetch(`${API_BASE_URL}/preferences/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, location, purposes })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update preferences');
    }
    
    return response.json();
  }
};

// Weather API
export const weather = {
  getCurrent: async (location) => {
    const response = await fetch(`${API_BASE_URL}/weather/current/${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      throw new Error('Failed to get weather');
    }
    
    return response.json();
  },

  getForecast: async (location) => {
    const response = await fetch(`${API_BASE_URL}/weather/forecast/${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      throw new Error('Failed to get forecast');
    }
    
    return response.json();
  },

  getInsights: async (location, purposes = []) => {
    const purposesParam = purposes.join(',');
    const response = await fetch(
      `${API_BASE_URL}/weather/insights?location=${encodeURIComponent(location)}&purposes=${purposesParam}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to get insights');
    }
    
    return response.json();
  }
};

export const setAuthToken = (token) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => authToken;
