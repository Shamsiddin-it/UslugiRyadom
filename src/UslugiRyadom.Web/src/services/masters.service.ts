import { apiClient } from '@/lib/axios';
import { buildQueryParams, normalizeMasterProfile, toUpdateMasterProfilePayload, unwrapPagedResponse, unwrapResponse } from '@/services/api';
import type { MasterFilters, MasterProfile, UpdateMasterProfileRequest } from '@/types/master';

export const mastersService = {
  async getMasters(filters: MasterFilters = {}) {
    const response = await apiClient.get('/masters', {
      params: buildQueryParams(filters),
    });
    const paged = unwrapPagedResponse<MasterProfile>(response);
    return {
      ...paged,
      items: paged.items.map(normalizeMasterProfile),
    };
  },

  async getMaster(id: string) {
    const response = await apiClient.get(`/masters/${id}`);
    return normalizeMasterProfile(unwrapResponse<MasterProfile>(response));
  },

  async updateMyProfile(payload: UpdateMasterProfileRequest) {
    const response = await apiClient.put('/masters/me', toUpdateMasterProfilePayload(payload));
    return normalizeMasterProfile(unwrapResponse<MasterProfile>(response));
  },
};
