import type { Booking } from '@/interfaces';

export const isCancellable = (booking: Booking) => {
  const today = new Date().toISOString().slice(0, 10);

  return (
    booking.status === 'held' ||
    (booking.status === 'confirmed' && booking.checkIn > today)
  );
};
