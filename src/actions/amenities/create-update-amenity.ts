'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { authFetch, errorMessage } from '@/lib/api';
import { amenitySchema, type AmenityInput } from '@/schemas';

interface AmenityFormState {
  message?: string;
}

export const createUpdateAmenity = async (
  id: string | null,
  input: AmenityInput,
): Promise<AmenityFormState | void> => {
  const parsed = amenitySchema.safeParse(input);

  if (!parsed.success) {
    return { message: parsed.error.issues[0].message };
  }

  const { code, name, scope } = parsed.data;

  const response = await authFetch(
    id ? `/admin/amenities/${id}` : '/admin/amenities',
    {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(id ? { name, scope } : { code, name, scope }),
    },
  ).catch(() => null);

  if (!response) {
    return { message: 'The API is not reachable' };
  }

  if (!response.ok) {
    return {
      message: await errorMessage(response, 'Could not save the amenity'),
    };
  }

  revalidatePath('/admin/amenities');

  redirect('/admin/amenities');
};
