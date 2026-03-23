import { BriefcaseBusiness, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VerifiedBadge } from '@/components/masters/VerifiedBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatAddress } from '@/utils/format';
import type { MasterProfile } from '@/types/master';

export function MasterCard({ master }: { master: MasterProfile }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{master.fullName}</h3>
          <p className="mt-1 text-sm text-slate-500">{master.profession}</p>
        </div>
        <VerifiedBadge verified={master.isVerified} />
      </div>

      <div className="flex flex-wrap gap-2">
        {master.categories.map((category) => (
          <span key={category.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {category.name}
          </span>
        ))}
      </div>

      <div className="grid gap-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-primary" />
          Опыт: {master.experience} лет
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-accent" />
          Рейтинг: {master.rating.toFixed(1)}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {formatAddress(master.address)}
        </div>
      </div>

      <p className="text-sm text-slate-500">{master.about || 'Мастер пока не добавил описание профиля.'}</p>

      <Link to={`/masters/${master.userId}`} className="mt-auto">
        <Button className="w-full">Подробнее</Button>
      </Link>
    </Card>
  );
}
