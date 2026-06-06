import { formatCityLabel } from '@/api/openMeteo';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { getWeatherLabel } from '@/lib/weatherCodes';
import type { GeoResult } from '@/types/geocoding';
import type { ForecastData } from '@/types/forecast';

interface ForecastPanelProps {
  city: GeoResult;
  forecast: ForecastData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
}

function formatDay(dateIso: string): string {
  return new Date(dateIso).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function ForecastPanel({
  city,
  forecast,
  isLoading,
  isError,
  error,
  onRetry,
}: ForecastPanelProps) {
  const title = formatCityLabel(city);

  if (isLoading) {
    return (
      <section aria-label="Weather forecast" aria-busy="true">
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label="Weather forecast">
        <ErrorMessage
          title="Forecast unavailable"
          message={error?.message ?? 'Could not load weather data.'}
          onRetry={onRetry}
        />
      </section>
    );
  }

  if (!forecast) return null;

  return (
    <section aria-label="Weather forecast">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>

      <div className="mt-2 rounded-lg bg-sky-50 px-4 py-3">
        <p className="text-sm font-medium text-sky-800">Current conditions</p>
        <p className="mt-1 text-2xl font-bold text-sky-950">
          {Math.round(forecast.current.temperature)}°C
        </p>
        <p className="text-sm text-sky-900">
          {getWeatherLabel(forecast.current.weatherCode)} · Wind{' '}
          {Math.round(forecast.current.windSpeed)} km/h
        </p>
      </div>

      <h3 className="mt-6 text-sm font-medium uppercase tracking-wide text-slate-500">
        7-day outlook
      </h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {forecast.daily.map((day) => (
          <li
            key={day.date}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="font-medium text-slate-800">{formatDay(day.date)}</p>
            <p className="mt-1 text-xl font-semibold">
              {Math.round(day.temperatureMax)}° / {Math.round(day.temperatureMin)}°
            </p>
            <p className="mt-1 text-sm text-slate-600">{getWeatherLabel(day.weatherCode)}</p>
            <p className="mt-1 text-xs text-slate-500">
              Rain {day.precipitationSum.toFixed(1)} mm · Wind {Math.round(day.windSpeedMax)} km/h
              {day.snowfallSum > 0 && ` · Snow ${day.snowfallSum.toFixed(1)} cm`}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
