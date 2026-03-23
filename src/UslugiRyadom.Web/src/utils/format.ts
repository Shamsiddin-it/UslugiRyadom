export function formatCurrency(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'TJS',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value?: string | null) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatAddress(parts?: {
  city?: string | null;
  district?: string | null;
  street?: string | null;
  house?: string | null;
  landmark?: string | null;
}) {
  if (!parts) return 'Адрес не указан';

  return [parts.city, parts.district, parts.street, parts.house, parts.landmark]
    .filter(Boolean)
    .join(', ') || 'Адрес не указан';
}

export function formatPhone(value: string) {
  return value.replace(/(\+?\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}
