'use server';

import { authFetch } from '@/lib/api';

export const getCityCountries = async (): Promise<string[]> => {
  const response = await authFetch('/admin/cities/countries');

  if (!response.ok) {
    throw new Error(`Could not load countries: ${response.status}`);
  }

  return response.json();
};
