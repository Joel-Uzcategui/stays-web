import { notFound } from 'next/navigation';

import { getAdminHotel } from '@/actions';
import { PageHeader } from '@/components';

import { HotelForm } from './ui/HotelForm';

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

  return (
    <>
      <PageHeader
        kicker={isNew ? 'Catalog · New' : 'Catalog · Edit'}
        title={isNew ? 'New hotel' : (hotel?.name ?? '')}
      />

      <section className="px-7 pt-6 pb-10">
        <HotelForm hotel={hotel ?? undefined} />
      </section>
    </>
  );
}
