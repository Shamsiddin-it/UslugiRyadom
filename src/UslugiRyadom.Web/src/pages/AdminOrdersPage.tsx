import { useMemo, useState } from 'react';
import { useAdminOrdersQuery } from '@/features/admin/admin.queries';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { OrderFilters as OrderFiltersType } from '@/types/order';

export function AdminOrdersPage() {
  const [filters, setFilters] = useState<OrderFiltersType>({
    categoryId: '',
    city: '',
    district: '',
    status: undefined,
    pageNumber: 1,
    pageSize: 30,
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

  const { data, isLoading, isError, refetch } = useAdminOrdersQuery(queryFilters);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Заказы" title="Все заказы платформы" />
      <OrderFilters value={filters} onChange={setFilters} />

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState title="Заказы не найдены" description="Измените фильтры и попробуйте снова." />
      ) : (
        <OrdersTable orders={data?.items ?? []} />
      )}
    </div>
  );
}
