import type { OrderStatus, PaymentType } from '@/types/order';
import type { UserRole } from '@/types/user';

export const APP_NAME = 'Услуги рядом';

export const roleLabels: Record<UserRole, string> = {
  client: 'Клиент',
  master: 'Мастер',
  admin: 'Администратор',
};

export const paymentTypeLabels: Record<PaymentType, string> = {
  cash: 'Наличные',
  card: 'Карта',
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: 'Новый',
  accepted: 'Принят',
  inProgress: 'В работе',
  completed: 'Завершён',
  cancelled: 'Отменён',
};

export const masterStatusOptions = [
  { value: 'accepted', label: 'Принят' },
  { value: 'inProgress', label: 'В работе' },
  { value: 'completed', label: 'Завершён' },
] as const;
