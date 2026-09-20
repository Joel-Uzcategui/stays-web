import { getHotels } from '@/actions';
import { HotelGrid } from '@/components';

export default async function HomePage() {
  const { data: hotels, meta } = await getHotels();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <p className="kicker text-accent">The catalog</p>
      <h1 className="mt-1 text-4xl">Hotels</h1>
      <p className="mt-2 mb-9 text-sm text-muted">
        {meta.total} {meta.total === 1 ? 'property' : 'properties'} available
      </p>

      {hotels.length === 0 ? (
        <p className="text-muted">No hotels available yet.</p>
      ) : (
        <HotelGrid hotels={hotels} />
      )}
    </main>
  );
}
