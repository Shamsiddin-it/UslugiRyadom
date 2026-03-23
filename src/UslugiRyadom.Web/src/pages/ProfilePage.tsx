import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MasterProfileForm } from '@/components/forms/MasterProfileForm';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { formatAddress, formatDate, formatPhone } from '@/utils/format';
import { roleLabels } from '@/utils/constants';

export function ProfilePage() {
  const currentUser = useCurrentUser();

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Профиль" title="Личный кабинет" description="Данные текущего пользователя, адрес и дополнительные настройки по роли." />

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold text-slate-900">{currentUser.fullName}</h2>
          <Badge tone="brand">{roleLabels[currentUser.role]}</Badge>
          {currentUser.isBlocked ? <Badge tone="danger">Заблокирован</Badge> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Контакты</p>
            <p className="mt-2 font-medium text-slate-900">{currentUser.email}</p>
            <p className="text-sm text-slate-600">{formatPhone(currentUser.phone)}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Адрес</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{formatAddress(currentUser.address)}</p>
            <p className="mt-2 text-xs text-slate-500">В системе с {formatDate(currentUser.createdAt)}</p>
          </div>
        </div>
      </Card>

      {currentUser.role === 'master' && currentUser.masterProfile ? (
        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Профиль мастера</h2>
            <p className="mt-1 text-sm text-slate-500">Редактирование профессиональной информации и категорий услуг.</p>
          </div>
          <MasterProfileForm profile={currentUser.masterProfile} />
        </Card>
      ) : null}
    </div>
  );
}
