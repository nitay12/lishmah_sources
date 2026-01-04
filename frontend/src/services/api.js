import axios from 'axios';

// Create axios instance with configuration
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Debug: Log the base URL to help diagnose production issues
console.log('[API Config] Base URL:', baseURL);
console.log('[API Config] Env var value:', import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds for Render wake-up
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle Render sleep mode with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // Retry logic for 502/503 errors (backend waking up from sleep)
    if (
      (response?.status === 502 || response?.status === 503) &&
      !config._retry
    ) {
      config._retry = true;

      console.log('Server is waking up, retrying in 3 seconds...');

      // Wait 3 seconds before retry
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return api(config);
    }

    return Promise.reject(error);
  }
);

// API endpoints

export const sheetsAPI = {
  getAll: (params) => api.get('/api/sheets', { params }),
  download: (id) => api.get(`/api/sheets/${id}/download`),
  create: (formData) =>
    api.post('/api/sheets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  delete: (id) => api.delete(`/api/sheets/${id}`)
};

export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
  create: (name) => api.post('/api/categories', { name }),
  delete: (id) => api.delete(`/api/categories/${id}`)
};

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials)
};

export default api;
