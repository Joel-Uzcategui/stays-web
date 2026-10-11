'use server';

import type { Payment } from '@/interfaces';
import { authFetch, requireSession } from '@/lib/api';

export const getBookingPayment = async (
  bookingId: string,
): Promise<Payment | null> => {
  const response = await authFetch(`/bookings/${bookingId}/payment`);

  requireSession(response);

  if (!response.ok) {
    return null;
  }

  const body = await response.json();

  return body?.payment ?? null;
};
