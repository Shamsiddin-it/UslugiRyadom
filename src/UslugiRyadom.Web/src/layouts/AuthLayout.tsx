import { Outlet } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-hero">
      <PageContainer className="flex min-h-screen items-center justify-center py-10">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-card lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-teal-300">Услуги рядом</p>
              <h1 className="text-4xl font-semibold leading-tight">Удобный поиск мастеров и быстрый запуск заказов.</h1>
              <p className="max-w-md text-sm text-slate-300">
                Один аккаунт для клиента, мастера и администратора. Готово к работе с API и дальнейшему развитию.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              Светлый production-ready интерфейс, роли, фильтры, формы и страницы для полноценного MVP.
            </div>
          </div>
          <div className="p-6 sm:p-10">
            <Outlet />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
