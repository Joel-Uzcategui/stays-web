import { z } from 'zod';

import { AMENITY_SCOPES } from '@/interfaces';

export const amenitySchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, 'Code must be at least 2 characters')
    .max(60, 'Code must be at most 60 characters')
    .regex(
      /^[a-z0-9_]+$/,
      'Code allows only lowercase letters, numbers and underscores',
    ),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name must be at most 120 characters'),
  scope: z.enum(AMENITY_SCOPES),
});

export type AmenityInput = z.infer<typeof amenitySchema>;
