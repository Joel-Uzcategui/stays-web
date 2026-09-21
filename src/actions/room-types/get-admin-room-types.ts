'use server';

import type { Paginated, RoomType } from '@/interfaces';
import { authFetch } from '@/lib/api';

interface Options {
  hotelId?: string;
  q?: string;
  page?: number;
  limit?: number;
  active?: boolean;
}

export const getAdminRoomTypes = async ({
  hotelId,
  q,
  page = 1,
  limit = 20,
  active = true,
}: Options = {}): Promise<Paginated<RoomType>> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    active: String(active),
  });

  if (hotelId) {
    params.set('hotelId', hotelId);
  }

  if (q) {
    params.set('q', q);
  }

  const response = await authFetch(`/admin/room-types?${params}`);

  if (!response.ok) {
    throw new Error(`Could not load room types: ${response.status}`);
  }

  return response.json();
};
