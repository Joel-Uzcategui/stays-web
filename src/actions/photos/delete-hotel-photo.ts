'use server';

import { revalidatePath } from 'next/cache';

import { authFetch, errorMessage } from '@/lib/api';

export const deleteHotelPhoto = async (
  id: string,
): Promise<{ message?: string }> => {
  const response = await authFetch(`/admin/photos/${id}`, {
    method: 'DELETE',
  }).catch(() => null);

  if (!response) {
    return { message: 'The API is not reachable' };
  }

  if (!response.ok) {
    return {
      message: await errorMessage(response, 'Could not delete the photo'),
    };
  }

  revalidatePath('/admin/hotels');
  revalidatePath('/');

  return {};
};
