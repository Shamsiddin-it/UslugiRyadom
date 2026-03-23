import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function NotFoundPage() {
  return (
    <PageContainer className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">404</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Страница не найдена</h1>
        <p className="mt-3 text-sm text-slate-500">Похоже, ссылка устарела или адрес был введён неверно.</p>
        <div className="mt-6">
          <Link to="/">
            <Button>На главную</Button>
          </Link>
        </div>
      </Card>
    </PageContainer>
  );
}
