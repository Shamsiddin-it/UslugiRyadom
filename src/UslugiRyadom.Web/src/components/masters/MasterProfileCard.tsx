import { Mail, MapPin, Phone, Star } from 'lucide-react';
import { VerifiedBadge } from '@/components/masters/VerifiedBadge';
import { Card } from '@/components/ui/Card';
import { formatAddress, formatDate, formatPhone } from '@/utils/format';
import type { MasterProfile } from '@/types/master';

export function MasterProfileCard({ master }: { master: MasterProfile }) {
  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{master.fullName}</h1>
          <p className="text-lg text-slate-600">{master.profession}</p>
        </div>
        <VerifiedBadge verified={master.isVerified} />
      </div>

      <div className="flex flex-wrap gap-2">
        {master.categories.map((category) => (
          <span key={category.id} className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary-dark">
            {category.name}
          </span>
        ))}
      </div>

      <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-accent" />
          Рейтинг: {master.rating.toFixed(1)}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {formatAddress(master.address)}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          {formatPhone(master.phone)}
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          {master.email}
        </div>
      </div>

      <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">О мастере</p>
        <p className="mt-2">{master.about || 'Описание пока не заполнено.'}</p>
        <p className="mt-4">Опыт: {master.experience} лет</p>
        <p>В системе с {formatDate(master.createdAt)}</p>
      </div>
    </Card>
  );
}
