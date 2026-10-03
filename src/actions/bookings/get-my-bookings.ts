'use server';

import type { Booking, Paginated } from '@/interfaces';
import { authFetch } from '@/lib/api';

export const getMyBookings = async (
  page = 1,
  limit = 10,
): Promise<Paginated<Booking>> => {
  const response = await authFetch(
    `/me/bookings?page=${page}&limit=${limit}`,
  );

  if (!response.ok) {
    return { data: [], meta: { page, limit, total: 0, lastPage: 1 } };
  }

  return response.json();
};
