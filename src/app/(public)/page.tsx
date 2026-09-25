import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { searchHotels } from '@/actions';
import { HotelCard } from '@/components';

export default async function HomePage() {
  const { data: hotels, meta } = await searchHotels({ limit: 6 });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <p className="kicker text-accent">The catalog</p>
      <h1 className="mt-1 text-4xl">Hotels</h1>
      <p className="mt-2 text-sm text-muted">
        {meta.total} {meta.total === 1 ? 'property' : 'properties'} available
      </p>

      <Link
        href="/search"
        className="mt-5 inline-flex items-center gap-1.5 rounded bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
      >
        Search by city, price or map
        <ArrowRight size={15} strokeWidth={2} />
      </Link>

      {hotels.length === 0 ? (
        <p className="mt-9 text-muted">No hotels available yet.</p>
      ) : (
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </main>
  );
}
