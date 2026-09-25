'use server';

import type { Paginated, SearchHotel, SearchQuery } from '@/interfaces';

export const searchHotels = async (
  query: SearchQuery = {},
): Promise<Paginated<SearchHotel>> => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === '' || value === null) {
      continue;
    }

    params.set(key, Array.isArray(value) ? value.join(',') : String(value));
  }

  const response = await fetch(`${process.env.API_URL}/search?${params}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Could not search hotels: ${response.status}`);
  }

  return response.json();
};
