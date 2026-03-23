import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories.service';

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
  });
}
