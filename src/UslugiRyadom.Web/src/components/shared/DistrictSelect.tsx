import { useDistrictsQuery } from '@/features/locations/location.queries';
import { Select } from '@/components/ui/Select';

interface DistrictSelectProps {
  city?: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DistrictSelect({ city, value, onChange, error }: DistrictSelectProps) {
  const { data } = useDistrictsQuery(city);

  return (
    <Select
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      disabled={!city}
      placeholder={city ? 'Выберите район' : 'Сначала выберите город'}
      options={(data ?? []).map((district) => ({
        value: district.name,
        label: district.name,
      }))}
      error={error}
    />
  );
}
