import { useCategoriesQuery } from '@/features/categories/categories.queries';
import { CategoryGrid } from '@/components/categories/CategoryGrid';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';

export function CategoriesPage() {
  const { data, isLoading, isError, refetch } = useCategoriesQuery();

  return (
    <PageContainer className="space-y-8">
      <SectionHeader
        eyebrow="Категории"
        title="Все категории услуг"
        description="Используйте категории как точку входа к мастерам и заказам. Структура уже готова для расширения под рейтинг, отзывы и подбор по геолокации."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-44" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <CategoryGrid categories={data ?? []} />
      )}
    </PageContainer>
  );
}
