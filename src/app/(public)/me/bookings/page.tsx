import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getMyBookings } from '@/actions';
import { CancelButton, Pagination } from '@/components';
import type { BookingGroup } from '@/interfaces';
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

const tabs: { group: BookingGroup; label: string; empty: string }[] = [
  { group: 'active', label: 'Active', empty: 'You have no upcoming stays.' },
  { group: 'past', label: 'Past', empty: 'You have no past stays yet.' },
  {
    group: 'cancelled',
    label: 'Cancelled',
    empty: 'You have not cancelled any booking.',
  },
];

const isGroup = (value?: string): value is BookingGroup =>
  tabs.some((tab) => tab.group === value);

interface Props {
  searchParams: Promise<{ page?: string; group?: string }>;
}

export default async function MyBookingsPage({ searchParams }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { page, group } = await searchParams;
  const current = isGroup(group) ? group : 'active';
  const active = tabs.find((tab) => tab.group === current) ?? tabs[0];

  const { data, meta } = await getMyBookings(Number(page) || 1, 10, current);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <p className="kicker text-accent">Your stays</p>
      <h1 className="mt-1 text-4xl">Bookings</h1>

      <nav className="mt-6 flex gap-1 border-b border-line">
        {tabs.map((tab) => (
          <Link
            key={tab.group}
            href={`?group=${tab.group}`}
            aria-current={tab.group === current ? 'page' : undefined}
            className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${
              tab.group === current
                ? 'border-accent font-medium text-accent-ink'
                : 'border-transparent text-muted hover:text-accent'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {data.length === 0 ? (
        <div className="mt-8 rounded border border-line px-4 py-16 text-center">
          <p className="text-muted">{active.empty}</p>
          <Link
            href="/search"
            className="mt-2 inline-block text-sm text-accent underline"
          >
            Find a place to stay
          </Link>
        </div>
      ) : (
        <div className="mt-6 rounded border border-line">
          <ul className="divide-y divide-line">
            {data.map((booking) => (
              <li
                key={booking.bookingId}
                className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/bookings/${booking.bookingId}`}
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

                {booking.status === 'held' && (
                  <Link
                    href={`/bookings/${booking.bookingId}/pay`}
                    className="rounded bg-accent px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Pay
                  </Link>
                )}

                {isCancellable(booking) && (
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
            params={{ group: current }}
          />
        </div>
      )}
    </main>
  );
}
