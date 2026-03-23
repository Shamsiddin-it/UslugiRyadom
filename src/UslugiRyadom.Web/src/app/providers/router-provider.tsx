import { useEffect } from 'react';
import App from '@/App';
import { setUnauthorizedHandler } from '@/lib/axios';
import { useAuthStore } from '@/store/auth.store';

export function AppRouterProvider() {
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    setUnauthorizedHandler(clearAuth);
  }, [clearAuth]);

  return <App />;
}
