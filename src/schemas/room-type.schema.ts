import { z } from 'zod';

const integer = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .refine((v) => /^\d+$/.test(v), { message: `${label} must be a whole number` })
    .refine((v) => Number(v) >= min && Number(v) <= max, {
      message: `${label} must be between ${min} and ${max}`,
    });

export const roomTypeSchema = z.object({
  hotelId: z.uuid('Pick a hotel'),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(160, 'Name must be at most 160 characters'),
  description: z
    .string()
    .trim()
    .max(4000, 'Description must be at most 4000 characters'),
  capacity: integer('Capacity', 1, 20),
  price: z
    .string()
    .trim()
    .refine((v) => /^\d+([.,]\d{1,2})?$/.test(v), {
      message: 'Price must be an amount like 125 or 125.50',
    }),
  defaultUnits: integer('Units', 0, 5000),
  amenityIds: z.array(z.uuid()),
});

export type RoomTypeInput = z.infer<typeof roomTypeSchema>;

export const toCents = (price: string) =>
  Math.round(Number(price.replace(',', '.')) * 100);

export const toPrice = (cents: number) => (cents / 100).toFixed(2);
