import axios from 'axios';

// Base URL — change to your backend URL in production
const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT token automatically ─────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: auto-logout on 401 ────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ══════════════════════════════════════════════════════════════
// Auth API
// ══════════════════════════════════════════════════════════════
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// ══════════════════════════════════════════════════════════════
// Tasks API (for logged-in user)
// ══════════════════════════════════════════════════════════════
export const tasksAPI = {
  getAll: (status) =>
    api.get('/tasks', { params: status ? { status } : {} }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// ══════════════════════════════════════════════════════════════
// Admin API
// ══════════════════════════════════════════════════════════════
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllTasks: (status) =>
    api.get('/admin/tasks', { params: status ? { status } : {} }),
  deleteTask: (id) => api.delete(`/admin/tasks/${id}`),
  getAllUsers: () => api.get('/admin/users'),
  changeRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
};

export default api;
