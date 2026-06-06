import type { DailySummary } from '@/types/forecast';
import { isClearCode, isRainCode, isSnowCode } from '@/lib/weatherCodes';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivityId =
  | 'skiing'
  | 'surfing'
  | 'indoor_sightseeing'
  | 'outdoor_sightseeing';

export interface RankedActivity {
  id: ActivityId;
  label: string;
  score: number; // higher = more suitable
  reason: string; // one sentence shown in the UI
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LABELS: Record<ActivityId, string> = {
  skiing: 'Skiing',
  surfing: 'Surfing',
  indoor_sightseeing: 'Indoor sightseeing',
  outdoor_sightseeing: 'Outdoor sightseeing',
};

/**
 * Tie-break order when two activities have the same score.
 * Listed from HIGHEST priority (index 0) to LOWEST.
 * Example: outdoor beats skiing when both score equally on a mild day.
 */
const TIE_BREAK: ActivityId[] = [
  'indoor_sightseeing',
  'surfing',
  'outdoor_sightseeing',
  'skiing',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the numeric average of an array. Returns 0 for empty arrays. */
function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** We only look at today + next 2 days — the most actionable planning window. */
function getWindow(summaries: DailySummary[]): DailySummary[] {
  return summaries.slice(0, 3);
}

// ─── Scorers ──────────────────────────────────────────────────────────────────

/*
 * Each activity has its own scorer function.
 * A scorer looks at the 3-day window and awards points for favourable conditions.
 * Points cap at ~100. Higher = better fit for that activity.
 * These are heuristics (human-written rules), not machine learning.
 */

function scoreSkiing(days: DailySummary[]): { score: number; reason: string } {
  const avgMaxTemp  = avg(days.map((d) => d.temperatureMax));
  const totalSnow   = days.reduce((sum, d) => sum + d.snowfallSum, 0);
  const snowDays    = days.filter((d) => d.snowfallSum > 0 || isSnowCode(d.weatherCode)).length;

  let score = 0;

  // Temperature: must be cold — freezing or near-freezing is ideal
  if (avgMaxTemp <= 5)  score += 35;
  else if (avgMaxTemp <= 10) score += 15;

  // Snowfall: more cm = better, capped so one blizzard doesn't dominate
  score += Math.min(totalSnow * 8, 40); // e.g. 5 cm → +40 (capped)

  // Snow days: consistency matters more than one heavy dump
  score += snowDays * 10; // e.g. 3 snowy days → +30

  const reason =
    totalSnow > 0 || snowDays > 0
      ? `Cold with snowfall (${totalSnow.toFixed(1)} cm total).`
      : avgMaxTemp <= 5
        ? 'Cold temperatures suit winter sports.'
        : 'Limited snow and milder temperatures reduce ski suitability.';

  return { score, reason };
}

function scoreSurfing(days: DailySummary[]): { score: number; reason: string } {
  const avgMaxTemp = avg(days.map((d) => d.temperatureMax));
  const avgWind    = avg(days.map((d) => d.windSpeedMax));
  const avgPrecip  = avg(days.map((d) => d.precipitationSum));

  let score = 0;

  // Temperature: warm water/air makes surfing enjoyable
  if (avgMaxTemp >= 18 && avgMaxTemp <= 30) score += 35;
  else if (avgMaxTemp >= 15)               score += 15;

  // Wind: 15–40 km/h is the sweet spot — enough swell, not dangerously rough
  if (avgWind >= 15 && avgWind <= 40) score += 35;
  else if (avgWind > 40)              score += 10; // too strong — still some signal

  // Rain: light rain is fine for surfing, heavy rain is not
  if (avgPrecip < 2)  score += 25;
  else if (avgPrecip < 5) score += 10;

  const reason =
    avgWind >= 15 && avgMaxTemp >= 18
      ? `Warm (${avgMaxTemp.toFixed(0)}°C) with useful wind (${avgWind.toFixed(0)} km/h).`
      : 'Wind or temperature are less ideal for surfing.';

  return { score, reason };
}

function scoreIndoor(days: DailySummary[]): { score: number; reason: string } {
  const avgPrecip  = avg(days.map((d) => d.precipitationSum));
  const avgMaxTemp = avg(days.map((d) => d.temperatureMax));
  const rainyDays  = days.filter((d) => d.precipitationSum > 3 || isRainCode(d.weatherCode)).length;

  let score = 0;

  // More rain = stronger push indoors, capped so a monsoon doesn't score 200
  score += Math.min(avgPrecip * 5, 35); // e.g. 8mm avg → +35 (capped)

  // Each rainy day adds weight — consistent bad weather matters
  score += rainyDays * 15; // e.g. 3 rainy days → +45

  // Extreme temps (very cold or very hot) also push people indoors
  if (avgMaxTemp < 0 || avgMaxTemp > 35) score += 25;

  // Thunderstorms — the strongest "stay inside" signal
  if (days.some((d) => d.weatherCode >= 95)) score += 20;

  const reason =
    rainyDays > 0 || avgPrecip > 3
      ? `Wet or stormy spells (${rainyDays} rainy day(s)).`
      : avgMaxTemp < 0 || avgMaxTemp > 35
        ? 'Extreme temperatures make indoor plans more comfortable.'
        : 'Weather is fair; indoor activities are less urgent.';

  return { score, reason };
}

function scoreOutdoor(days: DailySummary[]): { score: number; reason: string } {
  const avgMaxTemp = avg(days.map((d) => d.temperatureMax));
  const avgPrecip  = avg(days.map((d) => d.precipitationSum));
  const clearDays  = days.filter((d) => isClearCode(d.weatherCode)).length;

  let score = 0;

  // Mild temperature range — comfortable for walking around a city
  if (avgMaxTemp >= 10 && avgMaxTemp <= 25) score += 35;
  else if (avgMaxTemp >= 5 && avgMaxTemp < 10) score += 15;

  // Low rain is the biggest factor for outdoor comfort
  if (avgPrecip < 2) score += 30;

  // Clear sky days are a bonus — each one adds value
  score += clearDays * 12; // e.g. 2 clear days → +24

  const reason =
    clearDays > 0 && avgPrecip < 2
      ? `Mild and dry (${clearDays} clear day(s), ${avgMaxTemp.toFixed(0)}°C avg).`
      : 'Cloud, rain, or temperature limit outdoor sightseeing comfort.';

  return { score, reason };
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Takes the full forecast, scores all four activities against the first 3 days,
 * and returns them sorted from most to least suitable.
 *
 * Pure function — no side effects, no React, no fetch.
 * Same input always produces the same output. Easy to unit test.
 */
export function rankActivities(summaries: DailySummary[]): RankedActivity[] {
  const window = getWindow(summaries);

  // Edge case: no forecast data — return all activities at score 0
  if (window.length === 0) {
    return (Object.keys(LABELS) as ActivityId[]).map((id) => ({
      id,
      label: LABELS[id],
      score: 0,
      reason: 'No forecast data available.',
    }));
  }

  // Score each activity
  const results: RankedActivity[] = [
    { id: 'skiing', ...scoreSkiing(window),  label: LABELS.skiing },
    { id: 'surfing', ...scoreSurfing(window), label: LABELS.surfing },
    { id: 'indoor_sightseeing', ...scoreIndoor(window),  label: LABELS.indoor_sightseeing },
    { id: 'outdoor_sightseeing', ...scoreOutdoor(window), label: LABELS.outdoor_sightseeing },
  ];

  // Sort: highest score first. Ties broken by TIE_BREAK order above.
  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return TIE_BREAK.indexOf(a.id) - TIE_BREAK.indexOf(b.id);
  });
}