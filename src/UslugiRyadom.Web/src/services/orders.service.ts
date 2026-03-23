import { apiClient } from '@/lib/axios';
import {
  buildQueryParams,
  encodeOrderStatus,
  normalizeOrder,
  normalizeOrderListItem,
  toCreateOrderPayload,
  unwrapPagedResponse,
  unwrapResponse,
} from '@/services/api';
import type { CreateOrderRequest, Order, OrderFilters, OrderListItem, OrderStatus } from '@/types/order';
import type { PaginationParams } from '@/types/common';

export const ordersService = {
  async create(payload: CreateOrderRequest) {
    const response = await apiClient.post('/orders', toCreateOrderPayload(payload));
    return normalizeOrder(unwrapResponse<Order>(response));
  },

  async getAll(filters: OrderFilters = {}) {
    const response = await apiClient.get('/orders', {
      params: buildQueryParams(filters),
    });
    const paged = unwrapPagedResponse<OrderListItem>(response);
    return {
      ...paged,
      items: paged.items.map(normalizeOrderListItem),
    };
  },

  async getById(id: string) {
    const response = await apiClient.get(`/orders/${id}`);
    return normalizeOrder(unwrapResponse<Order>(response));
  },

  async getMine(filters: PaginationParams = {}) {
    const response = await apiClient.get('/orders/my', {
      params: buildQueryParams(filters),
    });
    const paged = unwrapPagedResponse<OrderListItem>(response);
    return {
      ...paged,
      items: paged.items.map(normalizeOrderListItem),
    };
  },

  async getAvailable(filters: OrderFilters = {}) {
    const response = await apiClient.get('/orders/available', {
      params: buildQueryParams(filters),
    });
    const paged = unwrapPagedResponse<OrderListItem>(response);
    return {
      ...paged,
      items: paged.items.map(normalizeOrderListItem),
    };
  },

  async accept(id: string) {
    const response = await apiClient.post(`/orders/${id}/accept`);
    return normalizeOrder(unwrapResponse<Order>(response));
  },

  async updateStatus(id: string, status: OrderStatus) {
    const response = await apiClient.patch(`/orders/${id}/status`, { status: encodeOrderStatus(status) });
    return normalizeOrder(unwrapResponse<Order>(response));
  },

  async cancel(id: string) {
    const response = await apiClient.patch(`/orders/${id}/cancel`);
    return normalizeOrder(unwrapResponse<Order>(response));
  },

  async remove(id: string) {
    await apiClient.delete(`/orders/${id}`);
  },
};
