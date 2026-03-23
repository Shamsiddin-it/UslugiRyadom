import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <Badge tone="success">
      <span className="inline-flex items-center gap-1">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Проверен
      </span>
    </Badge>
  ) : (
    <Badge tone="warning">На проверке</Badge>
  );
}
