'use server';

import type { Booking, BookingGroup, Paginated } from '@/interfaces';
import { authFetch, requireSession } from '@/lib/api';

export const getMyBookings = async (
  page = 1,
  limit = 10,
  group: BookingGroup = 'active',
): Promise<Paginated<Booking>> => {
  const response = await authFetch(
    `/me/bookings?page=${page}&limit=${limit}&group=${group}`,
  );

  requireSession(response);

  if (!response.ok) {
    return { data: [], meta: { page, limit, total: 0, lastPage: 1 } };
  }

  return response.json();
};
