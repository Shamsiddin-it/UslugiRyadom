import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrdersQuery } from '@/features/orders/orders.queries';
import { useAuthStore } from '@/store/auth.store';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { OrderFilters as OrderFiltersType } from '@/types/order';

export function OrdersPage() {
  const { isAuthenticated } = useAuthStore();
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

  const { data, isLoading, isError, refetch } = useOrdersQuery(queryFilters);

  return (
    <PageContainer className="space-y-8">
      <SectionHeader
        eyebrow="Заказы"
        title="Лента заказов"
        description="Backend требует авторизацию для списка заказов, поэтому публичный экран мягко предлагает вход, а для авторизованных показывает полную ленту и фильтры."
      />

      {!isAuthenticated ? (
        <EmptyState
          title="Нужен вход в систему"
          description="Чтобы просматривать заказы, войдите в аккаунт клиента, мастера или администратора."
          action={
            <Link to="/login">
              <Button>Войти</Button>
            </Link>
          }
        />
      ) : (
        <>
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
            <EmptyState title="Заказов пока нет" description="Попробуйте изменить фильтры или вернитесь позже." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {data?.items.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
