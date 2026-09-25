'use server';

import type { Paginated, RoomType } from '@/interfaces';

const MAX_ROOM_TYPES = 50;

export const getHotelRoomTypes = async (
  hotelId: string,
): Promise<RoomType[]> => {
  const params = new URLSearchParams({ limit: String(MAX_ROOM_TYPES) });

  const response = await fetch(
    `${process.env.API_URL}/hotels/${hotelId}/room-types?${params}`,
    { cache: 'no-store' },
  );

  if (!response.ok) {
    throw new Error(`Could not load room types: ${response.status}`);
  }

  const { data }: Paginated<RoomType> = await response.json();

  return data;
};
