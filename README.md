# Travel Weather Planner

Collinson Senior Web Engineer coding challenge — search a city, view Open-Meteo weather, see four activities ranked by suitability.

## Run

```bash
npm install
npm run dev      # starts Vite dev server (default port 5173)
npm test
npm run build    # creates dist/ folder for production
npm run preview  # serve the production build locally
```

---

## Root config files (outside `src/`)

| File | Purpose |
|------|---------|
| `package.json` | Project metadata, npm scripts (`dev`, `build`, `test`), and dependencies |
| `package-lock.json` | Locks exact dependency versions so installs are reproducible |
| `index.html` | HTML shell — Vite injects your React app into `<div id="root">` |
| `vite.config.ts` | Vite bundler config (React plugin, `@/` path alias) |
| `tsconfig.json` | Root TypeScript config — points to app, node, and test sub-configs |
| `tsconfig.app.json` | TypeScript rules for **application code** in `src/` |
| `tsconfig.node.json` | TypeScript rules for **Node files** like `vite.config.ts` |
| `tsconfig.test.json` | TypeScript rules for **Jest test files** (fixes `@/test/...` imports in IDE) |
| `tailwind.config.js` | Which files Tailwind scans for class names |
| `postcss.config.js` | Runs Tailwind + Autoprefixer on CSS |
| `jest.config.cjs` | Jest test runner config (jsdom, ts-jest, path aliases) |
| `jest.setup.ts` | Runs before tests (`@testing-library/jest-dom`, fetch mock) |
| `.gitignore` | Tells Git to ignore `node_modules`, `dist`, `coverage`, etc. |

## Project structure

```
src/
├── api/openMeteo.ts         # searchCities, getForecast (only HTTP layer)
├── hooks/
│   ├── useDebouncedValue.ts # delays typing before API call
│   ├── useCitySearch.ts     # React Query for geocoding
│   └── useForecast.ts       # React Query for weather
├── lib/
│   ├── rankActivities.ts    # pure scoring logic (easy to test)
│   └── weatherCodes.ts      # WMO code labels
├── components/
│   ├── CitySearch.tsx       # autocomplete combobox
│   ├── ForecastPanel.tsx    # current + 7-day forecast
│   ├── ActivityList.tsx     # ranked activities
│   ├── ErrorBoundary.tsx
│   └── ui/                  # reusable UI (Spinner, SkeletonCard, ErrorMessage, EmptyPlaceholder)
├── types/                   # TypeScript interfaces for API data
└── test/                    # fixtures + renderWithProviders
```

---

## Data flow

1. User types → `useDebouncedValue` (300ms) → `useCitySearch` → `searchCities`
2. User picks city → `useForecast` → `getForecast`
3. `rankActivities(forecast.daily)` → `ActivityList`

---

## Technical choices

- **React + TypeScript** (required)
- **TanStack Query** for caching, loading, and errors (Open-Meteo is REST, not GraphQL)
- **Jest + React Testing Library**
- **Tailwind CSS**

---

## Weather labels (`WEATHER_LABELS`)

From the **WMO Weather interpretation codes (WW)** — the standard Open-Meteo uses for `weather_code`. Documented on [Open-Meteo docs](https://open-meteo.com/en/docs). We map numbers (0 = clear, 61 = rain, 71 = snow, etc.) to readable text in `src/lib/weatherCodes.ts`.

---

## Assumptions
- Ranking uses the **first 3 forecast days**
- **Surfing** uses wind + temperature only (no wave data)
- Geocoding needs **≥ 2 characters**
- Equal activity scores use a fixed tie-break order (outdoor above skiing in hot weather)

---

## Activity ranking (business logic)

Uses the **first 3 forecast days**. Each activity gets a **score** from simple rules (not machine learning).

| Activity | What increases the score |
|----------|--------------------------|
| **Skiing** | Cold temps (≤5°C), snowfall, snow weather codes |
| **Surfing** | Warm temps (18–30°C), wind 15–40 km/h, low rain |
| **Indoor sightseeing** | Heavy rain, storms, very hot/cold days |
| **Outdoor sightseeing** | Mild temps (10–25°C), low rain, clear sky codes |

**Heuristic** = practical rule-of-thumb logic written by a human, not a trained ML model.

**Is this complexity enough?** The assessment asks for ranked activities from forecast conditions — you need *some* scoring rules. Ours are deliberately simple (if/else + points). You do **not** need ML or perfect meteorology.

Equal scores use a tie-break order (outdoor above skiing in hot weather).

---

## If forecast fails (502)

502 = Open-Meteo’s servers are down — not an app bug. Click **Try again** after a minute. Geocoding may still work when forecast is down.

---

## Future improvements (from assessment “with more time”)

| Idea | What it means |
|------|----------------|
| **MSW** | Mock Service Worker — intercepts `fetch` in tests with fake JSON, no real network |
| **localStorage** | Save last selected city so refresh doesn’t clear it — better UX for returning users |
| **Hourly chart** | We show **daily** forecast now. Hourly needs `hourly=temperature_2m,...` on the same forecast endpoint and a chart library |
| **Playwright E2E** | Automated browser tests (type “Lon”, click London, assert forecast) — catches full user-flow bugs unit tests miss |
| **i18n** | Internationalization — UI strings and labels in multiple languages (e.g. Hindi, French) |

---

## Licence

- **Weather data:** [Open-Meteo CC BY 4.0](https://open-meteo.com/) — attribute in footer (already done)
- **Your code:** Add a `LICENSE` file. MIT is common for submissions: permissive, “use freely with attribution”. Create `LICENSE` with MIT text from [choosealicense.com](https://choosealicense.com/licenses/mit/) — no registration needed.

---
