import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import { storage } from '@/utils/storage';
import type { CurrentUser, LoginRequest, RegisterRequest } from '@/types/auth';

interface AuthState {
  token: string | null;
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginRequest) => Promise<CurrentUser>;
  register: (payload: RegisterRequest) => Promise<CurrentUser>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<CurrentUser | null>;
  clearAuth: () => void;
}

function applyAuth(token: string, currentUser: CurrentUser) {
  storage.setToken(token);
  return {
    token,
    currentUser,
    isAuthenticated: true,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  token: storage.getToken(),
  currentUser: null,
  isAuthenticated: Boolean(storage.getToken()),
  isBootstrapping: true,

  async login(payload) {
    const response = await authService.login(payload);
    set(() => ({
      ...applyAuth(response.accessToken, response.user),
    }));
    return response.user;
  },

  async register(payload) {
    const response = await authService.register(payload);
    set(() => ({
      ...applyAuth(response.accessToken, response.user),
    }));
    return response.user;
  },

  async logout() {
    try {
      await authService.logout();
    } finally {
      storage.clearToken();
      set({
        token: null,
        currentUser: null,
        isAuthenticated: false,
        isBootstrapping: false,
      });
    }
  },

  async fetchMe() {
    const token = storage.getToken();

    if (!token) {
      set({
        token: null,
        currentUser: null,
        isAuthenticated: false,
        isBootstrapping: false,
      });
      return null;
    }

    try {
      const user = await authService.me();
      set({
        token,
        currentUser: user,
        isAuthenticated: true,
        isBootstrapping: false,
      });
      return user;
    } catch {
      storage.clearToken();
      set({
        token: null,
        currentUser: null,
        isAuthenticated: false,
        isBootstrapping: false,
      });
      return null;
    }
  },

  clearAuth() {
    storage.clearToken();
    set({
      token: null,
      currentUser: null,
      isAuthenticated: false,
      isBootstrapping: false,
    });
  },
}));
