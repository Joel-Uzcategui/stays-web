'use server';

import type { Payment } from '@/interfaces';
import { authFetch, errorMessage } from '@/lib/api';

type Result = { ok: true; payment: Payment } | { ok: false; error: string };

export const createPaymentIntent = async (
  bookingId: string,
): Promise<Result> => {
  const response = await authFetch(`/bookings/${bookingId}/payment`, {
    method: 'POST',
  });

  if (!response.ok) {
    return {
      ok: false,
      error: await errorMessage(response, 'Could not start the payment'),
    };
  }

  return { ok: true, payment: await response.json() };
};
