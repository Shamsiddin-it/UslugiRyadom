import { apiClient } from '@/lib/axios';
import { buildQueryParams, normalizeCity, normalizeDistrict, unwrapResponse } from '@/services/api';
import type { City, District } from '@/types/location';

export const locationsService = {
  async getCities() {
    const response = await apiClient.get('/cities');
    return unwrapResponse<City[]>(response).map(normalizeCity);
  },

  async getDistricts(city?: string) {
    const response = await apiClient.get('/districts', {
      params: buildQueryParams({ city }),
    });
    return unwrapResponse<District[]>(response).map(normalizeDistrict);
  },
};
