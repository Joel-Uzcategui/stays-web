export interface RoomAvailability {
  roomTypeId: string;
  name: string;
  capacity: number;
  nights: number;
  rooms: number;
  sleeps: number;
  unitsLeft: number;
  priceCents: number;
  currency: string;
  totalPrice: number;
}

export type BookingGroup = 'active' | 'past' | 'cancelled';

export type BookingStatus =
  | 'held'
  | 'confirmed'
  | 'cancelled'
  | 'expired'
  | 'failed'
  | 'refunded';

export interface Booking {
  bookingId: string;
  status: BookingStatus;
  hotelId: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  units: number;
  totalCents: number;
  currency: string;
  expiresAt: string | null;
  refundableUntil: string | null;
}
