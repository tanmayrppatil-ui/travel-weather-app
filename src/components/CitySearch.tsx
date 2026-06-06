import { useEffect, useId, useRef, useState } from 'react';
import { formatCityLabel } from '@/api/openMeteo';
import { Spinner } from '@/components/ui/Spinner';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useCitySearch } from '@/hooks/useCitySearch';
import type { GeoResult } from '@/types/geocoding';

interface CitySearchProps {
  selectedCity: GeoResult | null;
  onSelectCity: (city: GeoResult | null) => void;
}

export function CitySearch({ selectedCity, onSelectCity }: CitySearchProps) {
  const listboxId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: cities = [], isLoading, isError, error } = useCitySearch(debouncedQuery);

  // Derived — no state needed
  const trimmed = query.trim();
  const showList = trimmed.length >= 2;
 

  // Reset highlight when results change
  useEffect(() => {
    setHighlightIndex(-1);
  }, [cities]);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function selectCity(city: GeoResult) {
    onSelectCity(city);
    setQuery('');          // clear search query — city is now in props
    setHighlightIndex(-1);
  }

  function handleChange(value: string) {
    setQuery(value);
    if (selectedCity) onSelectCity(null); // clear selection if user retypes
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => (i < cities.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : cities.length - 1));
    } else if (e.key === 'Enter' && cities[highlightIndex]) {
      e.preventDefault();
      selectCity(cities[highlightIndex]);
    } else if (e.key === 'Escape') {
      setQuery('');
      setHighlightIndex(-1);
    }
  }

  // What the input actually displays
  const displayValue = selectedCity ? formatCityLabel(selectedCity) : query;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <label htmlFor="city-search" className="block text-sm font-medium text-slate-700">
        Search for a destination
      </label>

      <div className="relative mt-1">
        <input
          id="city-search"
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-autocomplete="list"
          placeholder="e.g. Lon for London"
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (selectedCity) setQuery(''); }}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-10 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner label="" />
          </div>
        )}
      </div>

      {trimmed.length > 0 && trimmed.length < 2 && (
        <p className="mt-2 text-sm text-slate-500">Type at least 2 characters</p>
      )}
      {isError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error instanceof Error ? error.message : 'Failed to load cities'}
        </p>
      )}
      {showList && !isLoading && !isError && cities.length === 0 && (
        <p className="mt-2 text-sm text-slate-500">No cities found</p>
      )}

      {showList && cities.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {cities.map((city, index) => (
            <li
              key={city.id}
              role="option"
              aria-selected={highlightIndex === index}
              className={`cursor-pointer px-4 py-2 text-sm ${
                highlightIndex === index ? 'bg-sky-100 text-sky-900' : 'hover:bg-slate-50'
              }`}
              onMouseEnter={() => setHighlightIndex(index)}
              onClick={() => selectCity(city)}
            >
              {formatCityLabel(city)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}