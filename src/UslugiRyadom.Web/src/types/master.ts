import type { Address } from '@/types/common';

export interface MasterCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MasterProfile {
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
  address: Address;
  categories: MasterCategory[];
}

export interface UpdateMasterProfileRequest extends Address {
  profession: string;
  experience: number;
  about?: string;
  categoryIds: string[];
}

export interface MasterFilters {
  categoryId?: string;
  city?: string;
  district?: string;
  isVerified?: boolean;
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}
