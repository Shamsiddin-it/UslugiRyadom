import { useMemo, useState } from 'react';
import { useAdminUsersQuery, useBlockUserMutation } from '@/features/admin/admin.queries';
import { UsersTable } from '@/components/admin/UsersTable';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import type { AdminUser } from '@/types/user';

export function AdminUsersPage() {
  const { data, isLoading, isError, refetch } = useAdminUsersQuery({ pageNumber: 1, pageSize: 50 });
  const mutation = useBlockUserMutation();
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const users = useMemo(
    () =>
      (data?.items ?? []).filter((user) =>
        [user.fullName, user.email, user.phone].join(' ').toLowerCase().includes(search.toLowerCase()),
      ),
    [data?.items, search],
  );

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Пользователи" title="Управление пользователями" />
      <Input placeholder="Поиск по имени, email или телефону" value={search} onChange={(event) => setSearch(event.target.value)} />

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : users.length === 0 ? (
        <EmptyState title="Пользователи не найдены" description="Уточните поисковый запрос." />
      ) : (
        <UsersTable users={users} onToggleBlock={setSelectedUser} />
      )}

      <ConfirmDialog
        open={Boolean(selectedUser)}
        title={selectedUser?.isBlocked ? 'Разблокировать пользователя?' : 'Заблокировать пользователя?'}
        description="Это действие сразу отразится в системе и доступе пользователя."
        confirmText={selectedUser?.isBlocked ? 'Разблокировать' : 'Заблокировать'}
        isLoading={mutation.isPending}
        onClose={() => setSelectedUser(null)}
        onConfirm={async () => {
          if (!selectedUser) return;
          await mutation.mutateAsync({ id: selectedUser.id, isBlocked: !selectedUser.isBlocked });
          setSelectedUser(null);
        }}
      />
    </div>
  );
}
