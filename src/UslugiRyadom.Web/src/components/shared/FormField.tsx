import type { PropsWithChildren, ReactNode } from 'react';

interface FormFieldProps extends PropsWithChildren {
  label: string;
  hint?: string;
  action?: ReactNode;
}

export function FormField({ label, hint, action, children }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
        <span>{label}</span>
        {action}
      </span>
      {children}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}
