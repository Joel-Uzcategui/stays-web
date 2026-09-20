'use server';

import type { Hotel, Paginated } from '@/interfaces';

interface Options {
  page?: number;
  limit?: number;
  q?: string;
}

export const getHotels = async ({
  page = 1,
  limit = 12,
  q,
}: Options = {}): Promise<Paginated<Hotel>> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (q) {
    params.set('q', q);
  }

  const response = await fetch(`${process.env.API_URL}/hotels?${params}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Could not load hotels: ${response.status}`);
  }

  return response.json();
};
