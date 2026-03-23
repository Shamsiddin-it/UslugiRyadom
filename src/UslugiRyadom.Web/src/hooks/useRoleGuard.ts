import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { UserRole } from '@/types/user';

export function useRoleGuard(roles: UserRole[]) {
  const currentUser = useCurrentUser();

  return {
    allowed: currentUser ? roles.includes(currentUser.role) : false,
    currentUser,
  };
}
