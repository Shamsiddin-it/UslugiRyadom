import { useState } from 'react';
import { useCancelOrderMutation, useClientOrdersQuery, useDeleteOrderMutation } from '@/features/orders/orders.queries';
import { OrderCard } from '@/components/orders/OrderCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { OrderListItem } from '@/types/order';

export function ClientOrdersPage() {
  const { data, isLoading, isError, refetch } = useClientOrdersQuery({ pageNumber: 1, pageSize: 20 });
  const cancelMutation = useCancelOrderMutation();
  const deleteMutation = useDeleteOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(null);
  const [mode, setMode] = useState<'cancel' | 'delete' | null>(null);

  const handleClose = () => {
    setSelectedOrder(null);
    setMode(null);
  };

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Мои заказы" title="Управление заказами клиента" description="Отмена и удаление доступны только там, где это допускает бизнес-логика статусов." />

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-56" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState title="У вас пока нет заказов" description="Создайте первый заказ, и он появится здесь." />
      ) : (
        <div className="grid gap-4">
          {data?.items.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              action={
                <div className="flex gap-2">
                  {order.status === 'new' || order.status === 'accepted' ? (
                    <Button variant="ghost" onClick={() => {
                      setSelectedOrder(order);
                      setMode('cancel');
                    }}>
                      Отменить
                    </Button>
                  ) : null}
                  {order.status === 'new' || order.status === 'cancelled' ? (
                    <Button variant="danger" onClick={() => {
                      setSelectedOrder(order);
                      setMode('delete');
                    }}>
                      Удалить
                    </Button>
                  ) : null}
                </div>
              }
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(selectedOrder && mode)}
        title={mode === 'delete' ? 'Удалить заказ?' : 'Отменить заказ?'}
        description={mode === 'delete' ? 'Заказ будет удалён без возможности восстановления.' : 'Заказ перейдёт в статус отменённого.'}
        confirmText={mode === 'delete' ? 'Удалить' : 'Отменить заказ'}
        isLoading={cancelMutation.isPending || deleteMutation.isPending}
        onClose={handleClose}
        onConfirm={async () => {
          if (!selectedOrder || !mode) return;
          if (mode === 'delete') {
            await deleteMutation.mutateAsync(selectedOrder.id);
          } else {
            await cancelMutation.mutateAsync(selectedOrder.id);
          }
          handleClose();
        }}
      />
    </div>
  );
}
