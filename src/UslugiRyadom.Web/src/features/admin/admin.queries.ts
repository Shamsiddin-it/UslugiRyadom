import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import type { PaginationParams } from '@/types/common';
import type { OrderFilters } from '@/types/order';

export function useAdminStatsQuery() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminService.getStats,
  });
}

export function useAdminUsersQuery(filters: PaginationParams) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: () => adminService.getUsers(filters),
  });
}

export function useAdminMastersQuery(filters: PaginationParams) {
  return useQuery({
    queryKey: ['admin', 'masters', filters],
    queryFn: () => adminService.getMasters(filters),
  });
}

export function useAdminOrdersQuery(filters: OrderFilters) {
  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: () => adminService.getOrders(filters),
  });
}

export function useBlockUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) => adminService.blockUser(id, isBlocked),
    onSuccess: () => {
      toast.success('Статус пользователя обновлён');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: () => {
      toast.error('Не удалось изменить статус пользователя');
    },
  });
}

export function useVerifyMasterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) => adminService.verifyMaster(id, isVerified),
    onSuccess: () => {
      toast.success('Статус мастера обновлён');
      void queryClient.invalidateQueries({ queryKey: ['admin', 'masters'] });
      void queryClient.invalidateQueries({ queryKey: ['masters'] });
    },
    onError: () => {
      toast.error('Не удалось подтвердить мастера');
    },
  });
}
