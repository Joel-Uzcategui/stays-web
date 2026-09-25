'use server';

import type { Amenity, AmenityScope, Paginated } from '@/interfaces';

const MAX_AMENITIES = 200;

export const getPublicAmenities = async (
  scope?: AmenityScope,
): Promise<Amenity[]> => {
  const params = new URLSearchParams({ limit: String(MAX_AMENITIES) });

  if (scope) {
    params.set('scope', scope);
  }

  const response = await fetch(`${process.env.API_URL}/amenities?${params}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Could not load amenities: ${response.status}`);
  }

  const { data }: Paginated<Amenity> = await response.json();

  return data;
};
