'use server';

import type { Amenity, AmenityScope } from '@/interfaces';
import { authFetch } from '@/lib/api';

interface Options {
  q?: string;
  scope: AmenityScope;
  limit?: number;
}

export const searchAmenities = async ({
  q,
  scope,
  limit = 20,
}: Options): Promise<Amenity[]> => {
  const params = new URLSearchParams({
    scope,
    limit: String(limit),
    active: 'true',
  });

  if (q) {
    params.set('q', q);
  }

  const response = await authFetch(`/admin/amenities?${params}`);

  if (!response.ok) {
    throw new Error(`Could not search amenities: ${response.status}`);
  }

  const { data } = await response.json();

  return data;
};
