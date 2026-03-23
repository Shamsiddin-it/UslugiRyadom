import { useQuery } from '@tanstack/react-query';
import { locationsService } from '@/services/locations.service';

export function useCitiesQuery() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: locationsService.getCities,
  });
}

export function useDistrictsQuery(city?: string) {
  return useQuery({
    queryKey: ['districts', city],
    queryFn: () => locationsService.getDistricts(city),
    enabled: Boolean(city),
  });
}
