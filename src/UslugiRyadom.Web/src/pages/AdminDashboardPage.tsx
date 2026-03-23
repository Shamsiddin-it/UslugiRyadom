import { useAdminStatsQuery } from '@/features/admin/admin.queries';
import { StatsCard } from '@/components/admin/StatsCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';

export function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useAdminStatsQuery();

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Админ-панель" title="Общая статистика системы" description="Ключевые показатели пользователей, мастеров, категорий и заказов." />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatsCard label="Всего пользователей" value={data.totalUsers} />
          <StatsCard label="Клиенты" value={data.totalClients} />
          <StatsCard label="Мастера" value={data.totalMasters} />
          <StatsCard label="Подтверждённые мастера" value={data.verifiedMasters} />
          <StatsCard label="Всего заказов" value={data.totalOrders} />
          <StatsCard label="Активные заказы" value={data.activeOrders} />
          <StatsCard label="Завершённые" value={data.completedOrders} />
          <StatsCard label="Отменённые" value={data.cancelledOrders} />
          <StatsCard label="Категории" value={data.totalCategories} />
        </div>
      )}
    </div>
  );
}
