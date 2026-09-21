'use server';

import type { Amenity } from '@/interfaces';
import { authFetch } from '@/lib/api';

export const getAdminAmenity = async (id: string): Promise<Amenity | null> => {
  const response = await authFetch(`/admin/amenities/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Could not load the amenity: ${response.status}`);
  }

  return response.json();
};
