import { Suspense, lazy, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RoleRoute } from '@/routes/RoleRoute';
import { Spinner } from '@/components/ui/Spinner';

const HomePage = lazy(() => import('@/pages/HomePage').then((module) => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage').then((module) => ({ default: module.CategoriesPage })));
const MastersPage = lazy(() => import('@/pages/MastersPage').then((module) => ({ default: module.MastersPage })));
const MasterDetailsPage = lazy(() => import('@/pages/MasterDetailsPage').then((module) => ({ default: module.MasterDetailsPage })));
const OrdersPage = lazy(() => import('@/pages/OrdersPage').then((module) => ({ default: module.OrdersPage })));
const OrderDetailsPage = lazy(() => import('@/pages/OrderDetailsPage').then((module) => ({ default: module.OrderDetailsPage })));
const CreateOrderPage = lazy(() => import('@/pages/CreateOrderPage').then((module) => ({ default: module.CreateOrderPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const ClientOrdersPage = lazy(() => import('@/pages/ClientOrdersPage').then((module) => ({ default: module.ClientOrdersPage })));
const AvailableOrdersPage = lazy(() => import('@/pages/AvailableOrdersPage').then((module) => ({ default: module.AvailableOrdersPage })));
const MasterDashboardPage = lazy(() => import('@/pages/MasterDashboardPage').then((module) => ({ default: module.MasterDashboardPage })));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('@/pages/AdminUsersPage').then((module) => ({ default: module.AdminUsersPage })));
const AdminMastersPage = lazy(() => import('@/pages/AdminMastersPage').then((module) => ({ default: module.AdminMastersPage })));
const AdminOrdersPage = lazy(() => import('@/pages/AdminOrdersPage').then((module) => ({ default: module.AdminOrdersPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function withSuspense(node: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      {node}
    </Suspense>
  );
}

export const appRouter = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: withSuspense(<HomePage />) },
      { path: '/categories', element: withSuspense(<CategoriesPage />) },
      { path: '/masters', element: withSuspense(<MastersPage />) },
      { path: '/masters/:id', element: withSuspense(<MasterDetailsPage />) },
      { path: '/orders', element: withSuspense(<OrdersPage />) },
      {
        element: <ProtectedRoute />,
        children: [{ path: '/orders/:id', element: withSuspense(<OrderDetailsPage />) }],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: withSuspense(<LoginPage />) },
      { path: '/register', element: withSuspense(<RegisterPage />) },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/profile', element: withSuspense(<ProfilePage />) },
          {
            element: <RoleRoute roles={['client']} />,
            children: [
              { path: '/orders/create', element: withSuspense(<CreateOrderPage />) },
              { path: '/orders/my', element: withSuspense(<ClientOrdersPage />) },
            ],
          },
          {
            element: <RoleRoute roles={['master']} />,
            children: [
              { path: '/orders/available', element: withSuspense(<AvailableOrdersPage />) },
              { path: '/master/dashboard', element: withSuspense(<MasterDashboardPage />) },
            ],
          },
        ],
      },
      {
        element: <RoleRoute roles={['admin']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: '/admin', element: withSuspense(<AdminDashboardPage />) },
              { path: '/admin/users', element: withSuspense(<AdminUsersPage />) },
              { path: '/admin/masters', element: withSuspense(<AdminMastersPage />) },
              { path: '/admin/orders', element: withSuspense(<AdminOrdersPage />) },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: withSuspense(<NotFoundPage />) },
]);
