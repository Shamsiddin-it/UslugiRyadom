import { useCitiesQuery } from '@/features/locations/location.queries';
import { Select } from '@/components/ui/Select';

interface CitySelectProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CitySelect({ value, onChange, error }: CitySelectProps) {
  const { data } = useCitiesQuery();

  return (
    <Select
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Выберите город"
      options={(data ?? []).map((city) => ({
        value: city.name,
        label: city.name,
      }))}
      error={error}
    />
  );
}
