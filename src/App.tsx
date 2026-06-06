import { useState } from 'react';
import { ActivityList } from '@/components/ActivityList';
import { CitySearch } from '@/components/CitySearch';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ForecastPanel } from '@/components/ForecastPanel';
import { useForecast } from '@/hooks/useForecast';
import type { GeoResult } from '@/types/geocoding';

function App() {
  const [selectedCity, setSelectedCity] = useState<GeoResult | null>(null);
  const { data: forecast, isLoading, isError, error, refetch } = useForecast(selectedCity);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 to-slate-100">
      <header className="shrink-0 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Travel Weather Planner
          </h1>
          <p className="mt-1 text-slate-600">
            Search a city, check the forecast, and see which activities fit best.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <CitySearch selectedCity={selectedCity} onSelectCity={setSelectedCity} />

        {selectedCity ? (
          <ErrorBoundary>
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ForecastPanel
                  city={selectedCity}
                  forecast={forecast}
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  onRetry={refetch}
                />
              </div>
              <ActivityList daily={forecast?.daily} isLoading={isLoading} />
            </div>
          </ErrorBoundary>
        ) : (
          <section
            className="mt-8 rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:py-16"
            aria-label="Getting started"
            >
            <div className="mx-auto max-w-lg">
              <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
                Get started
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
                Search for a destination
              </h2>
              <p className="mt-3 text-slate-600">
                Type a city name above (for example <span className="font-medium">Lon</span>{' '}
                for London). You will see a 7-day forecast and activity recommendations
                ranked for the weather ahead.
              </p>
              <ul className="mt-8 grid gap-4 text-left text-sm text-slate-600 sm:grid-cols-2">
                <li className="rounded-lg bg-sky-50 px-4 py-3">
                  <span className="font-medium text-sky-900">Forecast</span>
                  <br />
                  Current conditions and weekly outlook
                </li>
                <li className="rounded-lg bg-slate-50 px-4 py-3">
                  <span className="font-medium text-slate-900">Activities</span>
                  <br />
                  Skiing, surfing, and sightseeing ranked for you
                </li>
              </ul>
            </div>
          </section>
        )}
      </main>

      <footer className="mt-auto shrink-0 border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
        Weather data by{' '}
        <a
          href="https://open-meteo.com/"
          className="text-sky-700 underline hover:text-sky-900"
          target="_blank"
          rel="noreferrer"
        >
          Open-Meteo
        </a>
      </footer>
    </div>
  );
}

export default App;
