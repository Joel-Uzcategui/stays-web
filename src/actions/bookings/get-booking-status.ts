'use server';

import type { BookingStatus } from '@/interfaces';
import { authFetch } from '@/lib/api';

export const getBookingStatus = async (
  id: string,
): Promise<BookingStatus | null> => {
  const response = await authFetch(`/bookings/${id}`);

  if (!response.ok) {
    return null;
  }

  const booking = await response.json();

  return booking?.status ?? null;
};
