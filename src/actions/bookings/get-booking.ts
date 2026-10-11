'use server';

import type { Booking } from '@/interfaces';
import { authFetch, requireSession } from '@/lib/api';

export const getBooking = async (id: string): Promise<Booking | null> => {
  const response = await authFetch(`/bookings/${id}`);

  requireSession(response);

  if (!response.ok) {
    return null;
  }

  return response.json();
};
