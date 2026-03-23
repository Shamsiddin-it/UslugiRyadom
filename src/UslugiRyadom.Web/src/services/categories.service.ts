import { apiClient } from '@/lib/axios';
import { normalizeCategory, unwrapResponse } from '@/services/api';
import type { Category } from '@/types/category';

export const categoriesService = {
  async getAll() {
    const response = await apiClient.get('/categories');
    return unwrapResponse<Category[]>(response).map(normalizeCategory);
  },

  async getById(id: string) {
    const response = await apiClient.get(`/categories/${id}`);
    return normalizeCategory(unwrapResponse<Category>(response));
  },
};
