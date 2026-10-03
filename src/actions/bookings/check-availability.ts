'use server';

import type { RoomAvailability } from '@/interfaces';
import { apiFetch } from '@/lib/api';

interface Options {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  rooms?: number;
  guests?: number;
}

export const checkAvailability = async ({
  hotelId,
  checkIn,
  checkOut,
  rooms,
  guests,
}: Options): Promise<RoomAvailability[]> => {
  const params = new URLSearchParams({ hotelId, checkIn, checkOut });

  if (rooms) {
    params.set('rooms', String(rooms));
  }

  if (guests) {
    params.set('guests', String(guests));
  }

  const response = await apiFetch(`/availability?${params}`);

  if (!response.ok) {
    return [];
  }

  return response.json();
};
