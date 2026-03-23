import { Menu, UserCircle2 } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { APP_NAME } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { PageContainer } from '@/components/layout/PageContainer';

const navItems = [
  { to: '/categories', label: 'Категории' },
  { to: '/masters', label: 'Мастера' },
  { to: '/orders', label: 'Заказы' },
];

export function AppHeader() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <PageContainer className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold tracking-tight text-slate-900">
            {APP_NAME}
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${isActive ? 'text-primary' : 'text-slate-600 hover:text-slate-900'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && currentUser ? (
            <>
              <Button variant="ghost" onClick={() => navigate(currentUser.role === 'admin' ? '/admin' : '/profile')}>
                <UserCircle2 className="mr-2 h-4 w-4" />
                {currentUser.fullName}
              </Button>
              <Button variant="secondary" onClick={() => void logout()}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Вход
              </Button>
              <Button onClick={() => navigate('/register')}>Регистрация</Button>
            </>
          )}
        </div>

        <Button variant="ghost" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </PageContainer>
    </header>
  );
}
