import { useState } from 'react';
import { useAdminMastersQuery, useVerifyMasterMutation } from '@/features/admin/admin.queries';
import { MastersTable } from '@/components/admin/MastersTable';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { MasterProfile } from '@/types/master';

export function AdminMastersPage() {
  const { data, isLoading, isError, refetch } = useAdminMastersQuery({ pageNumber: 1, pageSize: 50 });
  const mutation = useVerifyMasterMutation();
  const [selectedMaster, setSelectedMaster] = useState<MasterProfile | null>(null);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Мастера" title="Проверка и подтверждение мастеров" />

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (data?.items.length ?? 0) === 0 ? (
        <EmptyState title="Список мастеров пуст" description="Когда мастера зарегистрируются, они появятся здесь." />
      ) : (
        <MastersTable masters={data?.items ?? []} onVerify={setSelectedMaster} />
      )}

      <ConfirmDialog
        open={Boolean(selectedMaster)}
        title={selectedMaster?.isVerified ? 'Снять подтверждение?' : 'Подтвердить мастера?'}
        description="Изменение статуса влияет на отображение мастера в каталоге и доверие клиентов."
        confirmText={selectedMaster?.isVerified ? 'Снять подтверждение' : 'Подтвердить'}
        isLoading={mutation.isPending}
        onClose={() => setSelectedMaster(null)}
        onConfirm={async () => {
          if (!selectedMaster) return;
          await mutation.mutateAsync({ id: selectedMaster.userId, isVerified: !selectedMaster.isVerified });
          setSelectedMaster(null);
        }}
      />
    </div>
  );
}
