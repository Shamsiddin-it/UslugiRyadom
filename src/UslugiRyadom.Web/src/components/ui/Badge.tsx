import type { PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends PropsWithChildren {
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'brand';
}

const tones = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  brand: 'bg-primary-light text-primary-dark',
};

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', tones[tone])}>{children}</span>;
}
