import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// JWT interceptor — attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ==================== TRIPS ====================
export const tripAPI = {
  search: (params) => api.get('/trips/search', { params }),
  create: (data) => api.post('/trips', data),
  getById: (id) => api.get(`/trips/${id}`),
  getMyTrips: () => api.get('/trips/user/my-trips'),
  estimate: (data) => api.post('/trips/estimate', data),
  getRoutes: (params) => api.get('/trips/routes', { params }),
  getBestTime: (params) => api.get('/trips/best-time', { params }),
};

// ==================== HOTELS ====================
export const hotelAPI = {
  getAll: (params) => api.get('/hotels', { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  search: (params) => api.get('/hotels/search', { params }),
};

// ==================== ACTIVITIES ====================
export const activityAPI = {
  getAll: (params) => api.get('/activities', { params }),
  getById: (id) => api.get(`/activities/${id}`),
  search: (params) => api.get('/activities/search', { params }),
};

// ==================== REVIEWS ====================
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByDestination: (destId) => api.get(`/reviews/${destId}`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// ==================== COST SPLIT ====================
export const splitAPI = {
  createGroup: (data) => api.post('/split/groups', data),
  addExpense: (data) => api.post('/split/expenses', data),
  getGroup: (id) => api.get(`/split/groups/${id}`),
  getSettlements: (id) => api.get(`/split/groups/${id}/settle`),
};

// ==================== AI FEATURES ====================
export const aiAPI = {
  generateItinerary: (data) => api.post('/itinerary/generate', data),
  chat: (data) => api.post('/chatbot/message', data),
  generateChecklist: (data) => api.post('/checklist/generate', data),
  analyzeBudget: (data) => api.post('/budget/analyze', data),
};

// ==================== WEATHER ====================
export const weatherAPI = {
  getForecast: (city) => api.get(`/weather/${city}`),
};

// ==================== BOOKINGS ====================
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
};

export default api;
