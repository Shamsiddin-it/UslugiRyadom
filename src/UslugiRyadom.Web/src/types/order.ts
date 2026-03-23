import type { Address } from '@/types/common';

export type OrderStatus = 'new' | 'accepted' | 'inProgress' | 'completed' | 'cancelled';
export type PaymentType = 'cash' | 'card';

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface UserSummary {
  id: string;
  fullName: string;
  phone?: string;
}

export interface OrderListItem {
  id: string;
  title: string;
  price: number;
  status: OrderStatus;
  paymentType: PaymentType;
  createdAt: string;
  address: Address;
  category: CategorySummary;
  client: UserSummary;
  master?: UserSummary | null;
}

export interface Order extends OrderListItem {
  description: string;
  updatedAt: string;
}

export interface OrderFilters {
  categoryId?: string;
  city?: string;
  district?: string;
  status?: OrderStatus;
  clientId?: string;
  masterId?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateOrderRequest extends Address {
  title: string;
  description: string;
  categoryId: string;
  city: string;
  district: string;
  price: number;
  paymentType: PaymentType;
}
