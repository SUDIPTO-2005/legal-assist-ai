import { create } from 'zustand';
import { User, AuthTokens } from '../types';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('lexassist_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredTokens = (): AuthTokens | null => {
  try {
    const raw = localStorage.getItem('lexassist_tokens');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  tokens: getStoredTokens(),
  isAuthenticated: !!getStoredTokens()?.access,
  isLoading: false,

  setAuth: (user, tokens) => {
    localStorage.setItem('lexassist_user', JSON.stringify(user));
    localStorage.setItem('lexassist_tokens', JSON.stringify(tokens));
    set({ user, tokens, isAuthenticated: true, isLoading: false });
  },

  setUser: (user) => {
    localStorage.setItem('lexassist_user', JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('lexassist_user');
    localStorage.removeItem('lexassist_tokens');
    set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
  }
}));
