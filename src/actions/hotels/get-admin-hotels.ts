'use server';

import type { Hotel, Paginated } from '@/interfaces';
import { authFetch } from '@/lib/api';

interface Options {
  page?: number;
  limit?: number;
  q?: string;
  country?: string;
  cityId?: string;
  active?: boolean;
}

export const getAdminHotels = async ({
  page = 1,
  limit = 10,
  q,
  country,
  cityId,
  active = true,
}: Options = {}): Promise<Paginated<Hotel>> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    active: String(active),
  });

  if (q) {
    params.set('q', q);
  }

  if (country) {
    params.set('country', country);
  }

  if (cityId) {
    params.set('cityId', cityId);
  }

  const response = await authFetch(`/admin/hotels?${params}`);

  if (!response.ok) {
    throw new Error(`Could not load hotels: ${response.status}`);
  }

  return response.json();
};
