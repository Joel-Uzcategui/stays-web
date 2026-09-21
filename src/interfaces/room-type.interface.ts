import type { Amenity } from './amenity.interface';

export interface RoomType {
  id: string;
  hotelId: string;
  name: string;
  description: string | null;
  capacity: number;
  priceCents: number;
  currency: string;
  defaultUnits: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  hotel?: { name: string };
  amenities?: Amenity[];
}
