import { useUpdateOrderStatusMutation, useOrdersQuery } from '@/features/orders/orders.queries';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { OrderCard } from '@/components/orders/OrderCard';
import { StatsCard } from '@/components/admin/StatsCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { masterStatusOptions } from '@/utils/constants';

export function MasterDashboardPage() {
  const currentUser = useCurrentUser();
  const statusMutation = useUpdateOrderStatusMutation();
  const { data, isLoading, isError, refetch } = useOrdersQuery({
    masterId: currentUser?.id,
    pageNumber: 1,
    pageSize: 20,
  });

  const orders = data?.items ?? [];
  const activeOrders = orders.filter((order) => order.status === 'accepted' || order.status === 'inProgress').length;
  const completedOrders = orders.filter((order) => order.status === 'completed').length;

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Кабинет мастера" title="Принятые заказы и оперативная статистика" />

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Всего заказов" value={orders.length} />
        <StatsCard label="Активные" value={activeOrders} />
        <StatsCard label="Завершённые" value={completedOrders} />
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-56" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : orders.length === 0 ? (
        <EmptyState title="Пока нет принятых заказов" description="После принятия заявок они появятся в вашем кабинете." />
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              action={
                <div className="flex flex-wrap gap-2">
                  {masterStatusOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={order.status === option.value ? 'secondary' : 'ghost'}
                      isLoading={statusMutation.isPending}
                      onClick={() => void statusMutation.mutateAsync({ id: order.id, status: option.value })}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
