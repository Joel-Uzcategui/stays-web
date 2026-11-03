import { notFound } from 'next/navigation';

import { getAdminHotel, getHotelPhotos } from '@/actions';
import { PageHeader } from '@/components';
import { photoUrl } from '@/lib/photos';

import { HotelForm } from './ui/HotelForm';
import { HotelPhotos } from './ui/HotelPhotos';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminHotelPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === 'new';

  const hotel = isNew ? null : await getAdminHotel(id);

  if (!isNew && !hotel) {
    notFound();
  }

  // Built here because the storage URL is only known to the server.
  const photos = hotel
    ? (await getHotelPhotos(hotel.id)).map(({ id }) => ({
        id,
        src: photoUrl(id),
      }))
    : [];

  return (
    <>
      <PageHeader
        kicker={isNew ? 'Catalog · New' : 'Catalog · Edit'}
        title={isNew ? 'New hotel' : (hotel?.name ?? '')}
      />

      <section className="px-7 pt-6 pb-10">
        <HotelForm hotel={hotel ?? undefined} />

        <div className="mt-10">
          {hotel ? (
            <HotelPhotos hotelId={hotel.id} photos={photos} />
          ) : (
            <p className="max-w-2xl border-t border-line pt-4 text-sm text-muted">
              Save the hotel first and its photos can be uploaded here.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
