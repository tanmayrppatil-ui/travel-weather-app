import { useQuery } from '@tanstack/react-query';
import { searchCities } from '@/api/openMeteo';

export function useCitySearch(debouncedQuery: string) {
  return useQuery({
    queryKey: ['cities', debouncedQuery],
    queryFn: ({ signal }) => searchCities(debouncedQuery, signal),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 60 * 1000,
    retry: false,
  });
}
