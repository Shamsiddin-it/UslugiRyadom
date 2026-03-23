import { apiClient } from '@/lib/axios';
import { normalizeCurrentUser, unwrapResponse } from '@/services/api';
import type { CurrentUser } from '@/types/auth';

export const usersService = {
  async getMe() {
    const response = await apiClient.get('/users/me');
    return normalizeCurrentUser(unwrapResponse<CurrentUser>(response));
  },

  async getById(id: string) {
    const response = await apiClient.get(`/users/${id}`);
    return normalizeCurrentUser(unwrapResponse<CurrentUser>(response));
  },
};
