'use server';

import type { Photo } from '@/interfaces';
import { apiFetch } from '@/lib/api';

export const getPublicHotelPhotos = async (
  hotelId: string,
): Promise<Photo[]> => {
  const response = await apiFetch(`/hotels/${hotelId}/photos`).catch(() => null);

  if (!response?.ok) {
    return [];
  }

  return response.json();
};
