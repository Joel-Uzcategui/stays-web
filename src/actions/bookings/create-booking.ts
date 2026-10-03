'use server';

import { revalidatePath } from 'next/cache';

import type { Booking } from '@/interfaces';
import { authFetch, errorMessage } from '@/lib/api';

interface Options {
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  units: number;
}

type Result =
  | { ok: true; booking: Booking }
  | { ok: false; error: string; needsLogin?: boolean };

export const createBooking = async (options: Options): Promise<Result> => {
  const response = await authFetch('/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify(options),
  });

  if (response.status === 401) {
    return { ok: false, error: 'Sign in to book a room', needsLogin: true };
  }

  if (!response.ok) {
    return {
      ok: false,
      error: await errorMessage(response, 'Could not create the booking'),
    };
  }

  revalidatePath('/me/bookings');

  return { ok: true, booking: await response.json() };
};
