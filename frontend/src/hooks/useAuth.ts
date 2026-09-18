import { useAuthStore } from '../store/authStore';
import { authService, RegisterPayload, LoginPayload } from '../services/auth.service';
import toast from 'react-hot-toast';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, setUser, logout: storeLogout } = useAuthStore();

  const register = async (payload: RegisterPayload) => {
    try {
      const data = await authService.register(payload);
      setAuth(data.user, data.tokens);
      toast.success('Welcome to LexAssist AI!');
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.email?.[0] || err.response?.data?.detail || 'Registration failed';
      toast.error(msg);
      throw err;
    }
  };

  const login = async (payload: LoginPayload) => {
    try {
      const data = await authService.login(payload);
      setAuth(data.user, data.tokens);
      toast.success('Signed in successfully.');
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.non_field_errors?.[0] || err.response?.data?.detail || 'Invalid email or password';
      toast.error(msg);
      throw err;
    }
  };

  const logout = async () => {
    const tokens = useAuthStore.getState().tokens;
    try {
      if (tokens?.refresh) {
        await authService.logout(tokens.refresh);
      }
    } catch {
      // Ignore error on logout
    } finally {
      storeLogout();
      toast.success('Signed out.');
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const updated = await authService.updateProfile(data);
      setUser(updated);
      toast.success('Profile updated.');
      return updated;
    } catch (err: any) {
      toast.error('Failed to update profile.');
      throw err;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    updateProfile
  };
}
