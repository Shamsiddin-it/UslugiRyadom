import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-start gap-3 border-dashed">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-2xl text-sm text-slate-500">{description}</p>
      {action}
    </Card>
  );
}
