'use server';

import { revalidatePath } from 'next/cache';

import { authFetch, errorMessage } from '@/lib/api';

export const reorderHotelPhotos = async (
  hotelId: string,
  ids: string[],
): Promise<{ message?: string }> => {
  const response = await authFetch(`/admin/hotels/${hotelId}/photos/order`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  }).catch(() => null);

  if (!response) {
    return { message: 'The API is not reachable' };
  }

  if (!response.ok) {
    return {
      message: await errorMessage(response, 'Could not reorder the photos'),
    };
  }

  revalidatePath('/admin/hotels');
  revalidatePath('/');

  return {};
};
