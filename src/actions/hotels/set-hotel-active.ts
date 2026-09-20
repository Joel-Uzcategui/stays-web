'use server';

import { revalidatePath } from 'next/cache';

import { authFetch } from '@/lib/api';

export const setHotelActive = async (id: string, active: boolean) => {
  const response = active
    ? await authFetch(`/admin/hotels/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: true }),
      })
    : await authFetch(`/admin/hotels/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`Could not update the hotel: ${response.status}`);
  }

  revalidatePath('/admin/hotels');
  revalidatePath('/');
};
