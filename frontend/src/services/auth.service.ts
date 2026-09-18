import api from './api';
import { User, AuthTokens } from '../types';

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirm: string;
  full_name: string;
  profession?: string;
  organization?: string;
  preferred_language?: string;
  explanation_mode?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post('/api/v1/auth/register/', payload);
    return res.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post('/api/v1/auth/login/', payload);
    return res.data;
  },

  async logout(refreshToken?: string): Promise<void> {
    await api.post('/api/v1/auth/logout/', { refresh: refreshToken });
  },

  async getProfile(): Promise<User> {
    const res = await api.get('/api/v1/auth/profile/');
    return res.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await api.put('/api/v1/auth/profile/', data);
    return res.data;
  }
};
