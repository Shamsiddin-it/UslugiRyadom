import { Badge } from '@/components/ui/Badge';
import { orderStatusLabels } from '@/utils/constants';
import type { OrderStatus } from '@/types/order';

const toneByStatus: Record<OrderStatus, 'brand' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  new: 'brand',
  accepted: 'warning',
  inProgress: 'warning',
  completed: 'success',
  cancelled: 'danger',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={toneByStatus[status]}>{orderStatusLabels[status]}</Badge>;
}
