import { notFound } from 'next/navigation';

import { getAdminHotels, getAdminRoomType } from '@/actions';
import { PageHeader } from '@/components';

import { RoomTypeForm } from './ui/RoomTypeForm';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ hotelId?: string }>;
}

export default async function AdminRoomTypePage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { hotelId } = await searchParams;

  const isNew = id === 'new';

  const [hotels, roomType] = await Promise.all([
    getAdminHotels({ limit: 100 }),
    isNew ? null : getAdminRoomType(hotelId ?? '', id),
  ]);

  if (!isNew && !roomType) {
    notFound();
  }

  return (
    <>
      <PageHeader
        kicker={isNew ? 'Catalog · New' : 'Catalog · Edit'}
        title={isNew ? 'New room type' : (roomType?.name ?? '')}
      />

      <section className="px-7 pt-6 pb-10">
        <RoomTypeForm
          hotels={hotels.data}
          roomType={roomType ?? undefined}
        />
      </section>
    </>
  );
}
