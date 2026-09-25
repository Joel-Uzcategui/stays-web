'use server';

import type { Hotel } from '@/interfaces';

export const getHotel = async (id: string): Promise<Hotel | null> => {
  const response = await fetch(`${process.env.API_URL}/hotels/${id}`, {
    cache: 'no-store',
  });

  if (response.status === 404 || response.status === 400) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Could not load hotel: ${response.status}`);
  }

  return response.json();
};
