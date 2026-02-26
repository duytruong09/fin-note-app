import { StateCreator } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/auth.service';

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.login({ email, password });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (email: string, password: string, fullName?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.register({ email, password, fullName });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error?.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false, error: null });
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      console.log('[Auth] Loading current user...');
      const user = await authService.getCurrentUser();
      console.log('[Auth] ✅ User loaded successfully:', user?.email);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        console.log('[Auth] ⚠️  No valid session - user needs to login');
      } else if (error?.message?.includes('Network')) {
        console.log('[Auth] ⚠️  Network error - cannot reach backend');
      } else {
        console.log('[Auth] ⚠️  Failed to load user:', error?.message);
      }
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
});
