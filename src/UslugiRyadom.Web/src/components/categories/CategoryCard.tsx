import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import type { Category } from '@/types/category';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link to={`/masters?categoryId=${category.id}`}>
      <Card className="group h-full transition hover:-translate-y-0.5 hover:border-primary/40">
        <div className="space-y-3">
          <div className="inline-flex rounded-2xl bg-primary-light p-3 text-primary-dark">
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
            <p className="mt-1 text-sm text-slate-500">Найдите подходящих мастеров и заказы по этой категории.</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
