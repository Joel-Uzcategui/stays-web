import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { createPaymentIntent, getBooking } from '@/actions';
import { getCurrentUser } from '@/lib/session-store';

import { PaymentForm } from './ui/PaymentForm';

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);

const settled: Record<string, string> = {
  confirmed: 'This booking is already paid and confirmed.',
  cancelled: 'This booking was cancelled.',
  expired: 'The hold on this booking expired before it was paid.',
  failed: 'This booking could not be completed.',
  refunded: 'This booking was refunded.',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PayPage({ params }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) {
    notFound();
  }

  const intent =
    booking.status === 'held' ? await createPaymentIntent(id) : null;

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10">
      <p className="kicker text-accent">Checkout</p>
      <h1 className="mt-1 text-4xl">Pay for your stay</h1>

      <dl className="mt-6 flex flex-col gap-1.5 rounded border border-line px-4 py-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-faint">Dates</dt>
          <dd>
            {booking.checkIn} → {booking.checkOut}
          </dd>
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

      <div className="mt-6">
        {booking.status !== 'held' && (
          <div className="rounded border border-line px-4 py-5 text-sm">
            <p className="text-muted">
              {settled[booking.status] ?? 'This booking cannot be paid.'}
            </p>
            <Link
              href="/me/bookings"
              className="mt-2 inline-block text-accent underline"
            >
              See your bookings
            </Link>
          </div>
        )}

        {intent?.ok === false && (
          <p className="rounded border border-line bg-white/50 px-3 py-2 text-sm text-muted">
            {intent.error}
          </p>
        )}

        {intent?.ok && intent.payment.clientSecret && (
          <PaymentForm
            bookingId={booking.bookingId}
            clientSecret={intent.payment.clientSecret}
            amountCents={intent.payment.amountCents}
            currency={intent.payment.currency}
          />
        )}
      </div>
    </main>
  );
}
