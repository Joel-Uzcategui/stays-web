import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { CreditCard } from 'lucide-react';

import { getBooking, getBookingPayment, getHotel } from '@/actions';
import { CancelButton } from '@/components';
import type { Booking } from '@/interfaces';
import { isCancellable } from '@/lib/bookings';
import { getCurrentUser } from '@/lib/session-store';

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);

const tone: Record<string, string> = {
  held: 'border-accent text-accent-ink',
  confirmed: 'border-accent bg-accent-tint text-accent-ink',
  cancelled: 'border-line text-faint',
  expired: 'border-line text-faint',
  failed: 'border-line text-faint',
  refunded: 'border-line text-muted',
};

const day = (value: string) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(
    new Date(value),
  );

const policy = (booking: Booking) => {
  const today = new Date().toISOString().slice(0, 10);

  if (booking.checkIn <= today) {
    return 'The stay has started, so it can no longer be cancelled.';
  }

  if (!booking.refundableUntil) {
    return 'This booking is non-refundable.';
  }

  return new Date(booking.refundableUntil) > new Date()
    ? `Free cancellation until ${day(booking.refundableUntil)}.`
    : `The free cancellation window closed on ${day(booking.refundableUntil)}. Cancelling now does not refund the payment.`;
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) {
    notFound();
  }

  const [hotel, payment] = await Promise.all([
    getHotel(booking.hotelId),
    getBookingPayment(id),
  ]);

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10">
      <Link href="/me/bookings" className="kicker text-accent">
        ← Your stays
      </Link>

      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-4xl">{hotel?.name ?? 'Booking'}</h1>
        <span
          className={`mt-2 rounded-full border px-2.5 py-0.5 text-xs ${tone[booking.status] ?? 'border-line text-muted'}`}
        >
          {booking.status}
        </span>
      </div>

      {hotel && (
        <p className="mt-1 text-sm text-faint">
          {hotel.address}, {hotel.city}
        </p>
      )}

      <dl className="mt-6 flex flex-col gap-1.5 rounded border border-line px-4 py-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-faint">Check-in</dt>
          <dd>{booking.checkIn}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-faint">Check-out</dt>
          <dd>{booking.checkOut}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-faint">Rooms</dt>
          <dd>{booking.units}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-1.5">
          <dt className="text-faint">Total</dt>
          <dd className="font-heading text-lg text-accent-ink">
            {money(booking.totalCents, booking.currency)}
          </dd>
        </div>
      </dl>

      {booking.status === 'confirmed' && (
        <p className="mt-2 text-sm text-muted">{policy(booking)}</p>
      )}

      <h2 className="kicker mt-8 text-muted">Payment</h2>

      {!payment && (
        <p className="mt-2 rounded border border-line px-4 py-4 text-sm text-faint">
          No payment has been started for this booking.
        </p>
      )}

      {payment && (
        <div className="mt-2 rounded border border-line px-4 py-4 text-sm">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <CreditCard size={15} strokeWidth={1.5} className="text-muted" />
            <span className="font-medium">
              {payment.cardBrand && payment.cardLast4
                ? `${payment.cardBrand} ···${payment.cardLast4}`
                : payment.status === 'succeeded'
                  ? 'Paid'
                  : 'Not completed'}
            </span>
            <span className="text-faint">
              {money(payment.amountCents, payment.currency)}
            </span>
            <span className="ml-auto text-xs text-faint">{payment.status}</span>
          </div>

          {payment.failureReason && (
            <p className="mt-2 text-muted">{payment.failureReason}</p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {booking.status === 'held' && (
          <Link
            href={`/bookings/${booking.bookingId}/pay`}
            className="rounded bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Pay now
          </Link>
        )}

        {isCancellable(booking) && (
          <CancelButton bookingId={booking.bookingId} />
        )}
      </div>
    </main>
  );
}
