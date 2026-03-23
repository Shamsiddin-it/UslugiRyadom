import { useCategoriesQuery } from '@/features/categories/categories.queries';
import { CitySelect } from '@/components/shared/CitySelect';
import { DistrictSelect } from '@/components/shared/DistrictSelect';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import type { OrderFilters as OrderFilterValues } from '@/types/order';

interface OrderFiltersProps {
  value: OrderFilterValues;
  onChange: (next: OrderFilterValues) => void;
}

export function OrderFilters({ value, onChange }: OrderFiltersProps) {
  const { data: categories } = useCategoriesQuery();

  return (
    <Card className="grid gap-4 lg:grid-cols-4">
      <Select
        value={value.categoryId ?? ''}
        onChange={(event) => onChange({ ...value, categoryId: event.target.value })}
        placeholder="Категория"
        options={(categories ?? []).map((category) => ({
          value: category.id,
          label: category.name,
        }))}
      />
      <CitySelect value={value.city} onChange={(city) => onChange({ ...value, city, district: '' })} />
      <DistrictSelect city={value.city} value={value.district} onChange={(district) => onChange({ ...value, district })} />
      <Select
        value={value.status ?? ''}
        onChange={(event) => onChange({ ...value, status: (event.target.value || undefined) as OrderFilterValues['status'] })}
        placeholder="Статус"
        options={[
          { value: 'new', label: 'Новый' },
          { value: 'accepted', label: 'Принят' },
          { value: 'inProgress', label: 'В работе' },
          { value: 'completed', label: 'Завершён' },
          { value: 'cancelled', label: 'Отменён' },
        ]}
      />
    </Card>
  );
}
