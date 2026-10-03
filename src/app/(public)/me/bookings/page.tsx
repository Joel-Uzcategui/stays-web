import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getMyBookings } from '@/actions';
import { Pagination } from '@/components';
import { getCurrentUser } from '@/lib/session-store';

import { CancelButton } from './ui/CancelButton';

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

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function MyBookingsPage({ searchParams }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { page } = await searchParams;
  const { data, meta } = await getMyBookings(Number(page) || 1);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <p className="kicker text-accent">Your stays</p>
      <h1 className="mt-1 text-4xl">Bookings</h1>

      {data.length === 0 ? (
        <div className="mt-8 rounded border border-line px-4 py-16 text-center">
          <p className="text-muted">You have no bookings yet.</p>
          <Link
            href="/search"
            className="mt-2 inline-block text-sm text-accent underline"
          >
            Find a place to stay
          </Link>
        </div>
      ) : (
        <div className="mt-8 rounded border border-line">
          <ul className="divide-y divide-line">
            {data.map((booking) => (
              <li
                key={booking.bookingId}
                className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/hotels/${booking.hotelId}`}
                    className="font-heading text-lg leading-tight transition-colors hover:text-accent"
                  >
                    {booking.checkIn} → {booking.checkOut}
                  </Link>
                  <p className="mt-0.5 text-xs text-faint">
                    {booking.units} {booking.units === 1 ? 'room' : 'rooms'} ·{' '}
                    {money(booking.totalCents, booking.currency)}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs ${tone[booking.status] ?? 'border-line text-muted'}`}
                >
                  {booking.status}
                </span>

                {(booking.status === 'held' ||
                  booking.status === 'confirmed') && (
                  <CancelButton bookingId={booking.bookingId} />
                )}
              </li>
            ))}
          </ul>

          <Pagination
            page={meta.page}
            lastPage={meta.lastPage}
            total={meta.total}
            noun={['booking', 'bookings']}
          />
        </div>
      )}
    </main>
  );
}
