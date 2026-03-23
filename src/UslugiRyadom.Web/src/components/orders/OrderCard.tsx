import type { ReactNode } from 'react';
import { CalendarClock, CreditCard, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatAddress, formatCurrency, formatDate } from '@/utils/format';
import { paymentTypeLabels } from '@/utils/constants';
import type { OrderListItem } from '@/types/order';

interface OrderCardProps {
  order: OrderListItem;
  action?: ReactNode;
}

export function OrderCard({ order, action }: OrderCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{order.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{order.category.name}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {formatAddress(order.address)}
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" />
          {formatDate(order.createdAt)}
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          {paymentTypeLabels[order.paymentType]}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-semibold text-slate-900">{formatCurrency(order.price)}</p>
        <div className="flex items-center gap-3">
          {action}
          <Link to={`/orders/${order.id}`}>
            <Button variant="ghost">Подробнее</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
