import { rankActivities } from '@/lib/rankActivities';
import {
  hotRainyDays,
  pleasantDays,
  rainyDays,
  snowyDays,
  surfDays,
} from '@/test/fixtures';

describe('rankActivities', () => {
  it('ranks skiing highest in snowy cold conditions', () => {
    const ranked = rankActivities(snowyDays);
    expect(ranked[0].id).toBe('skiing');
  });

  it('ranks indoor sightseeing highest in rainy conditions', () => {
    const ranked = rankActivities(rainyDays);
    expect(ranked[0].id).toBe('indoor_sightseeing');
  });

  it('ranks outdoor sightseeing highly in pleasant clear weather', () => {
    const ranked = rankActivities(pleasantDays);
    expect(ranked[0].id).toBe('outdoor_sightseeing');
  });

  it('ranks surfing highly with warm windy dry days', () => {
    const ranked = rankActivities(surfDays);
    expect(ranked[0].id).toBe('surfing');
  });

  it('returns four activities with labels and reasons', () => {
    const ranked = rankActivities(pleasantDays);
    expect(ranked).toHaveLength(4);
    ranked.forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.reason).toBeTruthy();
      expect(typeof item.score).toBe('number');
    });
  });

  it('handles empty forecast gracefully', () => {
    const ranked = rankActivities([]);
    expect(ranked).toHaveLength(4);
    expect(ranked.every((a) => a.score === 0)).toBe(true);
  });

  it('ranks outdoor above skiing when both score zero in hot rainy weather', () => {
    const ranked = rankActivities(hotRainyDays);
    const skiingIndex = ranked.findIndex((a) => a.id === 'skiing');
    const outdoorIndex = ranked.findIndex((a) => a.id === 'outdoor_sightseeing');
    expect(ranked[0].id).toBe('indoor_sightseeing');
    expect(outdoorIndex).toBeLessThan(skiingIndex);
    expect(ranked[skiingIndex].score).toBe(0);
    expect(ranked[outdoorIndex].score).toBe(0);
  });
});
