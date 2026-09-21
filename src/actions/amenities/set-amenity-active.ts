'use server';

import { revalidatePath } from 'next/cache';

import { authFetch } from '@/lib/api';

export const setAmenityActive = async (id: string, active: boolean) => {
  const url = `/admin/amenities/${id}`;

  const response = active
    ? await authFetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: true }),
      })
    : await authFetch(url, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`Could not update the amenity: ${response.status}`);
  }

  revalidatePath('/admin/amenities');
};
