import { Home, LayoutDashboard, ListChecks, LogOut, Shield, UserCircle2, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/types/user';
import { cn } from '@/utils/cn';
import { roleLabels } from '@/utils/constants';

interface AppSidebarProps {
  role?: UserRole;
}

const navByRole: Record<UserRole, { to: string; label: string; icon: typeof Home }[]> = {
  client: [
    { to: '/profile', label: 'Профиль', icon: UserCircle2 },
    { to: '/orders/create', label: 'Новый заказ', icon: Home },
    { to: '/orders/my', label: 'Мои заказы', icon: ListChecks },
  ],
  master: [
    { to: '/profile', label: 'Профиль', icon: UserCircle2 },
    { to: '/orders/available', label: 'Доступные заказы', icon: ListChecks },
    { to: '/master/dashboard', label: 'Кабинет мастера', icon: LayoutDashboard },
  ],
  admin: [
    { to: '/admin', label: 'Дашборд', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Пользователи', icon: Users },
    { to: '/admin/masters', label: 'Мастера', icon: Shield },
    { to: '/admin/orders', label: 'Заказы', icon: ListChecks },
  ],
};

export function AppSidebar({ role = 'client' }: AppSidebarProps) {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-full lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-80 lg:p-4">
      <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-3 shadow-card">
        <div className="border-b border-slate-100 px-3 pb-4 pt-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Dashboard</p>
          <div className="mt-3">
            <p className="text-base font-semibold text-slate-900">{currentUser?.fullName ?? 'Панель управления'}</p>
            <p className="mt-1 text-sm text-slate-500">{currentUser ? roleLabels[currentUser.role] : roleLabels[role]}</p>
          </div>
        </div>

        <nav className="mt-3 flex-1 space-y-1 overflow-y-auto">
          {navByRole[role].map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
                    isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
