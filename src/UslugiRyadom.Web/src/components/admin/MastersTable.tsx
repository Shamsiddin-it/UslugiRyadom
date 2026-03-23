import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { VerifiedBadge } from '@/components/masters/VerifiedBadge';
import { formatAddress } from '@/utils/format';
import type { MasterProfile } from '@/types/master';

interface MastersTableProps {
  masters: MasterProfile[];
  onVerify: (master: MasterProfile) => void;
}

export function MastersTable({ masters, onVerify }: MastersTableProps) {
  return (
    <Card className="space-y-4">
      {masters.map((master) => (
        <div key={master.id} className="flex flex-col gap-4 rounded-3xl border border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-slate-900">{master.fullName}</h3>
              <VerifiedBadge verified={master.isVerified} />
            </div>
            <p className="text-sm text-slate-500">
              {master.profession} • {master.experience} лет • {formatAddress(master.address)}
            </p>
          </div>
          <Button onClick={() => onVerify(master)} variant={master.isVerified ? 'ghost' : 'primary'}>
            {master.isVerified ? 'Снять подтверждение' : 'Подтвердить'}
          </Button>
        </div>
      ))}
    </Card>
  );
}
