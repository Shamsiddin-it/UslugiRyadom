import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ordersService } from '@/services/orders.service';
import type { CreateOrderRequest, OrderFilters, OrderStatus } from '@/types/order';
import type { PaginationParams } from '@/types/common';

export function useOrdersQuery(filters: OrderFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersService.getAll(filters),
  });
}

export function useOrderQuery(id?: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useClientOrdersQuery(filters: PaginationParams = {}) {
  return useQuery({
    queryKey: ['orders', 'mine', filters],
    queryFn: () => ordersService.getMine(filters),
  });
}

export function useAvailableOrdersQuery(filters: OrderFilters) {
  return useQuery({
    queryKey: ['orders', 'available', filters],
    queryFn: () => ordersService.getAvailable(filters),
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => ordersService.create(payload),
    onSuccess: () => {
      toast.success('Заказ создан');
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => {
      toast.error('Не удалось создать заказ');
    },
  });
}

export function useAcceptOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.accept(id),
    onSuccess: () => {
      toast.success('Заказ принят');
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => {
      toast.error('Не удалось принять заказ');
    },
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => ordersService.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Статус заказа обновлён');
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => {
      toast.error('Не удалось изменить статус заказа');
    },
  });
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.cancel(id),
    onSuccess: () => {
      toast.success('Заказ отменён');
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => {
      toast.error('Не удалось отменить заказ');
    },
  });
}

export function useDeleteOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersService.remove(id),
    onSuccess: () => {
      toast.success('Заказ удалён');
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => {
      toast.error('Не удалось удалить заказ');
    },
  });
}
