import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token
api.interceptors.request.use((config) => {
  const tokens = useAuthStore.getState().tokens;
  if (tokens?.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = useAuthStore.getState().tokens;
      if (tokens?.refresh) {
        try {
          const res = await axios.post('/api/v1/auth/refresh/', {
            refresh: tokens.refresh
          });
          const newAccess = res.data.access;
          useAuthStore.getState().setAuth(
            useAuthStore.getState().user!,
            { access: newAccess, refresh: tokens.refresh }
          );
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshErr) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
