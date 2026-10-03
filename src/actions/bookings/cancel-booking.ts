'use server';

import { revalidatePath } from 'next/cache';

import { authFetch, errorMessage } from '@/lib/api';

export const cancelBooking = async (id: string) => {
  const response = await authFetch(`/bookings/${id}/cancel`, {
    method: 'POST',
  });

  if (!response.ok) {
    return {
      ok: false as const,
      error: await errorMessage(response, 'Could not cancel the booking'),
    };
  }

  revalidatePath('/me/bookings');

  return { ok: true as const };
};
