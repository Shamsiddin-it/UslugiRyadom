import { apiClient } from '@/lib/axios';
import { normalizeAuthResponse, normalizeCurrentUser, toRegisterPayload, unwrapResponse } from '@/services/api';
import type { AuthResponse, CurrentUser, LoginRequest, RegisterRequest } from '@/types/auth';

export const authService = {
  async login(payload: LoginRequest) {
    const response = await apiClient.post('/auth/login', payload);
    return normalizeAuthResponse(unwrapResponse<AuthResponse>(response));
  },

  async register(payload: RegisterRequest) {
    const response = await apiClient.post('/auth/register', toRegisterPayload(payload));
    return normalizeAuthResponse(unwrapResponse<AuthResponse>(response));
  },

  async logout() {
    await apiClient.post('/auth/logout');
  },

  async me() {
    const response = await apiClient.get('/auth/me');
    return normalizeCurrentUser(unwrapResponse<CurrentUser>(response));
  },
};
