export interface DailySummary {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
  snowfallSum: number;
  weatherCode: number;
  windSpeedMax: number;
}

export interface CurrentWeather {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
}

export interface ForecastData {
  daily: DailySummary[];
  current: CurrentWeather;
  timezone: string;
}

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current?: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    snowfall_sum: number[];
    weather_code: number[];
    wind_speed_10m_max: number[];
  };
  error?: boolean;
  reason?: string;
}
