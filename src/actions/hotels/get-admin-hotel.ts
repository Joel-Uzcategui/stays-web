'use server';

import type { Hotel } from '@/interfaces';
import { authFetch } from '@/lib/api';

export const getAdminHotel = async (id: string): Promise<Hotel | null> => {
  const response = await authFetch(`/admin/hotels/${id}`);

  if (!response.ok) {
    return null;
  }

  return response.json();
};
