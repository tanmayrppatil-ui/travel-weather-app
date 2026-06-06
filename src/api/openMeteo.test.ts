import { getForecast, searchCities } from '@/api/openMeteo';

function mockOkResponse(body: object): Response {
  return {
    ok: true,
    json: async () => body,
  } as Response;
}

describe('openMeteo API', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('searchCities returns empty array for short queries without fetching', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const results = await searchCities('L');
    expect(results).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('searchCities builds correct URL and maps results', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      mockOkResponse({
        results: [
          {
            id: 1,
            name: 'London',
            latitude: 51.5,
            longitude: -0.1,
            timezone: 'Europe/London',
            country: 'United Kingdom',
            country_code: 'GB',
          },
        ],
      }),
    );

    const results = await searchCities('Lon');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('London');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('geocoding-api.open-meteo.com/v1/search'),
      expect.any(Object),
    );
  });

  it('getForecast maps daily and current fields', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      mockOkResponse({
        timezone: 'Europe/London',
        current: {
          time: '2026-06-01T12:00',
          temperature_2m: 20,
          weather_code: 1,
          wind_speed_10m: 12,
        },
        daily: {
          time: ['2026-06-01'],
          temperature_2m_max: [22],
          temperature_2m_min: [14],
          precipitation_sum: [0],
          snowfall_sum: [0],
          weather_code: [1],
          wind_speed_10m_max: [15],
        },
      }),
    );

    const forecast = await getForecast(51.5, -0.1, 'Europe/London');
    expect(forecast.daily).toHaveLength(1);
    expect(forecast.current.temperature).toBe(20);
  });
});
