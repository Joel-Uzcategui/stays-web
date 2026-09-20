'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authFetch, errorMessage } from '@/lib/api';
import { hotelSchema, type HotelInput } from '@/schemas';

interface HotelFormState {
  message?: string;
}

const optionalNumber = (raw: string) =>
  raw.trim() === '' ? undefined : Number(raw);

export const createUpdateHotel = async (
  id: string | null,
  input: HotelInput,
): Promise<HotelFormState | void> => {
  const parsed = hotelSchema.safeParse(input);

  if (!parsed.success) {
    return { message: parsed.error.issues[0].message };
  }

  const hotel = parsed.data;

  const response = await authFetch(id ? `/admin/hotels/${id}` : '/admin/hotels', {
    method: id ? 'PATCH' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: hotel.name,
      country: hotel.country,
      city: hotel.city,
      address: hotel.address,
      description: hotel.description,
      latitude: optionalNumber(hotel.latitude),
      longitude: optionalNumber(hotel.longitude),
    }),
  }).catch(() => null);

  if (!response) {
    return { message: 'The API is not reachable' };
  }

  if (!response.ok) {
    return { message: await errorMessage(response, 'Could not save the hotel') };
  }

  revalidatePath('/admin/hotels');
  revalidatePath('/');

  redirect('/admin/hotels');
};
