import { apiClient } from '@/lib/axios';
import {
  buildQueryParams,
  normalizeAdminStats,
  normalizeAdminUser,
  normalizeMasterProfile,
  normalizeOrderListItem,
  unwrapPagedResponse,
  unwrapResponse,
} from '@/services/api';
import type { PaginationParams } from '@/types/common';
import type { AdminStats } from '@/types/admin';
import type { AdminUser } from '@/types/user';
import type { MasterProfile } from '@/types/master';
import type { OrderFilters, OrderListItem } from '@/types/order';

export const adminService = {
  async getStats() {
    const response = await apiClient.get('/admin/stats');
    return normalizeAdminStats(unwrapResponse<AdminStats>(response));
  },

  async getUsers(filters: PaginationParams = {}) {
    const response = await apiClient.get('/admin/users', {
      params: buildQueryParams(filters),
    });
    const paged = unwrapPagedResponse<AdminUser>(response);
    return {
      ...paged,
      items: paged.items.map(normalizeAdminUser),
    };
  },

  async getMasters(filters: PaginationParams = {}) {
    const response = await apiClient.get('/admin/masters', {
      params: buildQueryParams(filters),
    });
    const paged = unwrapPagedResponse<MasterProfile>(response);
    return {
      ...paged,
      items: paged.items.map(normalizeMasterProfile),
    };
  },

  async getOrders(filters: OrderFilters = {}) {
    const response = await apiClient.get('/admin/orders', {
      params: buildQueryParams(filters),
    });
    const paged = unwrapPagedResponse<OrderListItem>(response);
    return {
      ...paged,
      items: paged.items.map(normalizeOrderListItem),
    };
  },

  async blockUser(id: string, isBlocked: boolean) {
    const response = await apiClient.patch(`/admin/users/${id}/block`, { isBlocked });
    return normalizeAdminUser(unwrapResponse<AdminUser>(response));
  },

  async verifyMaster(id: string, isVerified: boolean) {
    const response = await apiClient.patch(`/admin/masters/${id}/verify`, { isVerified });
    return normalizeMasterProfile(unwrapResponse<MasterProfile>(response));
  },
};
