import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMastersQuery } from '@/features/masters/masters.queries';
import { MasterCard } from '@/components/masters/MasterCard';
import { MasterFilters } from '@/components/masters/MasterFilters';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { MasterFilters as MasterFiltersType } from '@/types/master';

export function MastersPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<MasterFiltersType & { search?: string }>({
    categoryId: searchParams.get('categoryId') ?? '',
    city: '',
    district: '',
    isVerified: undefined as boolean | undefined,
    search: '',
    pageNumber: 1,
    pageSize: 12,
  });

  const queryFilters = useMemo(
    () => ({
      ...filters,
      search: filters.search || undefined,
      categoryId: filters.categoryId || undefined,
      city: filters.city || undefined,
      district: filters.district || undefined,
    }),
    [filters],
  );

  const { data, isLoading, isError, refetch } = useMastersQuery(queryFilters);

  const masters = useMemo(() => {
    const items = data?.items ?? [];

    if (!filters.search) return items;

    const term = filters.search.toLowerCase();
    return items.filter((master) => [master.fullName, master.profession, ...(master.categories.map((category) => category.name))].join(' ').toLowerCase().includes(term));
  }, [data?.items, filters.search]);

  return (
    <PageContainer className="space-y-8">
      <SectionHeader
        eyebrow="Мастера"
        title="Подберите специалиста рядом"
        description="Фильтрация по категории, городу, району и статусу верификации. Карточки готовы под будущие отзывы, портфолио и карту."
      />
      <MasterFilters value={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-80" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : masters.length === 0 ? (
        <EmptyState title="Мастера не найдены" description="Измените фильтры или попробуйте другой район и категорию." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {masters.map((master) => (
            <MasterCard key={master.id} master={master} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
