import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

export function useLoginMutation() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (user) => {
      toast.success('Вход выполнен');
      navigate(user.role === 'admin' ? '/admin' : user.role === 'master' ? '/master/dashboard' : '/profile');
    },
    onError: () => {
      toast.error('Не удалось войти');
    },
  });
}

export function useRegisterMutation() {
  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: (user) => {
      toast.success('Аккаунт создан');
      navigate(user.role === 'master' ? '/master/dashboard' : '/profile');
    },
    onError: () => {
      toast.error('Не удалось завершить регистрацию');
    },
  });
}
