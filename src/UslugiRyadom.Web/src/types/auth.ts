import type { MasterProfile } from '@/types/master';
import type { UserRole } from '@/types/user';
import type { Address } from '@/types/common';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends Address {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  profession?: string;
  experience?: number;
  about?: string;
  categoryIds: string[];
}

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isBlocked: boolean;
  createdAt: string;
  address: Address;
  masterProfile?: MasterProfile | null;
}

export interface AuthResponse {
  accessToken: string;
  expiresAt: string;
  user: CurrentUser;
}
