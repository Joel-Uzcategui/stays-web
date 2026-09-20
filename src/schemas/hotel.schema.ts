import { z } from 'zod';

const coordinate = (limit: number, label: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === '' || Number.isFinite(Number(value)), {
      message: `${label} must be a number`,
    })
    .refine((value) => value === '' || Math.abs(Number(value)) <= limit, {
      message: `${label} must be between -${limit} and ${limit}`,
    });

export const hotelSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(160, 'Name must be at most 160 characters'),
    description: z
      .string()
      .trim()
      .max(4000, 'Description must be at most 4000 characters'),
    country: z
      .string()
      .trim()
      .min(2, 'Country must be at least 2 characters')
      .max(80, 'Country must be at most 80 characters'),
    city: z
      .string()
      .trim()
      .min(2, 'City must be at least 2 characters')
      .max(120, 'City must be at most 120 characters'),
    address: z
      .string()
      .trim()
      .min(4, 'Address must be at least 4 characters')
      .max(240, 'Address must be at most 240 characters'),
    latitude: coordinate(90, 'Latitude'),
    longitude: coordinate(180, 'Longitude'),
  })
  .refine(
    ({ latitude, longitude }) => (latitude === '') === (longitude === ''),
    {
      message: 'Set both coordinates or leave both empty',
      path: ['longitude'],
    },
  );

export type HotelInput = z.infer<typeof hotelSchema>;
