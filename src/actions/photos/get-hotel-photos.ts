'use server';

import type { Photo } from '@/interfaces';
import { authFetch } from '@/lib/api';

export const getHotelPhotos = async (hotelId: string): Promise<Photo[]> => {
  const response = await authFetch(`/admin/hotels/${hotelId}/photos`);

  if (!response.ok) {
    return [];
  }

  return response.json();
};
