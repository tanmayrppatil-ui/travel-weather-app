import { useQuery } from '@tanstack/react-query';
import { getForecast } from '@/api/openMeteo';
import type { GeoResult } from '@/types/geocoding';

export function useForecast(city: GeoResult | null) {
  return useQuery({
    queryKey: ['forecast', city?.id],
    queryFn: ({ signal }) =>
      getForecast(city!.latitude, city!.longitude, city!.timezone, signal),
    enabled: city !== null,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
