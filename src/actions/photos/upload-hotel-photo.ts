'use server';

import { revalidatePath } from 'next/cache';

import { authFetch, errorMessage } from '@/lib/api';

export const uploadHotelPhoto = async (
  hotelId: string,
  formData: FormData,
): Promise<{ message?: string }> => {
  const photo = formData.get('photo');

  if (!(photo instanceof File) || photo.size === 0) {
    return { message: 'Choose an image first' };
  }

  const body = new FormData();
  body.append('photo', photo);

  // No Content-Type: fetch has to set it with its own multipart boundary.
  const response = await authFetch(`/admin/hotels/${hotelId}/photos/upload`, {
    method: 'POST',
    body,
  }).catch(() => null);

  if (!response) {
    return { message: 'The API is not reachable' };
  }

  if (!response.ok) {
    return {
      message: await errorMessage(response, 'Could not upload the photo'),
    };
  }

  revalidatePath('/admin/hotels');
  revalidatePath('/');

  return {};
};
