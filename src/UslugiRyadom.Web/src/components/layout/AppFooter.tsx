import { PageContainer } from '@/components/layout/PageContainer';

export function AppFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <PageContainer className="flex flex-col gap-3 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Услуги рядом. Платформа для безопасного поиска мастеров и оформления заказов.</p>
        <p>Готово к интеграции с ASP.NET Core Web API.</p>
      </PageContainer>
    </footer>
  );
}
