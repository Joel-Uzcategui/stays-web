'use server';

import type { Amenity } from '@/interfaces';

export const getHotelAmenities = async (
  hotelId: string,
): Promise<Amenity[]> => {
  const response = await fetch(
    `${process.env.API_URL}/hotels/${hotelId}/amenities`,
    { cache: 'no-store' },
  );

  if (!response.ok) {
    throw new Error(`Could not load hotel amenities: ${response.status}`);
  }

  return response.json();
};
