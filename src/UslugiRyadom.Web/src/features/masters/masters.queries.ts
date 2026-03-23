import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mastersService } from '@/services/masters.service';
import { useAuthStore } from '@/store/auth.store';
import type { MasterFilters, UpdateMasterProfileRequest } from '@/types/master';

export function useMastersQuery(filters: MasterFilters) {
  return useQuery({
    queryKey: ['masters', filters],
    queryFn: () => mastersService.getMasters(filters),
  });
}

export function useMasterQuery(id?: string) {
  return useQuery({
    queryKey: ['master', id],
    queryFn: () => mastersService.getMaster(id!),
    enabled: Boolean(id),
  });
}

export function useUpdateMasterProfileMutation() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.currentUser);

  return useMutation({
    mutationFn: (payload: UpdateMasterProfileRequest) => mastersService.updateMyProfile(payload),
    onSuccess: (profile) => {
      toast.success('Профиль мастера обновлён');
      if (currentUser) {
        useAuthStore.setState({
          currentUser: {
            ...currentUser,
            address: profile.address,
            masterProfile: profile,
          },
        });
      }
      void queryClient.invalidateQueries({ queryKey: ['masters'] });
      void queryClient.invalidateQueries({ queryKey: ['master', profile.userId] });
    },
    onError: () => {
      toast.error('Не удалось обновить профиль мастера');
    },
  });
}
