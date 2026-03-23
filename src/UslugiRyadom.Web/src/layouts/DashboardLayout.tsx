import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export function DashboardLayout() {
  const currentUser = useCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:pl-[21rem] lg:pr-8">
        <AppSidebar role={currentUser?.role ?? 'client'} />
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
