import type { GeoResult, GeoSearchResponse } from '@/types/geocoding';
import type { ForecastData, OpenMeteoForecastResponse } from '@/types/forecast';

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function searchCities(
  query: string,
  signal?: AbortSignal,
): Promise<GeoResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    name: trimmed,
    count: '10',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_BASE}?${params}`, { signal });
  const data = (await response.json()) as GeoSearchResponse;

  return data.results ?? [];
}

export async function getForecast(
  latitude: number,
  longitude: number,
  timezone: string,
  signal?: AbortSignal,
): Promise<ForecastData> {

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone: timezone || 'auto',
    forecast_days: '7',
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'snowfall_sum',
      'weather_code',
      'wind_speed_10m_max',
    ].join(','),
    current: ['temperature_2m', 'weather_code', 'wind_speed_10m'].join(','),
  });

  const response = await fetch(`${FORECAST_BASE}?${params}`, { signal });
  const data = (await response.json()) as OpenMeteoForecastResponse;

  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum, snowfall_sum, weather_code, wind_speed_10m_max } = data.daily;

  const daily: ForecastData['daily'] = time.map((date: string, index: number) => ({
    date,
    temperatureMax: temperature_2m_max[index],
    temperatureMin: temperature_2m_min[index],
    precipitationSum: precipitation_sum[index],
    snowfallSum: snowfall_sum[index],
    weatherCode: weather_code[index],
    windSpeedMax: wind_speed_10m_max[index],
  }));

  const current = data.current
    ? {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        windSpeed: data.current.wind_speed_10m,
      }
    : {
        temperature: daily[0]?.temperatureMax ?? 0,
        weatherCode: daily[0]?.weatherCode ?? 0,
        windSpeed: daily[0]?.windSpeedMax ?? 0,
      };

  return {
    daily,
    current,
    timezone: data.timezone,
  };
}

export function formatCityLabel(city: GeoResult): string {
  const parts = [city.name];
  if (city.admin1) parts.push(city.admin1);
  parts.push(city.country);
  return parts.join(', ');
}
