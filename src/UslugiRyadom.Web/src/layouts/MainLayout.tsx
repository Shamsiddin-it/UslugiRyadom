import { Outlet } from 'react-router-dom';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="pb-10 pt-8">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}
