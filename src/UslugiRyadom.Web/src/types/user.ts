import type { Address } from '@/types/common';

export type UserRole = 'client' | 'master' | 'admin';

export interface User extends Address {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isBlocked: boolean;
  createdAt: string;
}

export interface AdminUser extends User {}
