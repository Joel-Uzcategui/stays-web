'use server';

import type { Amenity, AmenityScope, Paginated } from '@/interfaces';
import { authFetch } from '@/lib/api';

interface Options {
  q?: string;
  scope?: AmenityScope;
  page?: number;
  limit?: number;
  active?: boolean;
}

export const getAdminAmenities = async ({
  q,
  scope,
  page = 1,
  limit = 20,
  active = true,
}: Options = {}): Promise<Paginated<Amenity>> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    active: String(active),
  });

  if (q) {
    params.set('q', q);
  }

  if (scope) {
    params.set('scope', scope);
  }

  const response = await authFetch(`/admin/amenities?${params}`);

  if (!response.ok) {
    throw new Error(`Could not load amenities: ${response.status}`);
  }

  return response.json();
};
