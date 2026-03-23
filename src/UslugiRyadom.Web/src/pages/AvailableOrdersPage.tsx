import { useMemo, useState } from 'react';
import { useAcceptOrderMutation, useAvailableOrdersQuery } from '@/features/orders/orders.queries';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { OrderFilters as OrderFiltersType } from '@/types/order';

export function AvailableOrdersPage() {
  const [filters, setFilters] = useState<OrderFiltersType>({
    categoryId: '',
    city: '',
    district: '',
    status: undefined,
    pageNumber: 1,
    pageSize: 12,
  });
  const queryFilters = useMemo(
    () => ({
      ...filters,
      categoryId: filters.categoryId || undefined,
      city: filters.city || undefined,
      district: filters.district || undefined,
    }),
    [filters],
  );
  const { data, isLoading, isError, refetch } = useAvailableOrdersQuery(queryFilters);
  const acceptMutation = useAcceptOrderMutation();

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Доступные заказы" title="Подберите новый заказ" description="Лента заявок для мастера. Приём заказа мгновенно обновляет данные через React Query." />
      <OrderFilters value={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState title="Нет доступных заказов" description="Попробуйте другую категорию или район." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data?.items.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              action={
                <Button isLoading={acceptMutation.isPending} onClick={() => void acceptMutation.mutateAsync(order.id)}>
                  Принять
                </Button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
