export interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country: string;
  country_code: string;
  admin1?: string;
}

export interface GeoSearchResponse {
  results?: GeoResult[];
}
