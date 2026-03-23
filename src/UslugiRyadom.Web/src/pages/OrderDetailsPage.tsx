import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAcceptOrderMutation, useOrderQuery, useUpdateOrderStatusMutation } from '@/features/orders/orders.queries';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { formatAddress, formatCurrency, formatDate } from '@/utils/format';
import { masterStatusOptions, paymentTypeLabels } from '@/utils/constants';

export function OrderDetailsPage() {
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const { data, isLoading, isError, refetch } = useOrderQuery(id);
  const acceptMutation = useAcceptOrderMutation();
  const statusMutation = useUpdateOrderStatusMutation();

  const canAccept = useMemo(
    () => currentUser?.role === 'master' && data?.status === 'new' && !data.master,
    [currentUser?.role, data?.master, data?.status],
  );

  const canUpdateStatus = useMemo(
    () =>
      Boolean(
        data &&
          currentUser &&
          ((currentUser.role === 'master' && data.master?.id === currentUser.id) || currentUser.role === 'admin') &&
          data.status !== 'completed' &&
          data.status !== 'cancelled',
      ),
    [currentUser, data],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-60" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{data.title}</h1>
            <p className="mt-2 text-sm text-slate-500">{data.category.name}</p>
          </div>
          <OrderStatusBadge status={data.status} />
        </div>
        <p className="text-sm leading-7 text-slate-600">{data.description}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-50">
            <p className="text-sm text-slate-500">Стоимость</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(data.price)}</p>
          </Card>
          <Card className="bg-slate-50">
            <p className="text-sm text-slate-500">Оплата</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{paymentTypeLabels[data.paymentType]}</p>
          </Card>
          <Card className="bg-slate-50">
            <p className="text-sm text-slate-500">Адрес</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{formatAddress(data.address)}</p>
          </Card>
          <Card className="bg-slate-50">
            <p className="text-sm text-slate-500">Создан</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{formatDate(data.createdAt)}</p>
          </Card>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Участники заказа</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Клиент</p>
            <p className="mt-2 font-semibold text-slate-900">{data.client.fullName}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Мастер</p>
            <p className="mt-2 font-semibold text-slate-900">{data.master?.fullName || 'Пока не назначен'}</p>
          </div>
        </div>
      </Card>

      {(canAccept || canUpdateStatus) && (
        <Card className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Действия</h2>
          <div className="flex flex-wrap gap-3">
            {canAccept ? (
              <Button isLoading={acceptMutation.isPending} onClick={() => void acceptMutation.mutateAsync(data.id)}>
                Принять заказ
              </Button>
            ) : null}
            {canUpdateStatus
              ? masterStatusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={data.status === option.value ? 'secondary' : 'ghost'}
                    isLoading={statusMutation.isPending}
                    onClick={() => void statusMutation.mutateAsync({ id: data.id, status: option.value })}
                  >
                    {option.label}
                  </Button>
                ))
              : null}
          </div>
        </Card>
      )}
    </div>
  );
}
