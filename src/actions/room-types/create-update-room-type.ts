'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authFetch, errorMessage } from '@/lib/api';
import { roomTypeSchema, toCents, type RoomTypeInput } from '@/schemas';

interface RoomTypeFormState {
  message?: string;
}

export const createUpdateRoomType = async (
  id: string | null,
  input: RoomTypeInput,
): Promise<RoomTypeFormState | void> => {
  const parsed = roomTypeSchema.safeParse(input);

  if (!parsed.success) {
    return { message: parsed.error.issues[0].message };
  }

  const { hotelId, name, description, capacity, price, defaultUnits, amenityIds } =
    parsed.data;

  const base = `/admin/hotels/${hotelId}/room-types`;

  const response = await authFetch(id ? `${base}/${id}` : base, {
    method: id ? 'PATCH' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      description,
      capacity: Number(capacity),
      priceCents: toCents(price),
      defaultUnits: Number(defaultUnits),
      amenityIds,
    }),
  }).catch(() => null);

  if (!response) {
    return { message: 'The API is not reachable' };
  }

  if (!response.ok) {
    return {
      message: await errorMessage(response, 'Could not save the room type'),
    };
  }

  revalidatePath('/admin/room-types');

  redirect("/admin/room-types");
};
