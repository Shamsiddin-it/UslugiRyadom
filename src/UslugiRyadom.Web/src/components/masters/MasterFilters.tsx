import { useCategoriesQuery } from '@/features/categories/categories.queries';
import { CitySelect } from '@/components/shared/CitySelect';
import { DistrictSelect } from '@/components/shared/DistrictSelect';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { MasterFilters as MasterFilterValues } from '@/types/master';

interface MasterFiltersProps {
  value: MasterFilterValues;
  onChange: (next: MasterFilterValues) => void;
}

export function MasterFilters({ value, onChange }: MasterFiltersProps) {
  const { data: categories } = useCategoriesQuery();

  return (
    <Card className="grid gap-4 lg:grid-cols-5">
      <Input placeholder="Поиск по профессии или имени" value={value.search ?? ''} onChange={(event) => onChange({ ...value, search: event.target.value })} />
      <Select
        value={value.categoryId ?? ''}
        onChange={(event) => onChange({ ...value, categoryId: event.target.value })}
        options={(categories ?? []).map((category) => ({
          value: category.id,
          label: category.name,
        }))}
        placeholder="Категория"
      />
      <CitySelect value={value.city} onChange={(city) => onChange({ ...value, city, district: '' })} />
      <DistrictSelect city={value.city} value={value.district} onChange={(district) => onChange({ ...value, district })} />
      <Select
        value={value.isVerified === undefined ? '' : String(value.isVerified)}
        onChange={(event) =>
          onChange({
            ...value,
            isVerified: event.target.value === '' ? undefined : event.target.value === 'true',
          })
        }
        options={[
          { value: 'true', label: 'Только проверенные' },
          { value: 'false', label: 'Неподтверждённые' },
        ]}
        placeholder="Проверка"
      />
    </Card>
  );
}
