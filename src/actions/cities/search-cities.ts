'use server';

import type { City } from '@/interfaces';
import { authFetch } from '@/lib/api';

interface Options {
  q?: string;
  country?: string;
  limit?: number;
}

export const searchCities = async ({
  q,
  country,
  limit = 10,
}: Options = {}): Promise<City[]> => {
  const params = new URLSearchParams({ limit: String(limit) });

  if (q) {
    params.set('q', q);
  }

  if (country) {
    params.set('country', country);
  }

  const response = await authFetch(`/admin/cities?${params}`);

  if (!response.ok) {
    throw new Error(`Could not search cities: ${response.status}`);
  }

  return response.json();
};
