'use server';

import type { RoomType } from '@/interfaces';
import { authFetch } from '@/lib/api';

export const getAdminRoomType = async (
  hotelId: string,
  id: string,
): Promise<RoomType | null> => {
  const response = await authFetch(
    `/admin/hotels/${hotelId}/room-types/${id}`,
  );

  return response.ok ? response.json() : null;
};
