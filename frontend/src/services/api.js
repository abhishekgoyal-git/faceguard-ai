import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('faceguard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking auth or on login page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('faceguard_token');
        localStorage.removeItem('faceguard_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const faceAPI = {
  enroll: (data) => api.post('/face/enroll', data),
  getStatus: () => api.get('/face/status'),
};

export const recognitionAPI = {
  verifyFrame: (base64Frame) => api.post('/recognition/verify', { image_base64: base64Frame }),
};

export const livenessAPI = {
  verifyLiveness: (base64Frame) => api.post('/liveness/verify', { image_base64: base64Frame }),
};

export const emotionAPI = {
  analyzeEmotion: (base64Frame) => api.post('/emotion/analyze', { image_base64: base64Frame }),
};

export const accessAPI = {
  verifyAccess: (base64Frame) => api.post('/access/verify', { image_base64: base64Frame }),
  getLogs: () => api.get('/access/logs'),
};

export const attendanceAPI = {
  getToday: () => api.get('/attendance/today'),
  getSummary: () => api.get('/attendance/summary'),
};

export const adminAPI = {
  getSummary: () => api.get('/admin/summary'),
  getEmotions: () => api.get('/admin/emotions'),
  getRecognitions: () => api.get('/admin/recognitions'),
  getUsers: () => api.get('/users/'),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;
