import type { AxiosResponse } from 'axios';
import type { AuthResponse, CurrentUser, RegisterRequest } from '@/types/auth';
import type { MasterProfile, UpdateMasterProfileRequest } from '@/types/master';
import type { ApiResponse, PagedResponse, QueryParamValue } from '@/types/common';
import type { AdminStats } from '@/types/admin';
import type { Category } from '@/types/category';
import type { City, District } from '@/types/location';
import type { CreateOrderRequest, Order, OrderListItem, OrderStatus, PaymentType } from '@/types/order';
import type { AdminUser, UserRole } from '@/types/user';

export function unwrapResponse<T>(response: AxiosResponse<ApiResponse<T>>) {
  return response.data.data;
}

export function unwrapPagedResponse<T>(response: AxiosResponse<PagedResponse<T>>) {
  return response.data.data;
}

export function buildQueryParams(params: object) {
  return Object.fromEntries(
    Object.entries(params as Record<string, QueryParamValue>).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}

const roleMap: Record<number, UserRole> = {
  1: 'client',
  2: 'master',
  3: 'admin',
};

const paymentMap: Record<number, PaymentType> = {
  1: 'cash',
  2: 'card',
};

const orderStatusMap: Record<number, OrderStatus> = {
  1: 'new',
  2: 'accepted',
  3: 'inProgress',
  4: 'completed',
  5: 'cancelled',
};

export function encodeRole(role: UserRole) {
  return role === 'client' ? 1 : role === 'master' ? 2 : 3;
}

export function encodePaymentType(paymentType: PaymentType) {
  return paymentType === 'cash' ? 1 : 2;
}

export function encodeOrderStatus(status: OrderStatus) {
  return status === 'new' ? 1 : status === 'accepted' ? 2 : status === 'inProgress' ? 3 : status === 'completed' ? 4 : 5;
}

export function normalizeCurrentUser(payload: {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: number | UserRole;
  isBlocked: boolean;
  createdAt: string;
  address: CurrentUser['address'];
  masterProfile?: unknown;
}): CurrentUser {
  return {
    ...payload,
    role: typeof payload.role === 'number' ? roleMap[payload.role] : payload.role,
    masterProfile: payload.masterProfile ? normalizeMasterProfile(payload.masterProfile as RawMasterProfile) : null,
  };
}

interface RawMasterProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  profession: string;
  experience: number;
  about?: string | null;
  rating: number;
  isVerified: boolean;
  createdAt: string;
  address: MasterProfile['address'];
  categories: MasterProfile['categories'];
}

export function normalizeMasterProfile(payload: RawMasterProfile): MasterProfile {
  return payload;
}

interface RawOrder {
  id: string;
  title: string;
  price: number;
  status: number | OrderStatus;
  paymentType: number | PaymentType;
  createdAt: string;
  address: OrderListItem['address'];
  category: OrderListItem['category'];
  client: OrderListItem['client'];
  master?: OrderListItem['master'];
  description?: string;
  updatedAt?: string;
}

export function normalizeOrderListItem(payload: RawOrder): OrderListItem {
  return {
    ...payload,
    status: typeof payload.status === 'number' ? orderStatusMap[payload.status] : payload.status,
    paymentType: typeof payload.paymentType === 'number' ? paymentMap[payload.paymentType] : payload.paymentType,
  };
}

export function normalizeOrder(payload: RawOrder): Order {
  return normalizeOrderListItem(payload) as Order;
}

export function normalizeAuthResponse(payload: { accessToken: string; expiresAt: string; user: RawCurrentUser }): AuthResponse {
  return {
    ...payload,
    user: normalizeCurrentUser(payload.user),
  };
}

interface RawCurrentUser extends Omit<CurrentUser, 'role' | 'masterProfile'> {
  role: number | UserRole;
  masterProfile?: RawMasterProfile | null;
}

export function normalizeAdminUser(payload: Omit<AdminUser, 'role'> & { role: number | UserRole }): AdminUser {
  return {
    ...payload,
    role: typeof payload.role === 'number' ? roleMap[payload.role] : payload.role,
  };
}

export function normalizeCategory(payload: Category) {
  return payload;
}

export function normalizeCity(payload: City) {
  return payload;
}

export function normalizeDistrict(payload: District) {
  return payload;
}

export function normalizeAdminStats(payload: AdminStats) {
  return payload;
}

export function toRegisterPayload(payload: RegisterRequest) {
  return {
    ...payload,
    role: encodeRole(payload.role),
  };
}

export function toCreateOrderPayload(payload: CreateOrderRequest) {
  return {
    ...payload,
    paymentType: encodePaymentType(payload.paymentType),
  };
}

export function toUpdateMasterProfilePayload(payload: UpdateMasterProfileRequest) {
  return payload;
}
