import type { GeoResult } from '@/types/geocoding';
import type { DailySummary, ForecastData } from '@/types/forecast';

export const londonCity: GeoResult = {
  id: 2643743,
  name: 'London',
  latitude: 51.50853,
  longitude: -0.12574,
  timezone: 'Europe/London',
  country: 'United Kingdom',
  country_code: 'GB',
  admin1: 'England',
};

export const snowyDays: DailySummary[] = [
  {
    date: '2026-01-01',
    temperatureMax: -2,
    temperatureMin: -8,
    precipitationSum: 5,
    snowfallSum: 12,
    weatherCode: 73,
    windSpeedMax: 20,
  },
  {
    date: '2026-01-02',
    temperatureMax: -1,
    temperatureMin: -6,
    precipitationSum: 3,
    snowfallSum: 8,
    weatherCode: 71,
    windSpeedMax: 18,
  },
  {
    date: '2026-01-03',
    temperatureMax: 0,
    temperatureMin: -5,
    precipitationSum: 2,
    snowfallSum: 5,
    weatherCode: 85,
    windSpeedMax: 15,
  },
];

export const rainyDays: DailySummary[] = [
  {
    date: '2026-02-01',
    temperatureMax: 12,
    temperatureMin: 8,
    precipitationSum: 15,
    snowfallSum: 0,
    weatherCode: 65,
    windSpeedMax: 25,
  },
  {
    date: '2026-02-02',
    temperatureMax: 11,
    temperatureMin: 7,
    precipitationSum: 20,
    snowfallSum: 0,
    weatherCode: 82,
    windSpeedMax: 30,
  },
  {
    date: '2026-02-03',
    temperatureMax: 10,
    temperatureMin: 6,
    precipitationSum: 12,
    snowfallSum: 0,
    weatherCode: 63,
    windSpeedMax: 22,
  },
];

export const pleasantDays: DailySummary[] = [
  {
    date: '2026-06-01',
    temperatureMax: 22,
    temperatureMin: 14,
    precipitationSum: 0.5,
    snowfallSum: 0,
    weatherCode: 1,
    windSpeedMax: 12,
  },
  {
    date: '2026-06-02',
    temperatureMax: 24,
    temperatureMin: 15,
    precipitationSum: 0,
    snowfallSum: 0,
    weatherCode: 0,
    windSpeedMax: 10,
  },
  {
    date: '2026-06-03',
    temperatureMax: 23,
    temperatureMin: 16,
    precipitationSum: 1,
    snowfallSum: 0,
    weatherCode: 2,
    windSpeedMax: 14,
  },
];

export const surfDays: DailySummary[] = [
  {
    date: '2026-07-01',
    temperatureMax: 26,
    temperatureMin: 20,
    precipitationSum: 0,
    snowfallSum: 0,
    weatherCode: 1,
    windSpeedMax: 28,
  },
  {
    date: '2026-07-02',
    temperatureMax: 27,
    temperatureMin: 21,
    precipitationSum: 0.5,
    snowfallSum: 0,
    weatherCode: 0,
    windSpeedMax: 32,
  },
  {
    date: '2026-07-03',
    temperatureMax: 25,
    temperatureMin: 19,
    precipitationSum: 0,
    snowfallSum: 0,
    weatherCode: 2,
    windSpeedMax: 22,
  },
];

/** Hot, rainy days (e.g. Pune monsoon) — skiing and outdoor both score 0. */
export const hotRainyDays: DailySummary[] = [
  {
    date: '2026-06-04',
    temperatureMax: 36,
    temperatureMin: 24,
    precipitationSum: 2.2,
    snowfallSum: 0,
    weatherCode: 80,
    windSpeedMax: 19,
  },
  {
    date: '2026-06-05',
    temperatureMax: 36,
    temperatureMin: 24,
    precipitationSum: 1.8,
    snowfallSum: 0,
    weatherCode: 53,
    windSpeedMax: 17,
  },
  {
    date: '2026-06-06',
    temperatureMax: 35,
    temperatureMin: 25,
    precipitationSum: 3.3,
    snowfallSum: 0,
    weatherCode: 80,
    windSpeedMax: 19,
  },
];

export const mockForecast: ForecastData = {
  timezone: 'Europe/London',
  current: {
    temperature: 18,
    weatherCode: 2,
    windSpeed: 14,
  },
  daily: pleasantDays,
};
