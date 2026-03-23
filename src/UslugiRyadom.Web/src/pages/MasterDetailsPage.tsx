import { useParams } from 'react-router-dom';
import { useMasterQuery } from '@/features/masters/masters.queries';
import { MasterProfileCard } from '@/components/masters/MasterProfileCard';
import { PageContainer } from '@/components/layout/PageContainer';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';

export function MasterDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useMasterQuery(id);

  return (
    <PageContainer className="space-y-6">
      {isLoading ? <Skeleton className="h-[460px]" /> : null}
      {isError ? <ErrorState onRetry={() => void refetch()} /> : null}
      {data ? <MasterProfileCard master={data} /> : null}
    </PageContainer>
  );
}
