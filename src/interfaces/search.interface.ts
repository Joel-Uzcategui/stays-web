export interface SearchHotel {
  id: string;
  name: string;
  description: string | null;
  address: string;
  cityId: string;
  city: string;
  country: string;
  location: { lat: number; lon: number } | null;
  amenityCodes: string[];
  priceFrom: number | null;
  maxCapacity: number | null;
  roomTypeCount: number;
  updatedAt: string;
  distanceKm: number | null;
}

export interface SearchQuery {
  q?: string;
  country?: string;
  cityId?: string;
  priceMin?: number;
  priceMax?: number;
  guests?: number;
  amenities?: string[];
  lat?: number;
  lon?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
}

export const RADIUS_OPTIONS = [1, 5, 10] as const;
