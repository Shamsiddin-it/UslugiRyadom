import { Link } from 'react-router-dom';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatAddress, formatCurrency, formatDate } from '@/utils/format';
import type { OrderListItem } from '@/types/order';

export function OrdersTable({ orders }: { orders: OrderListItem[] }) {
  return (
    <Card className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex flex-col gap-4 rounded-3xl border border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-slate-900">{order.title}</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-slate-500">
              {order.category.name} • {formatAddress(order.address)} • {formatDate(order.createdAt)}
            </p>
            <p className="text-sm font-medium text-slate-900">{formatCurrency(order.price)}</p>
          </div>
          <Link to={`/orders/${order.id}`}>
            <Button variant="ghost">Открыть</Button>
          </Link>
        </div>
      ))}
    </Card>
  );
}
