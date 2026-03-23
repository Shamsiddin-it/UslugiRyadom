import { ArrowRight, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategoriesQuery } from '@/features/categories/categories.queries';
import { CategoryGrid } from '@/components/categories/CategoryGrid';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function HomePage() {
  const { data: categories, isLoading } = useCategoriesQuery();

  return (
    <div className="space-y-20">
      <PageContainer>
        <section className="grid gap-8 rounded-[2rem] bg-hero px-6 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-12 lg:py-16">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-primary-light px-4 py-2 text-sm font-semibold text-primary-dark">
              Платформа для клиентов, мастеров и администраторов
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Найдите мастера рядом или создайте заказ за пару минут.
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              «Услуги рядом» помогает быстро оформить заказ, найти проверенных специалистов и контролировать процесс в одном кабинете.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button>Начать сейчас</Button>
              </Link>
              <Link to="/masters">
                <Button variant="ghost">Смотреть мастеров</Button>
              </Link>
            </div>
          </div>

          <Card className="grid gap-4 bg-slate-950 text-white">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-5">
                <Wrench className="h-6 w-6 text-teal-300" />
                <p className="mt-4 text-lg font-semibold">Для клиента</p>
                <p className="mt-2 text-sm text-slate-300">Оформление заказа, отслеживание статуса, быстрый выбор мастера по категории и району.</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5">
                <ShieldCheck className="h-6 w-6 text-orange-300" />
                <p className="mt-4 text-lg font-semibold">Для мастера</p>
                <p className="mt-2 text-sm text-slate-300">Лента доступных заказов, подтверждённый профиль и управление текущими работами.</p>
              </div>
            </div>
            <div className="rounded-3xl bg-white/5 p-5">
              <Sparkles className="h-6 w-6 text-sky-300" />
              <p className="mt-4 text-lg font-semibold">Для администратора</p>
              <p className="mt-2 text-sm text-slate-300">Статистика системы, модерация пользователей, подтверждение мастеров и контроль заказов.</p>
            </div>
          </Card>
        </section>
      </PageContainer>

      <PageContainer className="space-y-8">
        <SectionHeader
          eyebrow="Категории"
          title="Популярные направления услуг"
          description="Категории подключены к реальному API и готовы для роста: отзывы, фото, геолокация и чат могут добавляться поверх текущей структуры."
        />
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-44" />
            ))}
          </div>
        ) : (
          <CategoryGrid categories={(categories ?? []).slice(0, 6)} />
        )}
      </PageContainer>

      <PageContainer className="space-y-8">
        <SectionHeader eyebrow="Как это работает" title="Простой сценарий для всех ролей" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            'Клиент регистрируется, выбирает категорию и создаёт заказ с адресом и бюджетом.',
            'Мастер фильтрует доступные заказы, принимает подходящий и ведёт работу по статусам.',
            'Администратор следит за качеством платформы, пользователями и подтверждением мастеров.',
          ].map((text, index) => (
            <Card key={index} className="space-y-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-sm font-bold text-primary-dark">
                0{index + 1}
              </div>
              <p className="text-sm leading-6 text-slate-600">{text}</p>
            </Card>
          ))}
        </div>
      </PageContainer>

      <PageContainer>
        <Card className="flex flex-col items-start justify-between gap-4 bg-slate-950 text-white lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Готово для запуска MVP и дальнейшего масштабирования</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Подключайте backend API, добавляйте онлайн-оплату, отзывы, чат и вложения без перестройки базовой архитектуры.
            </p>
          </div>
          <Link to="/register">
            <Button variant="primary">
              Создать аккаунт
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </PageContainer>
    </div>
  );
}
